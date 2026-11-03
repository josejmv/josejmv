import { Link } from "@/i18n/navigation";
import type { LocalizedProject } from "@/lib/content";

interface NextProjectProps {
  project: LocalizedProject;
  label: string;
}

/** Enlace al siguiente case study, al final de la página. */
export function NextProject({ project, label }: NextProjectProps) {
  return (
    <div className="container-page mt-16">
      <Link
        href={{ pathname: "/proyectos/[slug]", params: { slug: project.slug } }}
        className="group flex flex-col gap-1 rounded-card border border-border bg-surface p-6 transition-colors hover:border-accent-text/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
      >
        <span className="font-mono text-xs text-subtle">{label}</span>
        <span className="font-display text-2xl font-semibold group-hover:text-accent-text">
          {project.title} →
        </span>
        <span className="text-sm text-muted">{project.summary}</span>
      </Link>
    </div>
  );
}
