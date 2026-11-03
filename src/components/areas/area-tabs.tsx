"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { type ReactNode, useState } from "react";

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
 * Tabs de las 6 áreas (Radix). Todos los paneles van en el HTML (`forceMount`) y los inactivos se
 * ocultan: el contenido de cada área es indexable aunque solo se vea una. En móvil, scroll horizontal.
 */
export function AreaTabs({ label, areas, defaultSlug }: AreaTabsProps) {
  const [active, setActive] = useState(defaultSlug);

  return (
    <Tabs.Root value={active} onValueChange={setActive} className="flex flex-col gap-6">
      <Tabs.List
        aria-label={label}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible"
      >
        {areas.map((area) => (
          <Tabs.Trigger
            key={area.slug}
            value={area.slug}
            className={cn(
              "h-11 shrink-0 rounded-[10px] border border-border px-4 text-sm font-medium whitespace-nowrap text-text-2 transition-colors",
              "hover:bg-chip hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
              "data-[state=active]:border-transparent data-[state=active]:bg-accent data-[state=active]:font-semibold data-[state=active]:text-on-accent",
            )}
          >
            {area.title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {areas.map((area) => (
        <Tabs.Content
          key={area.slug}
          value={area.slug}
          forceMount
          // Con forceMount Radix no oculta el panel: `hidden` lo saca de la vista y del árbol accesible.
          hidden={area.slug !== active}
          className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text"
        >
          {area.panel}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
