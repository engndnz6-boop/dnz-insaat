"use client";

import Image from "next/image";
import { useSiteSettings } from "@/lib/site-settings-context";

type LogoProps = {
  className?: string;
  /** mark = logo + şirket adı, markCompact / icon = sadece logo */
  variant?: "mark" | "markCompact" | "icon";
  /** Hero gibi koyu zeminde beyaz kutu kullanma */
  plain?: boolean;
};

function isRemoteLogo(src: string): boolean {
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/api/") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  );
}

/** DNZ logosu — oran korunur, bozulmaz */
export function LogoMark({
  className = "h-10",
  priority = false,
  plain = false,
}: {
  className?: string;
  priority?: boolean;
  plain?: boolean;
}) {
  const { settings } = useSiteSettings();
  const src = settings.logoUrl || "/logo-dnz.png";
  const remote = isRemoteLogo(src);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${
        plain ? "" : "rounded-sm bg-white px-2 py-1"
      } ${className}`}
    >
      {remote ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${settings.companyName} logo`}
          className="block h-full w-auto max-w-[160px] object-contain object-left"
        />
      ) : (
        <Image
          src={src}
          alt={`${settings.companyName} logo`}
          width={200}
          height={60}
          className="block h-full w-auto max-w-[160px] object-contain object-left"
          priority={priority}
        />
      )}
    </span>
  );
}

export function Logo({
  className = "",
  variant = "mark",
  plain = false,
}: LogoProps) {
  const { settings } = useSiteSettings();

  if (variant === "icon" || variant === "markCompact") {
    return (
      <LogoMark
        className={className || "h-9 sm:h-10"}
        plain={plain}
        priority
      />
    );
  }

  return (
    <span className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
      <LogoMark className="h-9 sm:h-10" plain={plain} priority />
      <span className="hidden min-w-0 md:block">
        <span className="block truncate text-sm font-semibold tracking-wide text-white">
          {settings.companyName}
        </span>
      </span>
    </span>
  );
}
