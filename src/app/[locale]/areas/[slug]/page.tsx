import { AREA_SLUGS, type AreaSlug } from "@content/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { areaRegistry } from "@/components/areas/registry";
import { routing } from "@/i18n/routing";
import { getArea } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return AREA_SLUGS.map((slug) => ({ slug }));
}

const isAreaSlug = (slug: string): slug is AreaSlug =>
  (AREA_SLUGS as readonly string[]).includes(slug);

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/areas/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isAreaSlug(slug)) return {};
  const area = getArea(slug, locale)!;
  const t = await getTranslations({ locale, namespace: "AreaPage" });
  return pageMetadata({
    href: { pathname: "/areas/[slug]", params: { slug } },
    locale,
    title: t("metaTitle", { area: area.title }),
    description: area.summary,
  });
}

export default async function AreaPage({ params }: PageProps<"/[locale]/areas/[slug]">) {
  const { locale, slug } = await params;
  // Con `cacheComponents` no hay `dynamicParams`: un slug desconocido responde 404 aquí.
  if (!hasLocale(routing.locales, locale) || !isAreaSlug(slug)) notFound();
  setRequestLocale(locale);

  const Page = await areaRegistry[slug]();
  return <Page locale={locale} />;
}
