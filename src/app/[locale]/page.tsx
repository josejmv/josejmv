import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return (
    <main className="min-h-dvh bg-bg px-6 py-24 text-text">
      <h1 className="font-display text-4xl">{t("title")}</h1>
    </main>
  );
}
