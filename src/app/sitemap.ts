import { AREA_SLUGS } from "@content/schema";
import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getCaseStudySlugs } from "@/lib/content";
import { localizedAlternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type Href = Parameters<typeof localizedAlternates>[0];

/** Todas las rutas públicas, una entrada por locale, cada una con su par `hreflang`. */
export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs: { href: Href; priority: number }[] = [
    { href: "/", priority: 1 },
    { href: "/experiencia", priority: 0.9 },
    { href: "/proyectos", priority: 0.9 },
    ...getCaseStudySlugs().map((slug) => ({
      href: { pathname: "/proyectos/[slug]" as const, params: { slug } },
      priority: 0.8,
    })),
    ...AREA_SLUGS.map((slug) => ({
      href: { pathname: "/areas/[slug]" as const, params: { slug } },
      priority: 0.7,
    })),
  ];

  return hrefs.flatMap(({ href, priority }) =>
    routing.locales.map((locale) => {
      const { canonical, languages } = localizedAlternates(href, locale);
      const absolute = Object.fromEntries(
        Object.entries(languages ?? {}).map(([l, path]) => [l, `${SITE_URL}${path as string}`]),
      );
      return {
        url: `${SITE_URL}${canonical as string}`,
        priority,
        alternates: { languages: absolute },
      };
    }),
  );
}
