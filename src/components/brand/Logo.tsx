"use client";

import Image from "next/image";
import { brand } from "@/lib/brand";

type LogoProps = {
  className?: string;
  /** mark = logo + tagline, markCompact / icon = sadece logo */
  variant?: "mark" | "markCompact" | "icon";
};

export function Logo({ className = "", variant = "mark" }: LogoProps) {
  if (variant === "icon" || variant === "markCompact") {
    return <LogoMark className={className || "h-9 w-auto sm:h-10"} />;
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-10 w-auto sm:h-11" />
      <span className="hidden flex-col leading-none md:flex">
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand-mist">
          {brand.tagline}
        </span>
      </span>
    </span>
  );
}

/** DNZ İnşaat resmi logosu */
export function LogoMark({
  className = "h-10 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={`relative inline-flex items-center overflow-hidden rounded-sm bg-white px-2.5 py-1.5 ${className}`}
    >
      <Image
        src="/logo-dnz.png"
        alt={`${brand.name} logo`}
        width={200}
        height={60}
        className="h-full w-auto max-w-[140px] object-contain object-left sm:max-w-[170px]"
        priority={priority}
      />
    </span>
  );
}
