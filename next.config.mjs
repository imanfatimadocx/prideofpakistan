/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "prideofpakistan.com" },
    ],
  },
};

export default nextConfig;
