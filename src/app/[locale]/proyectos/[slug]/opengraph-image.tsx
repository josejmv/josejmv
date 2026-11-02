import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getProfile, getProject } from "@/lib/content";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "José M. Vasquez";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const project = getProject(slug, locale);
  const profile = getProfile(locale);
  const t = await getTranslations({ locale, namespace: "CaseStudy" });
  return ogImage({
    eyebrow: t("eyebrow"),
    title: project?.title ?? profile.name,
    description: project?.summary,
    footer: `${profile.name} · ${profile.role}`,
  });
}
