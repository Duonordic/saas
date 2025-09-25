import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@dn/ui"],
  experimental: {
    reactCompiler: true,
    inlineCss: true,
  },
  logging: {
    fetches: {},
  },
};

export default nextConfig;
