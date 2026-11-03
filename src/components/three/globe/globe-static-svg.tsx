import type { GlobeHome, LocalizedCountry } from "@/lib/content";
import { cn } from "@/lib/cn";
import { withHome } from "@/lib/globe/with-home";
import { arcPath, GLOBE_CENTER, GLOBE_VIEWBOX, project, toLimb } from "@/lib/globe/projection";

interface GlobeStaticSvgProps {
  points: LocalizedCountry[];
  /** Origen de los arcos (HOME_*): se resalta en champagne. */
  home: GlobeHome;
  label: string;
  className?: string;
}

/**
 * Globo estático: puntos del mundo (SVG del tema activo, como fondo) + arcos y marcadores calculados
 * desde `content/countries.ts`. Es el fallback del globo 3D (sin WebGL, reduced-motion o mientras
 * carga). Equipo: punto en `--accent-2`. Empresas: anillo en `--accent-text` (ADR 0003).
 */
export function GlobeStaticSvg({
  points: viewPoints,
  home,
  label,
  className,
}: GlobeStaticSvgProps) {
  const points = withHome(viewPoints, home);
  const origin = project(home);
  const targets = points
    .filter((p) => p.id !== home.id || p.kind === "company")
    .map((point) => {
      const projected = project(point);
      return { point, projected, anchor: projected.visible ? projected : toLimb(projected) };
    });

  return (
    <div className={cn("relative aspect-square w-full max-w-[440px]", className)}>
      <div aria-hidden="true" className="absolute inset-0 bg-globe-dots" />
      <svg
        viewBox={`0 0 ${GLOBE_VIEWBOX} ${GLOBE_VIEWBOX}`}
        role="img"
        aria-label={label}
        className="absolute inset-0 size-full overflow-visible"
      >
        <g fill="none" strokeWidth="1.4" className="text-accent-text">
          {targets
            .filter(({ point }) => point.id !== home.id)
            .map(({ point, anchor }) => (
              <path
                key={point.id}
                d={arcPath(origin, anchor)}
                stroke="currentColor"
                strokeOpacity={anchor.visible ? 0.8 : 0.35}
                strokeDasharray="3 5"
                className="motion-safe:animate-dash"
              />
            ))}
        </g>

        {targets
          .filter(({ projected }) => projected.visible)
          .map(({ point, projected }) =>
            point.kind === "company" ? (
              <circle
                key={point.id}
                cx={projected.x}
                cy={projected.y}
                r={6}
                fill="none"
                strokeWidth={2}
                className="stroke-accent-text"
              />
            ) : (
              <circle
                key={point.id}
                cx={projected.x}
                cy={projected.y}
                r={3.5}
                className="fill-accent-2"
              />
            ),
          )}

        <circle cx={origin.x} cy={origin.y} r={5} className="fill-accent-text" />
        <circle
          cx={origin.x}
          cy={origin.y}
          r={5}
          fill="none"
          strokeWidth={1.5}
          className="stroke-accent-text opacity-60"
        />

        <g className="font-mono text-[10px]">
          {targets.map(({ point, projected, anchor }) => {
            const left = anchor.x < GLOBE_CENTER;
            const isHome = point.id === home.id;
            return (
              <text
                key={point.id}
                x={anchor.x + (left ? -8 : 8)}
                y={anchor.y + (isHome ? 16 : 4)}
                textAnchor={left ? "end" : "start"}
                className={
                  isHome ? "fill-accent-text" : projected.visible ? "fill-text-2" : "fill-subtle"
                }
              >
                {projected.visible ? point.id : `${point.id} →`}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
