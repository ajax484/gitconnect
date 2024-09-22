/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["appwrite", "node-appwrite"],
  },
};

export default nextConfig;
