/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-select",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-dialog",
      "lucide-react",
    ],
  },
};

export default nextConfig;
