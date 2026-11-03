import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AreasShowcase } from "@/components/sections/home/areas-showcase";
import { CareerSection } from "@/components/sections/home/career-section";
import { getTerminalProps } from "@/components/contact/terminal/terminal-props";
import { ContactCta } from "@/components/sections/home/contact-cta";
import { EducationCard } from "@/components/sections/home/education-card";
import { HeroSection } from "@/components/sections/home/hero-section";
import { StackCloud } from "@/components/sections/home/stack-cloud";
import { StatsStrip } from "@/components/sections/home/stats-strip";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import { GlobeLegend } from "@/components/three/globe/globe-legend";
import { GlobeStaticSvg } from "@/components/three/globe/globe-static-svg";
import { GlobeTabs } from "@/components/three/globe/globe-tabs";
import { routing } from "@/i18n/routing";
import {
  getAreas,
  getEducation,
  getExperience,
  getGlobeData,
  getProfile,
  getStack,
  getStats,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { getCurrentMonth } from "@/lib/time";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    href: "/",
    locale,
    title: t("title"),
    description: t("description"),
    type: "profile",
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tGlobe, tStats, tAreas, tCareer, tEducation, tStack, tCta, now] = await Promise.all([
    getTranslations({ locale, namespace: "Hero" }),
    getTranslations({ locale, namespace: "Globe" }),
    getTranslations({ locale, namespace: "Stats" }),
    getTranslations({ locale, namespace: "Areas" }),
    getTranslations({ locale, namespace: "Career" }),
    getTranslations({ locale, namespace: "Education" }),
    getTranslations({ locale, namespace: "Stack" }),
    getTranslations({ locale, namespace: "Cta" }),
    getCurrentMonth(),
  ]);
  const terminal = await getTerminalProps(locale);
  const profile = getProfile(locale);
  const globe = getGlobeData(locale);

  const primaryContact = profile.contactLinks.find((link) => link.primary)!;
  const languages = profile.languages.map((l) =>
    tGlobe("language", { name: l.name, level: l.level }),
  );
  const legend = (summary: string) => (
    <GlobeLegend highlight={tGlobe("multicultural")} languages={languages} summary={summary} />
  );

  return (
    <main>
      <PersonJsonLd
        profile={profile}
        locale={locale}
        knowsAbout={getAreas(locale).map((area) => area.title)}
      />
      <HeroSection
        profile={profile}
        terminal={terminal}
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
                    label={tGlobe("ariaTeam", {
                      count: globe.team.length,
                      origin: globe.home.name,
                    })}
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
          allAreas: tAreas("allAreas"),
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

      <div className="container-page mt-4 grid gap-4 md:grid-cols-2">
        <EducationCard title={tEducation("title")} items={getEducation(locale)} />
        <StackCloud title={tStack("title")} items={getStack()} />
      </div>

      <ContactCta
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        action={tCta("action")}
        secondary={tCta("secondary")}
        href={primaryContact.href}
      />
    </main>
  );
}
