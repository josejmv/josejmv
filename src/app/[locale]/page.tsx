import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AreasShowcase } from "@/components/sections/home/areas-showcase";
import { CareerSection } from "@/components/sections/home/career-section";
import { HeroSection } from "@/components/sections/home/hero-section";
import { StatsStrip } from "@/components/sections/home/stats-strip";
import { GlobeLegend } from "@/components/three/globe/globe-legend";
import { GlobeStaticSvg } from "@/components/three/globe/globe-static-svg";
import { GlobeTabs } from "@/components/three/globe/globe-tabs";
import { routing } from "@/i18n/routing";
import { getAreas, getExperience, getGlobeData, getProfile, getStats } from "@/lib/content";
import { getCurrentMonth } from "@/lib/time";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tGlobe, tStats, tAreas, tCareer, now] = await Promise.all([
    getTranslations({ locale, namespace: "Hero" }),
    getTranslations({ locale, namespace: "Globe" }),
    getTranslations({ locale, namespace: "Stats" }),
    getTranslations({ locale, namespace: "Areas" }),
    getTranslations({ locale, namespace: "Career" }),
    getCurrentMonth(),
  ]);
  const profile = getProfile(locale);
  const globe = getGlobeData(locale);

  const languages = profile.languages.map((l) =>
    tGlobe("language", { name: l.name, level: l.level }),
  );
  const legend = (summary: string) => (
    <GlobeLegend highlight={tGlobe("multicultural")} languages={languages} summary={summary} />
  );

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
          <GlobeTabs
            label={tGlobe("tabsLabel")}
            home={globe.home}
            views={{
              team: {
                label: tGlobe("tabTeam", { count: globe.team.length }),
                points: globe.team,
                fallback: (
                  <GlobeStaticSvg
                    points={globe.team}
                    home={globe.home}
                    label={tGlobe("ariaTeam", { count: globe.team.length })}
                  />
                ),
                legend: legend(
                  tGlobe("teamSummary", { list: globe.team.map((c) => c.name).join(" · ") }),
                ),
              },
              company: {
                label: tGlobe("tabCompany", { count: globe.company.length }),
                points: globe.company,
                fallback: (
                  <GlobeStaticSvg
                    points={globe.company}
                    home={globe.home}
                    label={tGlobe("ariaCompany", { count: globe.company.length })}
                  />
                ),
                legend: legend(
                  tGlobe("companySummary", {
                    list: globe.company
                      .map((c) => `${c.name} (${c.companies?.join(", ")})`)
                      .join(" · "),
                  }),
                ),
              },
            }}
          />
        }
      />

      <StatsStrip stats={getStats(locale)} label={tStats("label")} />

      <AreasShowcase
        areas={getAreas(locale)}
        defaultSlug="backend-pagos"
        labels={{
          title: tAreas("title"),
          note: tAreas("note"),
          tabs: tAreas("tabs"),
          impact: tAreas("impact"),
          cases: (area) => tAreas("cases", { area }),
        }}
      />

      <CareerSection
        roles={getExperience(locale)}
        now={now}
        locale={locale}
        labels={{
          title: tCareer("title"),
          fullLink: tCareer("fullLink"),
          list: tCareer("list"),
          present: tCareer("present"),
        }}
      />
    </main>
  );
}
