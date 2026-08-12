const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB
/** Graph: chunk boyutu 320 KiB’nin katı olmalı */
const CHUNK_SIZE = 320 * 1024 * 10; // 3.2 MB

function buildProxyUrl(itemId: string, fileName?: string): string {
  const params = new URLSearchParams({ id: itemId });
  if (fileName) params.set("name", fileName);
  return `/api/onedrive-file?${params.toString()}`;
}

export async function uploadVideoToOneDrive(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (
    !file.type.startsWith("video/") &&
    !/\.(mp4|webm|ogg|mov)$/i.test(file.name)
  ) {
    throw new Error("Sadece video dosyası yükleyin (MP4 / WEBM / MOV).");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("Video en fazla 200 MB olabilir.");
  }
  if (file.size < 1) {
    throw new Error("Boş video dosyası.");
  }

  const sessionRes = await fetch("/api/admin/upload-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name || "video.mp4",
      kind: "video",
    }),
  });
  const session = (await sessionRes.json().catch(() => ({}))) as {
    uploadUrl?: string;
    fileName?: string;
    error?: string;
  };
  if (!sessionRes.ok || !session.uploadUrl) {
    throw new Error(session.error || "Video yükleme oturumu açılamadı.");
  }

  const total = file.size;
  let start = 0;
  let itemId = "";

  while (start < total) {
    const end = Math.min(start + CHUNK_SIZE, total) - 1;
    const chunk = file.slice(start, end + 1);
    const res = await fetch(session.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Length": String(chunk.size),
        "Content-Range": `bytes ${start}-${end}/${total}`,
      },
      body: chunk,
    });

    if (res.status === 202) {
      start = end + 1;
      onProgress?.(Math.round((start / total) * 100));
      continue;
    }

    if (res.status === 200 || res.status === 201) {
      const data = (await res.json()) as { id?: string };
      if (!data.id) {
        throw new Error("Video yüklendi ama dosya kimliği alınamadı.");
      }
      itemId = data.id;
      onProgress?.(100);
      break;
    }

    const errText = await res.text().catch(() => "");
    throw new Error(
      `Video yükleme başarısız (HTTP ${res.status}). ${errText.slice(0, 160)}`
    );
  }

  if (!itemId) {
    throw new Error("Video yüklemesi tamamlanamadı.");
  }

  return buildProxyUrl(itemId, session.fileName || file.name);
}
