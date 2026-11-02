import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NotFoundView } from "@/components/layout/not-found-view";
import { routing } from "@/i18n/routing";

/**
 * 404 estática. `src/proxy.ts` reescribe aquí, con status 404, toda URL desconocida bajo un locale.
 * Al ser estática, su HTML sale completo del servidor (sin depender del boundary de `notFound()`).
 */
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/not-found-page">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "NotFound" });
  return { title: t("title"), robots: { index: false, follow: true } };
}

export default async function NotFoundPage({ params }: PageProps<"/[locale]/not-found-page">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <NotFoundView />;
}
