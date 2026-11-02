import type { AreaSlug } from "@content/schema";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ProjectCard } from "@/components/projects/project-card";
import { ContactCta } from "@/components/sections/home/contact-cta";
import { getArea, getCaseStudySlugs, getProfile, getProjects } from "@/lib/content";

import { AreaCases } from "./area-cases";
import { AreaHero } from "./area-hero";

interface AreaShellProps {
  slug: AreaSlug;
  locale: "es" | "en";
  /** Módulo firma del área (SignatureModule). */
  children?: ReactNode;
}

/**
 * Shell común de las páginas de área (wireframe "Áreas"): AreaHero · módulo firma · AreaCases ·
 * RelatedProjects · ContactCta. Cada área solo aporta su módulo firma.
 */
export async function AreaShell({ slug, locale, children }: AreaShellProps) {
  const [t, tAreas, tProjects, tCta] = await Promise.all([
    getTranslations({ locale, namespace: "AreaPage" }),
    getTranslations({ locale, namespace: "Areas" }),
    getTranslations({ locale, namespace: "Projects" }),
    getTranslations({ locale, namespace: "Cta" }),
  ]);
  const area = getArea(slug, locale)!;
  const related = getProjects(locale).filter((project) => project.areas.includes(slug));
  const primaryContact = getProfile(locale).contactLinks.find((link) => link.primary)!;

  return (
    <main>
      <AreaHero area={area} labels={{ eyebrow: t("eyebrow"), impact: tAreas("impact") }} />

      {children}

      <AreaCases
        cases={area.cases}
        caseStudies={getCaseStudySlugs()}
        labels={{ title: t("cases"), readMore: t("readCase") }}
      />

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-page mt-12">
          <h2 id="related-title" className="mb-4 font-display text-2xl font-semibold">
            {t("related")}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {related.map((project) => (
              <li key={project.slug}>
                <ProjectCard
                  project={project}
                  labels={{
                    status: tProjects(`status.${project.status}`),
                    readCase: tProjects("readCase"),
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContactCta
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        action={tCta("action")}
        href={primaryContact.href}
      />
    </main>
  );
}
