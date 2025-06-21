import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS images
      },
      {
        protocol: "http",
        hostname: "localhost", // Allow HTTP images from localhost
      },
    ],
  },
  
  
};

export default nextConfig;
