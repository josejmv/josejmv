"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { FilterChips, type FilterOption } from "@/components/ui/filter-chips";

interface TimelineItem {
  id: string;
  areas: string[];
  /** ExperienceCard renderizada en el servidor. */
  card: ReactNode;
}

interface ExperienceTimelineProps {
  items: TimelineItem[];
  areas: FilterOption[];
}

/**
 * Rail + nodos con las tarjetas de experiencia y filtro por área. Las tarjetas vienen del servidor;
 * aquí solo se ocultan (`hidden`) las que no coinciden con el filtro.
 */
export function ExperienceTimeline({ items, areas }: ExperienceTimelineProps) {
  const t = useTranslations("Experience");
  const [area, setArea] = useState<string | null>(null);
  const visible = items.filter((item) => !area || item.areas.includes(area));

  return (
    <div className="flex flex-col gap-6">
      <FilterChips
        label={t("filter")}
        allLabel={t("all")}
        options={areas}
        value={area}
        onChange={setArea}
      />
      <p role="status" className="sr-only">
        {t("results", { count: visible.length })}
      </p>

      <ol className="relative flex flex-col gap-4 pl-7 before:absolute before:top-3 before:bottom-3 before:left-[7px] before:w-px before:bg-border">
        {items.map((item) => (
          <li key={item.id} hidden={!visible.includes(item)} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-8 -left-7 size-[15px] rounded-full border-2 border-accent-text bg-bg"
            />
            {item.card}
          </li>
        ))}
      </ol>
      {visible.length === 0 && <p className="text-muted">{t("empty")}</p>}
    </div>
  );
}
