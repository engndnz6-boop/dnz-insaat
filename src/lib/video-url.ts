export type VideoKind = "youtube" | "vimeo" | "file" | "unknown";

export type ParsedVideo = {
  kind: VideoKind;
  /** iframe src veya native video src */
  src: string;
  original: string;
};

function cleanUrl(raw: string): string {
  return (raw || "").trim();
}

export function parseVideoUrl(raw: string): ParsedVideo | null {
  const original = cleanUrl(raw);
  if (!original) return null;

  // YouTube: watch, youtu.be, shorts, embed
  try {
    const withProto = /^https?:\/\//i.test(original)
      ? original
      : `https://${original}`;
    const u = new URL(withProto);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) {
        return {
          kind: "youtube",
          src: `https://www.youtube.com/embed/${id}`,
          original,
        };
      }
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      let id =
        u.searchParams.get("v") ||
        (u.pathname.startsWith("/embed/")
          ? u.pathname.split("/")[2]
          : u.pathname.startsWith("/shorts/")
            ? u.pathname.split("/")[2]
            : "");
      id = (id || "").split("?")[0];
      if (id) {
        return {
          kind: "youtube",
          src: `https://www.youtube.com/embed/${id}`,
          original,
        };
      }
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts.find((p) => /^\d+$/.test(p));
      if (id) {
        return {
          kind: "vimeo",
          src: `https://player.vimeo.com/video/${id}`,
          original,
        };
      }
    }

    // Doğrudan dosya veya site proxy
    if (
      /\.(mp4|webm|ogg)(\?|$)/i.test(u.pathname) ||
      u.pathname.startsWith("/api/onedrive-file") ||
      original.startsWith("/api/onedrive-file")
    ) {
      return { kind: "file", src: original, original };
    }

    // Bilinmeyen https linkini yine de video denemesi için file say
    if (u.protocol === "http:" || u.protocol === "https:") {
      return { kind: "file", src: withProto, original };
    }
  } catch {
    if (original.startsWith("/api/onedrive-file")) {
      return { kind: "file", src: original, original };
    }
  }

  return { kind: "unknown", src: original, original };
}
