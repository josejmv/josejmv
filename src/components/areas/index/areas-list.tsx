import { Link } from "@/i18n/navigation";
import type { ConstellationNodeView } from "@/lib/content";

interface AreasListProps {
  nodes: ConstellationNodeView[];
  labels: { title: string; seeArea: string };
}

/**
 * «Todas las áreas»: 6 tarjetas-enlace renderizadas en el servidor. Es la vía rápida para
 * reclutadores, el contenido indexable y la ruta principal para lectores de pantalla.
 */
export function AreasList({ nodes, labels }: AreasListProps) {
  return (
    <section aria-labelledby="areas-list-title" className="container-page mt-16">
      <h2 id="areas-list-title" className="font-display text-2xl font-semibold sm:text-[28px]">
        {labels.title}
      </h2>
      <ol className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-3.5">
        {nodes.map((node, index) => (
          <li key={node.id}>
            <Link
              href={{ pathname: "/areas/[slug]", params: { slug: node.id } }}
              className="flex h-full flex-col gap-2 rounded-card border border-border bg-surface p-6 transition-[border-color,translate] duration-200 hover:border-accent-text/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text motion-safe:hover:-translate-y-0.5"
            >
              <span className="font-mono text-xs text-muted">
                {String(index + 1).padStart(2, "0")} · {node.title}
              </span>
              <span className="font-display text-[19px] leading-snug font-semibold">
                {node.tagline}
              </span>
              <span className="text-sm text-text-2">
                <strong className="font-semibold text-accent-text">{node.metric.value}</strong>{" "}
                {node.metric.label}
              </span>
              <span className="mt-auto pt-2 text-sm text-accent-text">{labels.seeArea}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
