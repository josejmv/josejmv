import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CaseHero } from "@/components/projects/case-hero";
import { NextProject } from "@/components/projects/next-project";
import { TableOfContents } from "@/components/projects/table-of-contents";
import { ContactCta } from "@/components/sections/home/contact-cta";
import { routing } from "@/i18n/routing";
import { getCaseStudyToc } from "@/lib/case-study";
import { getCaseStudySlugs, getProfile, getProject } from "@/lib/content";

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

/** Con `cacheComponents` no hay `dynamicParams`: un slug sin case study responde 404 aquí. */
function resolve(locale: string, slug: string) {
  if (!hasLocale(routing.locales, locale) || !getCaseStudySlugs().includes(slug)) return null;
  const project = getProject(slug, locale);
  return project ? { locale, project } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/proyectos/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const found = resolve(locale, slug);
  if (!found) return {};
  return { title: `${found.project.title} · José M. Vasquez`, description: found.project.summary };
}

export default async function CaseStudyPage({ params }: PageProps<"/[locale]/proyectos/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const found = resolve(rawLocale, slug);
  if (!found) notFound();
  const { locale, project } = found;
  setRequestLocale(locale);

  const [t, tProjects, tCta, toc, { default: CaseStudy }] = await Promise.all([
    getTranslations({ locale, namespace: "CaseStudy" }),
    getTranslations({ locale, namespace: "Projects" }),
    getTranslations({ locale, namespace: "Cta" }),
    getCaseStudyToc(locale, slug),
    import(`../../../../../content/projects/${locale}/${slug}.mdx`),
  ]);

  const slugs = getCaseStudySlugs();
  const nextSlug = slugs[(slugs.indexOf(slug) + 1) % slugs.length];
  const next = nextSlug !== slug ? getProject(nextSlug, locale) : undefined;
  const primaryContact = getProfile(locale).contactLinks.find((link) => link.primary)!;

  return (
    <main>
      <CaseHero
        project={project}
        labels={{
          eyebrow: t("eyebrow"),
          status: tProjects(`status.${project.status}`),
          metrics: t("metrics"),
        }}
      />

      <div className="container-page grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <TableOfContents entries={toc} label={t("toc")} />
        <article className="max-w-[720px]">
          <CaseStudy />
        </article>
      </div>

      {next && <NextProject project={next} label={t("next")} />}

      <ContactCta
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        action={tCta("action")}
        href={primaryContact.href}
      />
    </main>
  );
}
