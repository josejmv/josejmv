import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HeroSection } from "@/components/sections/home/hero-section";
import { GlobeStaticSvg } from "@/components/three/globe/globe-static-svg";
import { routing } from "@/i18n/routing";
import { getGlobeData, getProfile } from "@/lib/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tGlobe] = await Promise.all([
    getTranslations({ locale, namespace: "Hero" }),
    getTranslations({ locale, namespace: "Globe" }),
  ]);
  const profile = getProfile(locale);
  const globe = getGlobeData(locale);

  return (
    <main>
      <HeroSection
        profile={profile}
        labels={{
          terminalTitle: t("terminalTitle"),
          terminalCommand: t("terminalCommand"),
          contactList: t("contactList"),
        }}
        aside={
          <GlobeStaticSvg
            points={globe.team}
            home={globe.home}
            label={tGlobe("ariaTeam", { count: globe.team.length })}
            className="motion-safe:animate-floaty"
          />
        }
      />
    </main>
  );
}
