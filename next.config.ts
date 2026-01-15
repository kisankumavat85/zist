import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["pdf-parse"], // This will add packages to serverless env
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb", // TODO: Remove: if api created for resource upload
    },
  },
};

export default nextConfig;
