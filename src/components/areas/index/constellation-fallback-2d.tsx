"use client";

import type { AreaSlug } from "@content/schema";
import type { CSSProperties, KeyboardEvent } from "react";

import { isEdgeActive } from "@/lib/constellation";
import type { ConstellationView } from "@/lib/content";
import { cn } from "@/lib/cn";

import { radioKeyDown } from "./radio-keys";

interface ConstellationFallback2DProps {
  graph: ConstellationView;
  selected: AreaSlug;
  onSelect: (id: AreaSlug) => void;
  onStep: (delta: number) => void;
  groupLabel: string;
  coreLabel: string;
}

type Point = { x: number; y: number };

/** Posiciones en % del escenario: escritorio (viewBox 1000×600) y móvil (4:5, más compacto). */
const desktop = (p: Point): Point => ({ x: p.x / 10, y: p.y / 6 });
/** Nodos con `position2d.y` por encima de esto muestran el nombre arriba (escritorio). */
const TOP_BAND = 150;
const CORE = { desktop: { x: 50, y: 50 }, mobile: { x: 50, y: 47 } };

function Lines({
  graph,
  selected,
  position,
  core,
  className,
}: {
  graph: ConstellationView;
  selected: AreaSlug;
  position: (id: AreaSlug) => Point;
  core: Point;
  className: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    >
      {graph.nodes.map((node) => {
        const p = position(node.id);
        return (
          <line
            key={`ray-${node.id}`}
            x1={core.x}
            y1={core.y}
            x2={p.x}
            y2={p.y}
            vectorEffect="non-scaling-stroke"
            className="stroke-(--constellation-ray)"
            strokeWidth={1}
          />
        );
      })}
      {graph.edges.map((edge) => {
        const a = position(edge.from);
        const b = position(edge.to);
        const active = isEdgeActive(edge, selected);
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            vectorEffect="non-scaling-stroke"
            strokeDasharray="4 6"
            strokeWidth={active ? 2 : 1}
            className={cn(
              "transition-[stroke,opacity] duration-300 motion-safe:animate-dash",
              active ? "stroke-accent-text opacity-95" : "stroke-accent-2 opacity-30",
            )}
          />
        );
      })}
    </svg>
  );
}

/**
 * Constelación en 2D: el respaldo de la escena 3D (reduced-motion, sin WebGL o si el chunk falla) y
 * lo que se ve mientras carga. Los nodos son radios de un `radiogroup`: flechas para moverse, Tab
 * para salir. En móvil usa una disposición más compacta y solo el nodo activo muestra su nombre.
 */
export function ConstellationFallback2D({
  graph,
  selected,
  onSelect,
  onStep,
  groupLabel,
  coreLabel,
}: ConstellationFallback2DProps) {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const desktopOf = (id: AreaSlug) => desktop(byId.get(id)!.position2d);
  const mobileOf = (id: AreaSlug) => byId.get(id)!.mobile;

  const place = (d: Point, m: Point) =>
    ({ "--x": `${d.x}%`, "--y": `${d.y}%`, "--mx": `${m.x}%`, "--my": `${m.y}%` }) as CSSProperties;
  const placed = "absolute top-(--my) left-(--mx) sm:top-(--y) sm:left-(--x)";

  return (
    <div className="absolute inset-0">
      <Lines
        graph={graph}
        selected={selected}
        position={mobileOf}
        core={CORE.mobile}
        className="sm:hidden"
      />
      <Lines
        graph={graph}
        selected={selected}
        position={desktopOf}
        core={CORE.desktop}
        className="hidden sm:block"
      />

      {/* Etiquetas de las conexiones del nodo activo, en el punto medio de cada línea. */}
      {graph.edges
        .filter((edge) => isEdgeActive(edge, selected))
        .map((edge) => {
          const mid = (f: (id: AreaSlug) => Point) => {
            const a = f(edge.from);
            const b = f(edge.to);
            return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
          };
          return (
            <span
              key={`label-${edge.from}-${edge.to}`}
              aria-hidden="true"
              data-constellation-label=""
              style={place(mid(desktopOf), mid(mobileOf))}
              className={cn(
                placed,
                "max-w-[44%] -translate-1/2 rounded-md border border-accent-text/40 bg-surface/90 px-2 py-0.5 text-center font-mono text-[11px] leading-tight text-accent-text motion-safe:animate-fade-in sm:max-w-none sm:whitespace-nowrap",
              )}
            >
              {edge.label}
            </span>
          );
        })}

      <span
        aria-hidden="true"
        style={place(CORE.desktop, CORE.mobile)}
        className={cn(
          placed,
          "grid size-16 -translate-1/2 place-items-center rounded-full bg-radial-[at_35%_30%] from-text from-0% via-accent via-35% to-accent-text/70 font-display text-sm font-semibold text-on-accent shadow-[0_0_48px_color-mix(in_srgb,var(--accent)_35%,transparent)] sm:size-[76px]",
        )}
      >
        {coreLabel}
      </span>

      <div
        role="radiogroup"
        aria-label={groupLabel}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => radioKeyDown(event, onStep)}
      >
        {graph.nodes.map((node) => {
          const active = node.id === selected;
          return (
            <button
              key={node.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={node.title}
              tabIndex={active ? 0 : -1}
              data-area={node.id}
              onClick={() => onSelect(node.id)}
              style={
                {
                  ...place(desktop(node.position2d), node.mobile),
                  "--depth": node.depth,
                } as CSSProperties
              }
              className={cn(
                placed,
                // El punto (x, y) es el centro de la esfera; la etiqueta cuelga debajo.
                "group/node -translate-1/2 rounded-full outline-none",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-[calc(52px*var(--depth))] place-items-center rounded-full font-mono text-xs font-semibold transition-[transform,background-color,box-shadow] duration-300 sm:size-[calc(62px*var(--depth))]",
                  "group-focus-visible/node:outline-2 group-focus-visible/node:outline-offset-4 group-focus-visible/node:outline-accent-text",
                  active
                    ? "scale-115 bg-radial-[at_35%_30%] from-text via-accent via-40% to-accent-text text-on-accent shadow-[0_0_36px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
                    : "bg-radial-[at_35%_30%] from-text/85 via-accent-2 via-35% to-(--constellation-node) text-bg shadow-[0_0_24px_color-mix(in_srgb,var(--accent-2)_20%,transparent)] group-hover/node:scale-105",
                )}
              >
                {node.code}
              </span>
              <span
                aria-hidden="true"
                data-constellation-label=""
                className={cn(
                  "absolute top-full left-1/2 mt-3 -translate-x-1/2 rounded-full border bg-surface/90 px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                  // En escritorio, los nodos de la franja superior llevan el nombre encima para no
                  // pisar las etiquetas de sus conexiones.
                  node.position2d.y < TOP_BAND && "sm:top-auto sm:bottom-full sm:mt-0 sm:mb-3",
                  active
                    ? "border-accent-text/50 text-text"
                    : "hidden border-border text-text-2 group-hover/node:text-text sm:block",
                )}
              >
                {node.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
