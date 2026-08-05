const GRAPH = "https://graph.microsoft.com/v1.0";
const DEFAULT_FOLDER = "DNZ-Site";

export function isOneDriveConfigured(): boolean {
  return Boolean(
    process.env.MICROSOFT_CLIENT_ID?.trim() &&
      process.env.MICROSOFT_CLIENT_SECRET?.trim() &&
      process.env.MICROSOFT_REFRESH_TOKEN?.trim()
  );
}

function folderRoot(): string {
  return (process.env.ONEDRIVE_FOLDER || DEFAULT_FOLDER).replace(/^\/+|\/+$/g, "");
}

function tenant(): string {
  return process.env.MICROSOFT_TENANT_ID?.trim() || "common";
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.MICROSOFT_CLIENT_ID!.trim();
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!.trim();
  const refreshToken = process.env.MICROSOFT_REFRESH_TOKEN!.trim();

  const res = await fetch(
    `https://login.microsoftonline.com/${tenant()}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        scope: "https://graph.microsoft.com/Files.ReadWrite offline_access",
      }),
      cache: "no-store",
    }
  );

  const data = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description ||
        data.error ||
        "OneDrive oturumu alınamadı. Refresh token yenilenmeli."
    );
  }

  return data.access_token;
}

async function graphFetch(
  path: string,
  init: RequestInit & { rawBody?: ArrayBuffer | Buffer } = {}
): Promise<Response> {
  const token = await getAccessToken();
  const { rawBody, headers, ...rest } = init;
  const res = await fetch(`${GRAPH}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(headers || {}),
    },
    body: rawBody ?? rest.body,
    cache: "no-store",
  });
  return res;
}

/** OneDrive paylaşım linkini doğrudan içerik URL'sine çevirir */
export function shareUrlToContentUrl(shareLink: string): string {
  const base64 = Buffer.from(shareLink, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `https://api.onedrive.com/v1.0/shares/u!${base64}/root/content`;
}

export function isOneDriveImageUrl(src: string): boolean {
  try {
    const host = new URL(src).hostname;
    return (
      host === "api.onedrive.com" ||
      host.endsWith("onedrive.live.com") ||
      host === "1drv.ms" ||
      host.endsWith("sharepoint.com") ||
      host.endsWith("sharepoint-df.com")
    );
  } catch {
    return false;
  }
}

async function ensureFolder(): Promise<void> {
  const name = folderRoot();
  const res = await graphFetch(
    `/me/drive/root:/${encodeURIComponent(name)}`,
    { method: "GET" }
  );
  if (res.ok) return;
  if (res.status !== 404) {
    const err = await res.text();
    throw new Error(`OneDrive klasörü okunamadı: ${err}`);
  }

  const create = await graphFetch("/me/drive/root/children", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      folder: {},
      "@microsoft.graph.conflictBehavior": "fail",
    }),
  });
  if (!create.ok && create.status !== 409) {
    const err = await create.text();
    throw new Error(`OneDrive klasörü oluşturulamadı: ${err}`);
  }
}

/** DNZ-Site/images gibi alt klasör yoksa oluştur */
async function ensureSubfolder(subfolder: string): Promise<void> {
  const root = folderRoot();
  const path = `${root}/${subfolder}`;
  const encoded = path
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  const res = await graphFetch(`/me/drive/root:/${encoded}`, { method: "GET" });
  if (res.ok) return;
  if (res.status !== 404) {
    const err = await res.text();
    throw new Error(`OneDrive alt klasör okunamadı: ${err}`);
  }

  const parentEncoded = encodeURIComponent(root);
  const create = await graphFetch(`/me/drive/root:/${parentEncoded}:/children`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: subfolder,
      folder: {},
      "@microsoft.graph.conflictBehavior": "fail",
    }),
  });
  if (!create.ok && create.status !== 409) {
    const err = await create.text();
    throw new Error(`OneDrive alt klasör oluşturulamadı: ${err}`);
  }
}

async function createAnonymousContentUrl(itemId: string): Promise<string> {
  const res = await graphFetch(`/me/drive/items/${itemId}/createLink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "view", scope: "anonymous" }),
  });
  const data = (await res.json()) as {
    link?: { webUrl?: string };
    error?: { message?: string };
  };
  if (!res.ok || !data.link?.webUrl) {
    // Kişisel hesaplarda anonymous bazen kapalı — organization dene
    const res2 = await graphFetch(`/me/drive/items/${itemId}/createLink`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "view", scope: "organization" }),
    });
    const data2 = (await res2.json()) as {
      link?: { webUrl?: string };
      error?: { message?: string };
    };
    if (res2.ok && data2.link?.webUrl) {
      return shareUrlToContentUrl(data2.link.webUrl);
    }
    throw new Error(
      data.error?.message ||
        data2.error?.message ||
        "OneDrive paylaşım linki oluşturulamadı. OneDrive’da dosya paylaşımına izin verin."
    );
  }
  return shareUrlToContentUrl(data.link.webUrl);
}

function safeFileName(name: string): string {
  return name
    .replace(/[^\w.\-ğüşıöçĞÜŞİÖÇ]+/gi, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function uploadToOneDrive(opts: {
  fileName: string;
  contentType: string;
  bytes: ArrayBuffer | Buffer;
  subfolder?: string;
}): Promise<{ url: string; itemId: string }> {
  if (!isOneDriveConfigured()) {
    throw new Error("OneDrive yapılandırılmamış.");
  }

  await ensureFolder();
  if (opts.subfolder) {
    await ensureSubfolder(opts.subfolder);
  }

  const fileName = `${Date.now()}-${safeFileName(opts.fileName)}`;
  const encodedPath = `/me/drive/root:/${[
    folderRoot(),
    ...(opts.subfolder ? [opts.subfolder] : []),
    fileName,
  ]
    .map((s) => encodeURIComponent(s))
    .join("/")}:/content`;

  const res = await graphFetch(encodedPath, {
    method: "PUT",
    headers: {
      "Content-Type": opts.contentType || "application/octet-stream",
    },
    rawBody: opts.bytes,
  });

  const data = (await res.json()) as {
    id?: string;
    error?: { message?: string };
  };
  if (!res.ok || !data.id) {
    throw new Error(data.error?.message || `Yükleme başarısız (${res.status})`);
  }

  const url = await createAnonymousContentUrl(data.id);
  return { url, itemId: data.id };
}

export async function readJsonFromOneDrive<T>(fileName: string): Promise<T | null> {
  if (!isOneDriveConfigured()) return null;
  await ensureFolder();
  const encodedPath = `/me/drive/root:/${[folderRoot(), fileName]
    .map((s) => encodeURIComponent(s))
    .join("/")}:/content`;

  const res = await graphFetch(encodedPath, { method: "GET" });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OneDrive okuma hatası: ${err}`);
  }
  return (await res.json()) as T;
}

export async function writeJsonToOneDrive(
  fileName: string,
  data: unknown
): Promise<void> {
  if (!isOneDriveConfigured()) {
    throw new Error("OneDrive yapılandırılmamış.");
  }
  await ensureFolder();
  const encodedPath = `/me/drive/root:/${[folderRoot(), fileName]
    .map((s) => encodeURIComponent(s))
    .join("/")}:/content`;

  const body = Buffer.from(JSON.stringify(data, null, 2), "utf8");
  const res = await graphFetch(encodedPath, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    rawBody: body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OneDrive yazma hatası: ${err}`);
  }
}

export async function probeOneDrive(): Promise<{ ok: boolean; message: string }> {
  if (!isOneDriveConfigured()) {
    return {
      ok: false,
      message:
        "OneDrive env değişkenleri eksik (MICROSOFT_CLIENT_ID, SECRET, REFRESH_TOKEN).",
    };
  }
  try {
    await ensureFolder();
    return {
      ok: true,
      message: `Bağlı · klasör: ${folderRoot()}`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "OneDrive bağlantı hatası",
    };
  }
}
