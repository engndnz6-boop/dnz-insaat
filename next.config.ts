import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Eski hesaplama adresi yeni İmalat Sistemleri sayfasına yönlenir (Google ve eski bağlantılar için)
  async redirects() {
    return [
      { source: "/hesaplama", destination: "/imalat-sistemleri", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.onedrive.com",
      },
      {
        protocol: "https",
        hostname: "**.onedrive.live.com",
      },
      {
        protocol: "https",
        hostname: "**.sharepoint.com",
      },
      {
        protocol: "https",
        hostname: "1drv.ms",
      },
    ],
  },
};

export default nextConfig;
