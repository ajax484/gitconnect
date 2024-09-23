/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["appwrite", "node-appwrite"],
  },
  images: {
    domains: ["cloud.appwrite.io"],
  },
};

export default nextConfig;
