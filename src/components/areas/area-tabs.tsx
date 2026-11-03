"use client";

import { type ReactNode, useState } from "react";

import { useTabs } from "@/components/ui/use-tabs";
import { cn } from "@/lib/cn";

interface AreaTab {
  slug: string;
  title: string;
  /** Panel renderizado en el servidor (AreaSummary + ImpactBars). */
  panel: ReactNode;
}

interface AreaTabsProps {
  label: string;
  areas: AreaTab[];
  defaultSlug: string;
}

/**
 * Tabs de las 6 áreas (`useTabs`, ADR 0004). Todos los paneles van en el HTML y los inactivos
 * llevan `hidden`: el contenido de cada área es indexable aunque solo se vea una. En móvil, scroll
 * horizontal.
 */
export function AreaTabs({ label, areas, defaultSlug }: AreaTabsProps) {
  const [active, setActive] = useState(defaultSlug);
  const tabs = useTabs(
    areas.map((area) => area.slug),
    active,
    setActive,
  );

  return (
    <div className="flex flex-col gap-6">
      <div
        {...tabs.listProps}
        aria-label={label}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible"
      >
        {areas.map((area) => (
          <button
            key={area.slug}
            {...tabs.tabProps(area.slug)}
            className={cn(
              "h-11 shrink-0 rounded-[10px] border border-border px-4 text-sm font-medium whitespace-nowrap text-text-2 transition-colors",
              "hover:bg-chip hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
              "data-[state=active]:border-transparent data-[state=active]:bg-accent data-[state=active]:font-semibold data-[state=active]:text-on-accent",
            )}
          >
            {area.title}
          </button>
        ))}
      </div>

      {areas.map((area) => (
        <div
          key={area.slug}
          {...tabs.panelProps(area.slug)}
          className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text"
        >
          {area.panel}
        </div>
      ))}
    </div>
  );
}
