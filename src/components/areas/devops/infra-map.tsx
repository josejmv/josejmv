export interface InfraNode {
  key: string;
  title: string;
  detail: string;
}

interface InfraMapProps {
  title: string;
  label: string;
  nodes: InfraNode[];
}

/** InfraMap: de dónde sale un cambio y por dónde pasa hasta producción (sin hostnames internos). */
export function InfraMap({ title, label, nodes }: InfraMapProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <ol aria-label={label} className="grid gap-3 md:grid-cols-4">
        {nodes.map((node, index) => (
          <li
            key={node.key}
            className="relative flex flex-col gap-1 rounded-2xl border border-border bg-surface-2 p-4"
          >
            <span className="font-mono text-xs text-accent-text">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-sm font-semibold">{node.title}</p>
            <p className="text-[13px] leading-relaxed text-muted">{node.detail}</p>
            {index < nodes.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-1/2 -right-3 hidden -translate-y-1/2 text-subtle md:block"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
