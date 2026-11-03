import { Chip } from "@/components/ui/chip";
import type { LocalizedProject } from "@/lib/content";

interface CaseHeroProps {
  project: LocalizedProject;
  labels: {
    eyebrow: string;
    status: string;
    metrics: string;
  };
}

/** Cabecera del case study: título, empresa, rol, año, stack y cifras clave (KeyMetrics). */
export function CaseHero({ project, labels }: CaseHeroProps) {
  return (
    <header className="container-page grid gap-6 pt-12 pb-10 lg:grid-cols-[1fr_340px] lg:pt-16">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-[13px] text-muted">
          {labels.eyebrow} · {project.company} · {project.year} · {labels.status}
        </p>
        <h1 className="font-display text-4xl font-light tracking-[-0.02em] sm:text-5xl">
          {project.title}
        </h1>
        <p className="text-lg text-text-2">{project.role}</p>
        <p className="max-w-[640px] leading-[1.7] text-muted">{project.summary}</p>
        <ul className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <li key={tech}>
              <Chip variant="tech">{tech}</Chip>
            </li>
          ))}
        </ul>
      </div>

      {project.metrics.length > 0 && (
        <section
          aria-label={labels.metrics}
          className="flex flex-col gap-3 self-start rounded-card border border-border bg-surface p-5"
        >
          <dl className="flex flex-col gap-4">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col">
                <dt className="order-2 text-sm text-muted">{metric.label}</dt>
                <dd className="order-1 font-display text-3xl font-semibold text-accent-text">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </header>
  );
}
