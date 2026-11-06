/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // The Discussion Forum used to live at /news. Keep old links working.
  async redirects() {
    return [
      { source: "/news", destination: "/discussion-forum", permanent: true },
      { source: "/news/:id", destination: "/discussion-forum/:id", permanent: true },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "prideofpakistan.com" },
    ],
  },
};

export default nextConfig;
