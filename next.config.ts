import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // MDX solo se importa desde content/projects (case studies); no hay páginas .mdx en src/app.
  pageExtensions: ["ts", "tsx", "mdx"],
  // Enlaces del portafolio anterior que pueden seguir circulando (CV compartido, LinkedIn).
  async redirects() {
    return [
      { source: "/assets/cv/:file*", destination: "/cv/jose-vasquez-cv.pdf", permanent: true },
    ];
  },
  async headers() {
    // El kill switch del service worker viejo nunca debe quedar en caché HTTP.
    return [{ source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store" }] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    // Con Turbopack los plugins van por nombre (no se pueden pasar funciones a Rust).
    rehypePlugins: ["rehype-slug"],
  },
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(withMDX(nextConfig));
