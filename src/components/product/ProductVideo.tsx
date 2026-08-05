"use client";

import { parseVideoUrl } from "@/lib/video-url";

export function ProductVideo({
  url,
  title,
  className = "",
}: {
  url: string;
  title?: string;
  className?: string;
}) {
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  if (parsed.kind === "youtube" || parsed.kind === "vimeo") {
    return (
      <div
        className={`relative aspect-video overflow-hidden border border-black/5 bg-black ${className}`}
      >
        <iframe
          src={parsed.src}
          title={title || "Video"}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-video overflow-hidden border border-black/5 bg-black ${className}`}
    >
      <video
        src={parsed.src}
        controls
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-contain"
        title={title || "Video"}
      >
        Tarayıcınız video oynatmayı desteklemiyor.
      </video>
    </div>
  );
}
