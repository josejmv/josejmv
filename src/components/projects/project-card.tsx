import { Chip } from "@/components/ui/chip";
import { Link } from "@/i18n/navigation";
import type { LocalizedProject } from "@/lib/content";
import { cn } from "@/lib/cn";

interface ProjectCardProps {
  project: LocalizedProject;
  labels: {
    status: string;
    readCase: string;
  };
}

const STATUS_DOT: Record<LocalizedProject["status"], string> = {
  production: "bg-success",
  preproduction: "bg-accent-text",
  "in-development": "bg-accent-2",
};

/** Tarjeta de proyecto. Si tiene case study, toda la tarjeta enlaza a él (enlace en el título). */
export function ProjectCard({ project, labels }: ProjectCardProps) {
  return (
    <article className="relative flex h-full flex-col gap-4 rounded-card border border-border bg-surface p-6 transition-colors focus-within:border-accent-text/50 hover:border-accent-text/40">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted">
        <span>
          {project.company} · {project.year}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={cn("size-1.5 rounded-full", STATUS_DOT[project.status])}
          />
          {labels.status}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl font-semibold">
          {project.caseStudy ? (
            <Link
              href={{ pathname: "/proyectos/[slug]", params: { slug: project.slug } }}
              className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h2>
        <p className="text-sm text-text-2">{project.role}</p>
      </div>

      <p className="text-sm leading-[1.7] text-muted">{project.summary}</p>

      {project.metrics.length > 0 && (
        <dl className="grid grid-cols-2 gap-3">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col rounded-xl bg-surface-2 p-3">
              <dt className="order-2 text-xs leading-snug text-muted">{metric.label}</dt>
              <dd className="order-1 font-display text-lg font-semibold text-accent-text">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <ul className="mt-auto flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <li key={tech}>
            <Chip variant="tech">{tech}</Chip>
          </li>
        ))}
      </ul>

      {project.caseStudy && (
        <p aria-hidden="true" className="text-sm text-accent-text">
          {labels.readCase}
        </p>
      )}
    </article>
  );
}
