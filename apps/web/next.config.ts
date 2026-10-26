import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Paid ebooks live outside public/ and ship only with the route that checks the order.
  outputFileTracingIncludes: { '/api/shop/ebook': ['./private/ebooks/**'] },
  images: {
    // 90 is used for Alice's illustrations so her pencil texture stays crisp.
    qualities: [75, 90],
    // Thumbnails for channel uploads that don't have their own page yet (src/lib/youtube.ts).
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' }],
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
