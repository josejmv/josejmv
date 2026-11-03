import type { Metadata } from "next";
import { ClientMessages } from "@/components/i18n/client-messages";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CareerGantt } from "@/components/charts/career-gantt";
import { ExperienceCard } from "@/components/experience/experience-card";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";
import { MetricHighlight } from "@/components/experience/metric-highlight";
import { PageHero } from "@/components/layout/page-hero";
import { ContactCta } from "@/components/sections/home/contact-cta";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";
import { getAreas, getExperience, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { getCurrentMonth } from "@/lib/time";

/** Ruta pública del CV (un único PDF, en inglés). */
const CV_HREF = "/cv/jose-vasquez-cv.pdf";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/experiencia">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Experience" });
  return pageMetadata({
    href: "/experiencia",
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ExperiencePage({ params }: PageProps<"/[locale]/experiencia">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tCareer, tCta, now] = await Promise.all([
    getTranslations({ locale, namespace: "Experience" }),
    getTranslations({ locale, namespace: "Career" }),
    getTranslations({ locale, namespace: "Cta" }),
    getCurrentMonth(),
  ]);
  const roles = getExperience(locale);
  const areas = getAreas(locale);
  const profile = getProfile(locale);
  const primaryContact = profile.contactLinks.find((link) => link.primary)!;

  const month = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const format = (yearMonth: string) => month.format(new Date(`${yearMonth}-01T00:00:00Z`));
  const period = (start: string, end: string | null) =>
    `${format(start)} – ${end ? format(end) : tCareer("present")}`;

  // Una métrica verificada por área técnica (content/areas.ts).
  const highlights = areas.flatMap((area) =>
    area.metrics.slice(0, 1).map((metric) => ({ area: area.title, metric })),
  );

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
        <Button href={CV_HREF} download variant="secondary" shape="pill" className="self-start">
          {t("download")}
        </Button>
      </PageHero>

      <section aria-labelledby="gantt-title" className="container-page">
        <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-5 sm:p-[30px]">
          <h2 id="gantt-title" className="font-display text-xl font-semibold">
            {t("ganttTitle")}
          </h2>
          <CareerGantt
            roles={roles}
            now={now}
            locale={locale}
            labels={{ list: tCareer("list"), present: tCareer("present") }}
          />
        </div>
      </section>

      <div className="container-page mt-10">
        <ClientMessages namespaces={["Experience"]}>
          <ExperienceTimeline
            areas={areas.map((area) => ({ value: area.slug, label: area.title }))}
            items={roles.map((role, index) => ({
              id: role.id,
              areas: role.areas,
              card: (
                <ExperienceCard
                  role={role}
                  period={period(role.start, role.end)}
                  open={index === 0}
                  labels={{
                    highlights: t("highlights"),
                    projects: t("projects"),
                    stack: t("stack"),
                  }}
                />
              ),
            }))}
          />
        </ClientMessages>
      </div>

      <section aria-labelledby="metrics-title" className="container-page mt-10">
        <h2 id="metrics-title" className="mb-4 font-display text-xl font-semibold">
          {t("metricsTitle")}
        </h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {highlights.map(({ area, metric }) => (
            <li key={metric.label}>
              <MetricHighlight
                delta={metric.delta}
                label={metric.label}
                detail={`${metric.before} → ${metric.after}`}
                context={area}
              />
            </li>
          ))}
        </ul>
      </section>

      <ContactCta
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        action={tCta("action")}
        href={primaryContact.href}
      />
    </main>
  );
}
