"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import { feature } from "topojson-client";
import countriesTopology from "world-atlas/countries-110m.json";

import type { LocalizedCountry } from "@/lib/content";
import { VIEW_CENTER } from "@/lib/globe/projection";

export interface GlobeCanvasProps {
  points: LocalizedCountry[];
  home: { lat: number; lng: number };
  homeId?: string;
  /** `false` fuera del viewport: el render se pausa. */
  active: boolean;
  /** Se llama cuando el globo ya pintó el primer cuadro (para el fundido con el fallback). */
  onReady?: () => void;
}

interface Palette {
  /** Tema al que corresponden estos colores. */
  theme: string;
  land: string;
  globe: string;
  arc: string;
  team: string;
  company: string;
  atmosphere: string;
}

/** Lee los tokens del tema activo: el globo no usa colores propios (regla 4). */
function readPalette(theme: string): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    theme,
    land: v("--muted"),
    globe: v("--surface-2"),
    arc: v("--accent-text"),
    team: v("--accent-2"),
    company: v("--accent-text"),
    atmosphere: v("--accent-2"),
  };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

type Topology = Parameters<typeof feature>[0];

/**
 * Un polígono por país: si h3 falla en uno, no se pierde toda la capa. Se excluyen la Antártida
 * (010, no aporta a la vista) y Corea del Norte (408: h3 no logra rellenar su polígono a resolución 3).
 */
const EXCLUDED = new Set(["010", "408"]);

const landFeatures: object[] = (() => {
  const topology = countriesTopology as unknown as Topology;
  const collection = feature(topology, topology.objects.countries);
  const features = "features" in collection ? collection.features : [collection];
  return features.filter((f) => !EXCLUDED.has(String(f.id)));
})();

/** Re-renderiza cuando next-themes cambia `data-theme` en <html>. */
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const getTheme = () => document.documentElement.getAttribute("data-theme") ?? "dark";

export default function GlobeCanvas({
  points,
  home,
  homeId = "CO",
  active,
  onReady,
}: GlobeCanvasProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "dark");
  // Los colores salen de los tokens del tema activo y se releen al cambiarlo.
  const palette = useMemo(() => readPalette(theme), [theme]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setSize(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    if (active) globe.resumeAnimation();
    else globe.pauseAnimation();
  }, [active]);

  const material = useMemo(
    () => new MeshPhongMaterial({ color: palette.globe, shininess: 4 }),
    [palette],
  );

  const arcs = useMemo(
    () =>
      points
        .filter((p) => p.id !== homeId)
        .map((p) => ({ startLat: home.lat, startLng: home.lng, endLat: p.lat, endLng: p.lng })),
    [points, home, homeId],
  );

  const companies = useMemo(() => points.filter((p) => p.kind === "company"), [points]);

  // Accessors estables: si cambian en cada render, react-globe.gl recalcula todas las capas
  // (incluidos los hexágonos, lo más caro) aunque los datos sean los mismos.
  const accessors = useMemo(
    () => ({
      land: () => palette.land,
      arc: () => palette.arc,
      ring: () => palette.company,
      pointColor: (d: object) =>
        (d as LocalizedCountry).kind === "company" ? palette.company : palette.team,
      pointRadius: (d: object) => ((d as LocalizedCountry).id === homeId ? 0.7 : 0.45),
      pointLabel: (d: object) => {
        const point = d as LocalizedCountry;
        const extra = point.companies?.length
          ? `<span class="block text-muted">${point.companies.map(escapeHtml).join(" · ")}</span>`
          : "";
        return `<div class="rounded-xl border border-border bg-surface px-3 py-2 font-sans text-xs text-text shadow-xl"><strong class="font-semibold">${escapeHtml(point.name)}</strong>${extra}</div>`;
      },
    }),
    [palette, homeId],
  );

  function handleReady() {
    const globe = globeRef.current;
    if (!globe) return;
    globe.pointOfView({ ...VIEW_CENTER, altitude: 2.1 });
    const controls = globe.controls();
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    // Móvil: menos píxeles por cuadro (ADR 0001).
    globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    if (!active) globe.pauseAnimation();
    onReady?.();
  }

  return (
    <div ref={containerRef} className="size-full">
      {size > 0 && (
        <Globe
          ref={globeRef}
          width={size}
          height={size}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={material}
          showAtmosphere
          atmosphereColor={palette.atmosphere}
          atmosphereAltitude={0.14}
          hexPolygonsData={landFeatures}
          hexPolygonResolution={3}
          hexPolygonMargin={0.45}
          hexPolygonUseDots
          hexPolygonColor={accessors.land}
          arcsData={arcs}
          arcColor={accessors.arc}
          arcStroke={0.45}
          arcDashLength={0.35}
          arcDashGap={0.2}
          arcDashAnimateTime={2600}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={accessors.pointColor}
          pointAltitude={0.012}
          pointRadius={accessors.pointRadius}
          pointsTransitionDuration={600}
          pointLabel={accessors.pointLabel}
          ringsData={companies}
          ringLat="lat"
          ringLng="lng"
          ringColor={accessors.ring}
          ringMaxRadius={3}
          ringPropagationSpeed={1.2}
          ringRepeatPeriod={1800}
          onGlobeReady={handleReady}
        />
      )}
    </div>
  );
}
