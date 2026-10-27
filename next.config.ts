import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production builds must not overwrite a running development server's files.
  // PORT also isolates local dev instances when more than one is running.
  distDir: process.env.NODE_ENV === "development"
    ? `.next-dev-${process.env.PORT ?? "3000"}`
    : ".next",
};

export default nextConfig;
