import type { Metadata } from "next";
import { ClientMessages } from "@/components/i18n/client-messages";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/layout/page-hero";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectGrid } from "@/components/projects/project-grid";
import { ContactCta } from "@/components/sections/home/contact-cta";
import { routing } from "@/i18n/routing";
import { getAreas, getProfile, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/proyectos">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Projects" });
  return pageMetadata({
    href: "/proyectos",
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/proyectos">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tCta] = await Promise.all([
    getTranslations({ locale, namespace: "Projects" }),
    getTranslations({ locale, namespace: "Cta" }),
  ]);
  const projects = getProjects(locale);
  const profile = getProfile(locale);
  const primaryContact = profile.contactLinks.find((link) => link.primary)!;

  // Solo las áreas y tecnologías que tienen al menos un proyecto, las más usadas primero.
  const usedAreas = new Set(projects.flatMap((p) => p.areas));
  const techCount = new Map<string, number>();
  for (const tech of projects.flatMap((p) => p.tech)) {
    techCount.set(tech, (techCount.get(tech) ?? 0) + 1);
  }
  const tech = [...techCount.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([value]) => ({ value, label: value }));

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <div className="container-page">
        <ClientMessages namespaces={["Projects"]}>
          <ProjectGrid
            areas={getAreas(locale)
              .filter((area) => usedAreas.has(area.slug))
              .map((area) => ({ value: area.slug, label: area.title }))}
            tech={tech}
            items={projects.map((project) => ({
              slug: project.slug,
              areas: project.areas,
              tech: project.tech,
              card: (
                <ProjectCard
                  project={project}
                  labels={{
                    status: t(`status.${project.status}`),
                    readCase: t("readCase"),
                  }}
                />
              ),
            }))}
          />
        </ClientMessages>
      </div>

      <ContactCta
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        action={tCta("action")}
        href={primaryContact.href}
      />
    </main>
  );
}
