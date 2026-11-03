"use client";

import { type ReactNode, useState } from "react";

import type { GlobeHome, LocalizedCountry } from "@/lib/content";
import { useTabs } from "@/components/ui/use-tabs";
import { cn } from "@/lib/cn";

import { CollaborationGlobe } from "./collaboration-globe";

export type GlobeView = "team" | "company";

interface GlobeViewData {
  /** Texto del tab, p. ej. "Equipo · 12 nacionalidades". */
  label: string;
  points: LocalizedCountry[];
  /** GlobeStaticSvg de esta vista (renderizado en el servidor). */
  fallback: ReactNode;
  /** GlobeLegend de esta vista (renderizado en el servidor). */
  legend: ReactNode;
}

interface GlobeTabsProps {
  label: string;
  home: GlobeHome;
  views: Record<GlobeView, GlobeViewData>;
}

const VIEWS: GlobeView[] = ["team", "company"];

/**
 * Tabs Equipo / Empresas (ADR 0003). Hay un solo globo: al cambiar de tab cambian sus datos
 * (react-globe.gl anima los puntos; el estático hace un fundido). Cada panel lleva su leyenda.
 */
export function GlobeTabs({ label, home, views }: GlobeTabsProps) {
  const [view, setView] = useState<GlobeView>("team");
  const active = views[view];
  const tabs = useTabs(VIEWS, view, setView);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        {...tabs.listProps}
        aria-label={label}
        className="inline-flex gap-1 rounded-pill border border-border bg-surface-2 p-1"
      >
        {VIEWS.map((key) => (
          <button
            key={key}
            {...tabs.tabProps(key)}
            className={cn(
              "h-11 rounded-pill px-3 text-xs font-medium whitespace-nowrap text-text-2 transition-colors sm:px-[18px] sm:text-[13px]",
              "hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
              "data-[state=active]:bg-accent data-[state=active]:font-semibold data-[state=active]:text-on-accent",
            )}
          >
            {views[key].label}
          </button>
        ))}
      </div>

      <CollaborationGlobe
        points={active.points}
        home={home}
        className="motion-safe:animate-floaty"
        fallback={
          <div key={view} className="size-full motion-safe:animate-fade-up">
            {active.fallback}
          </div>
        }
      />

      {VIEWS.map((key) => (
        <div
          key={key}
          {...tabs.panelProps(key)}
          className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text"
        >
          {views[key].legend}
        </div>
      ))}
    </div>
  );
}
