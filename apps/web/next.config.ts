import { resolve } from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@watchmogged/api",
    "@watchmogged/config",
    "@watchmogged/db",
    "@watchmogged/types",
    "@watchmogged/utils",
  ],
  turbopack: {
    root: resolve(import.meta.dirname, "../.."),
  },
};

export default nextConfig;
