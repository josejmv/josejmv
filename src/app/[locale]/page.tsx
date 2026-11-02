import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HeroSection } from "@/components/sections/home/hero-section";
import { routing } from "@/i18n/routing";
import { getProfile } from "@/lib/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Hero" });
  const profile = getProfile(locale);

  return (
    <main>
      <HeroSection
        profile={profile}
        labels={{
          terminalTitle: t("terminalTitle"),
          terminalCommand: t("terminalCommand"),
          contactList: t("contactList"),
        }}
      />
    </main>
  );
}
