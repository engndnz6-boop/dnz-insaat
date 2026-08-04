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

/**
 * http(s)/path görselleri next/image ile,
 * idb: ve data: görselleri native img ile gösterir.
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

  const local = resolved.startsWith("blob:") || resolved.startsWith("data:");

  if (local) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={resolved}
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
