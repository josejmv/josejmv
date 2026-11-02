import type { CSSProperties } from "react";

import type { LocalizedArea } from "@/lib/content";

interface ImpactBarsProps {
  title: string;
  metrics: LocalizedArea["metrics"];
}

/**
 * Métricas antes → después (Fusion). El ancho de la barra es `after / before`: cuanto más corta,
 * mayor la mejora. Las barras crecen con CSS (`animate-grow-x`), sin JS.
 */
export function ImpactBars({ title, metrics }: ImpactBarsProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs text-muted">{title}</p>
      <ul className="flex flex-col gap-4">
        {metrics.map((metric) => (
          <li key={metric.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between gap-4 text-[13px]">
              <span>{metric.label}</span>
              <span className="font-semibold text-accent-text">{metric.delta}</span>
            </div>
            <div aria-hidden="true" className="h-2 overflow-hidden rounded-pill bg-chip">
              <div
                className="h-full min-w-1.5 origin-left rounded-pill bg-accent motion-safe:animate-grow-x"
                style={{ width: `${(metric.ratio * 100).toFixed(1)}%` } as CSSProperties}
              />
            </div>
            <p className="font-mono text-[11px] text-subtle">
              {metric.before} → {metric.after}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
