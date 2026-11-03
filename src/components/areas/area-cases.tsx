import { Link } from "@/i18n/navigation";
import type { LocalizedArea } from "@/lib/content";

interface AreaCasesProps {
  cases: LocalizedArea["cases"];
  /** Slugs de proyectos con case study: solo esos casos enlazan. */
  caseStudies: string[];
  labels: {
    title: string;
    readMore: string;
  };
}

/** Casos concretos del área. Si el proyecto del caso tiene case study, enlaza a él. */
export function AreaCases({ cases, caseStudies, labels }: AreaCasesProps) {
  return (
    <section aria-labelledby="cases-title" className="container-page mt-12">
      <h2 id="cases-title" className="mb-4 font-display text-2xl font-semibold">
        {labels.title}
      </h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {cases.map((item) => (
          <li
            key={item.title}
            className="flex flex-col gap-2 rounded-card border border-border bg-surface p-6"
          >
            <h3 className="font-display text-lg font-semibold">{item.title}</h3>
            <p className="text-sm leading-[1.7] text-muted">{item.body}</p>
            {item.project && caseStudies.includes(item.project) && (
              <Link
                href={{ pathname: "/proyectos/[slug]", params: { slug: item.project } }}
                className="mt-auto inline-flex min-h-11 items-center self-start text-sm text-accent-text underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
              >
                {labels.readMore}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
