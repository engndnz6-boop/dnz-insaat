"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  fromIdbImageRef,
  getFileBlob,
  isIdbImageRef,
} from "@/lib/pdf-storage";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

/** Harici URL’ler (ImgBB, Drive, OneDrive…) — next/image domain listesine bağlı kalmaz */
function useNativeImg(src: string): boolean {
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    // Dinamik API ile dönen görsellerde Next Image yerine <img> daha sorunsuz çalışır
    src.startsWith("/api/")
  );
}

function isOneDriveShareContentUrl(src: string): boolean {
  // createAnonymousContentUrl() bu formatta URL döndürür:
  // https://api.onedrive.com/v1.0/shares/u!<...>/root/content
  try {
    const u = new URL(src);
    return (
      (u.hostname === "api.onedrive.com" ||
        u.hostname.endsWith("onedrive.live.com")) &&
      u.pathname.includes("/shares/") &&
      u.pathname.includes("/content")
    );
  } catch {
    return false;
  }
}

/**
 * Yerel path → next/image;
 * http(s) / idb / data / blob → native img (herhangi bir URL çalışır).
 */
export function ProductImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  width,
  height,
}: Props) {
  const [resolved, setResolved] = useState<string | null>(
    !src || isIdbImageRef(src) ? null : src
  );

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    if (!src) {
      setResolved(null);
      return;
    }

    if (!isIdbImageRef(src)) {
      setResolved(src);
      return;
    }

    setResolved(null);
    (async () => {
      const blob = await getFileBlob(fromIdbImageRef(src));
      if (cancelled) return;
      if (!blob) {
        setResolved(null);
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      setResolved(objectUrl);
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!resolved) {
    return (
      <span
        className={`block bg-brand-slate/40 ${fill ? "absolute inset-0" : ""} ${className || ""}`}
        aria-label={alt}
      />
    );
  }

  const imgSrc = isOneDriveShareContentUrl(resolved)
    ? `/api/image-proxy?url=${encodeURIComponent(resolved)}`
    : resolved;

  if (useNativeImg(imgSrc)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={`${fill ? "absolute inset-0 h-full w-full object-cover" : ""} ${className || ""}`}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width || 400}
      height={height || 400}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
