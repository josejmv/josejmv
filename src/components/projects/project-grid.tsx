"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { FilterChips, type FilterOption } from "@/components/ui/filter-chips";

interface GridItem {
  slug: string;
  areas: string[];
  tech: string[];
  /** ProjectCard renderizada en el servidor. */
  card: ReactNode;
}

interface ProjectGridProps {
  items: GridItem[];
  areas: FilterOption[];
  tech: FilterOption[];
}

/** Grilla de proyectos con filtros por área y por tecnología (se combinan). */
export function ProjectGrid({ items, areas, tech }: ProjectGridProps) {
  const t = useTranslations("Projects");
  const [area, setArea] = useState<string | null>(null);
  const [stack, setStack] = useState<string | null>(null);

  const matches = (item: GridItem) =>
    (!area || item.areas.includes(area)) && (!stack || item.tech.includes(stack));
  const count = items.filter(matches).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <FilterChips
          label={t("filterArea")}
          allLabel={t("allAreas")}
          options={areas}
          value={area}
          onChange={setArea}
        />
        <FilterChips
          label={t("filterTech")}
          allLabel={t("allTech")}
          options={tech}
          value={stack}
          onChange={setStack}
        />
      </div>
      <p role="status" className="sr-only">
        {t("results", { count })}
      </p>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug} hidden={!matches(item)}>
            {item.card}
          </li>
        ))}
      </ul>
      {count === 0 && <p className="text-muted">{t("empty")}</p>}
    </div>
  );
}
