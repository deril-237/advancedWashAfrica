import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://localhost:3000"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "api.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "pin.it",
      },
    ],
  },

  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
