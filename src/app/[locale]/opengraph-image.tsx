import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { getProfile } from "@/lib/content";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "José M. Vasquez";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Imagen OG por defecto de todo el sitio (la heredan las páginas sin una propia). */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const profile = getProfile(locale);
  return ogImage({
    eyebrow: profile.role,
    title: profile.name,
    description: profile.headline,
    footer: profile.location,
  });
}
