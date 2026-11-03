import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AreasList } from "@/components/areas/index/areas-list";
import { ConstellationStage } from "@/components/areas/index/constellation-stage";
import { GradientHero } from "@/components/layout/gradient-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactCta } from "@/components/sections/home/contact-cta";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getConstellation, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/areas">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "AreasIndex" });
  return pageMetadata({
    href: "/areas",
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

/** Índice de áreas: constelación 3D (ADR 0006) y la lista de las 6 áreas. */
export default async function AreasIndexPage({ params }: PageProps<"/[locale]/areas">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tCta] = await Promise.all([
    getTranslations({ locale, namespace: "AreasIndex" }),
    getTranslations({ locale, namespace: "Cta" }),
  ]);
  const graph = getConstellation(locale);
  const profile = getProfile(locale);
  const primaryContact = profile.contactLinks.find((link) => link.primary)!;
  const url = (href: Parameters<typeof getPathname>[0]["href"]) =>
    `${SITE_URL}${getPathname({ href, locale })}`;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("metaTitle"),
          description: t("metaDescription"),
          url: url("/areas"),
          inLanguage: locale,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: graph.nodes.map((node, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: node.title,
              url: url({ pathname: "/areas/[slug]", params: { slug: node.id } }),
            })),
          },
        }}
      />

      <GradientHero
        size="md"
        eyebrow={t("eyebrow")}
        titleStart={t("titleStart")}
        titleHighlight={t("titleHighlight")}
        lead={t("lead")}
      />

      <ConstellationStage
        graph={graph}
        labels={{
          groupLabel: t("groupLabel"),
          sceneNote: t("sceneNote"),
          sceneNote2d: t("sceneNote2d"),
          core: profile.monogram.replace(/\.$/, ""),
          connectsWith: t("connectsWith"),
          stack: t("stack"),
          explore: t.raw("explore") as string,
        }}
      />

      <AreasList nodes={graph.nodes} labels={{ title: t("listTitle"), seeArea: t("seeArea") }} />

      <ContactCta
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        action={tCta("action")}
        href={primaryContact.href}
      />
    </main>
  );
}
