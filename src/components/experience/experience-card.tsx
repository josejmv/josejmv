import { Chip } from "@/components/ui/chip";
import type { LocalizedExperience } from "@/lib/content";

interface ExperienceCardProps {
  role: LocalizedExperience;
  period: string;
  labels: {
    highlights: string;
    projects: string;
    stack: string;
  };
  /** El rol más reciente abre sus logros por defecto. */
  open?: boolean;
}

const summaryClasses =
  "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-1 text-sm font-semibold text-text-2 transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text [&::-webkit-details-marker]:hidden";

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className="size-4 shrink-0 transition-transform group-open:rotate-180"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * Tarjeta de un rol (wireframe de Experiencia): cabecera con empresa, rol y fechas, y secciones
 * plegables con `<details>` nativo (accesible y sin JS).
 */
export function ExperienceCard({ role, period, labels, open = false }: ExperienceCardProps) {
  return (
    <article
      aria-labelledby={`role-${role.id}`}
      className="flex flex-col gap-4 rounded-card border border-border bg-surface p-5 sm:p-7"
    >
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h2 id={`role-${role.id}`} className="font-display text-xl font-semibold">
            {role.company}
          </h2>
          <p className="text-text-2">{role.role}</p>
        </div>
        <div className="text-right font-mono text-xs text-muted">
          <p>{period}</p>
          <p>{role.location}</p>
        </div>
      </header>

      <p className="leading-[1.7] text-muted">{role.context}</p>

      <details open={open} className="group border-t border-border pt-2">
        <summary className={summaryClasses}>
          {labels.highlights}
          <Chevron />
        </summary>
        <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm leading-[1.7] text-text-2 marker:text-accent-text">
          {role.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </details>

      {role.subProjects.length > 0 && (
        <details className="group border-t border-border pt-2">
          <summary className={summaryClasses}>
            {labels.projects}
            <Chevron />
          </summary>
          <ul className="mt-2 grid gap-3 sm:grid-cols-2">
            {role.subProjects.map((project) => (
              <li key={project.title} className="rounded-2xl bg-surface-2 p-4">
                <p className="text-sm font-semibold">{project.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{project.description}</p>
              </li>
            ))}
          </ul>
        </details>
      )}

      {role.stack.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <h3 className="font-mono text-xs font-normal text-subtle">{labels.stack}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {role.stack.map((tech) => (
              <li key={tech}>
                <Chip variant="tech">{tech}</Chip>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
