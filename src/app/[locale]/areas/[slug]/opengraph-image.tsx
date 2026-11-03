import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getArea, getProfile } from "@/lib/content";
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
  const area = getArea(slug as Parameters<typeof getArea>[0], locale);
  const profile = getProfile(locale);
  const t = await getTranslations({ locale, namespace: "Nav" });
  return ogImage({
    eyebrow: t("areas"),
    title: area?.title ?? profile.name,
    description: area?.summary,
    footer: `${profile.name} · ${profile.role}`,
  });
}
