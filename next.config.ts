import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
