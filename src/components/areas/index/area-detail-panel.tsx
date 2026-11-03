import { buttonClasses } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { ConstellationNodeView } from "@/lib/content";

export interface AreaDetailLabels {
  connectsWith: string;
  stack: string;
  /** Con `{area}`. */
  explore: string;
}

interface AreaDetailPanelProps {
  node: ConstellationNodeView;
  labels: AreaDetailLabels;
}

/**
 * Detalle del área seleccionada: módulo firma, titular, texto, métrica estrella, conexiones, stack y
 * CTA a su página. El encabezado se anuncia al cambiar (`aria-live`); el resto entra con un fundido.
 */
export function AreaDetailPanel({ node, labels }: AreaDetailPanelProps) {
  return (
    <section
      aria-labelledby="area-detail-title"
      className="flex flex-[1_1_320px] flex-col rounded-[28px] border border-accent-text/20 bg-surface p-7"
    >
      <div key={node.id} className="flex flex-1 flex-col motion-safe:animate-fade-in">
        <div aria-live="polite" aria-atomic="true">
          <p className="font-mono text-xs text-accent-text">
            <span aria-hidden="true">◆ </span>
            {node.module}
          </p>
          <h2
            id="area-detail-title"
            className="mt-3 font-display text-[26px] leading-tight font-semibold"
          >
            {node.tagline}
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-2">{node.summary}</p>

        <p className="mt-5 flex flex-col gap-1 rounded-2xl bg-surface-2 px-5 py-4">
          <span className="font-display text-[30px] leading-none font-semibold text-accent-text">
            {node.metric.value}
          </span>
          <span className="text-[13px] text-muted">{node.metric.label}</span>
        </p>

        <h3 className="mt-6 font-mono text-xs text-muted">{labels.connectsWith}</h3>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm text-text-2 marker:text-accent-text">
          {node.neighbors.map((neighbor) => (
            <li key={neighbor.id}>
              <span className="text-text">{neighbor.title}</span> · {neighbor.label}
            </li>
          ))}
        </ul>

        <h3 className="sr-only">{labels.stack}</h3>
        <ul className="mt-5 mb-6 flex flex-wrap gap-2">
          {node.tech.map((tech) => (
            <li key={tech} className="rounded-md bg-chip px-2.5 py-1 font-mono text-xs text-text-2">
              {tech}
            </li>
          ))}
        </ul>

        <Link
          href={{ pathname: "/areas/[slug]", params: { slug: node.id } }}
          className={buttonClasses({
            size: "lg",
            className: "mt-auto w-full text-[15px] whitespace-normal",
          })}
        >
          {labels.explore.replace("{area}", node.title)}
        </Link>
      </div>
    </section>
  );
}
