import type { Metadata } from "next";

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];
type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * `canonical` + `hreflang` de una ruta. Las URLs son relativas: `metadataBase` (layout) las vuelve
 * absolutas. `x-default` apunta al locale por defecto.
 */
export function localizedAlternates(
  href: Href,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = getPathname({ href, locale: l });
  languages["x-default"] = languages[routing.defaultLocale];
  return { canonical: languages[locale], languages };
}

/** Metadata común de una página: título, descripción, alternates y Open Graph coherentes. */
export function pageMetadata({
  href,
  locale,
  title,
  description,
  type = "website",
}: {
  href: Href;
  locale: Locale;
  title: string;
  description: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  const alternates = localizedAlternates(href, locale);
  return {
    title,
    description,
    alternates,
    openGraph: {
      type,
      title,
      description,
      url: alternates.canonical as string,
      locale: locale === "es" ? "es_CO" : "en_US",
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => (l === "es" ? "es_CO" : "en_US")),
      siteName: "José M. Vasquez",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
