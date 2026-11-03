"use client";

import { type ComponentProps, useState } from "react";

import { FilterChips } from "@/components/ui/filter-chips";
import { toMonthIndex } from "@/lib/month";

import { CareerGantt } from "./career-gantt";

type CareerGanttProps = ComponentProps<typeof CareerGantt>;

interface CareerGanttZoomProps extends Omit<CareerGanttProps, "year"> {
  zoomLabels: { label: string; all: string };
}

/**
 * Gantt de Experiencia con zoom por año: «Todo» muestra la carrera completa; un año enfoca el eje
 * en sus 12 meses, recorta las barras y atenúa los roles que no lo tocan. El selector solo aparece
 * en desktop, que es donde se ve el eje.
 */
export function CareerGanttZoom({ zoomLabels, ...gantt }: CareerGanttZoomProps) {
  const [year, setYear] = useState<string | null>(null);
  const first = Math.min(...gantt.roles.map((r) => Math.floor(toMonthIndex(r.start) / 12)));
  const last = Math.floor(toMonthIndex(gantt.now) / 12);
  const years = Array.from({ length: last - first + 1 }, (_, i) => String(first + i));

  return (
    <div className="flex flex-col gap-4">
      <FilterChips
        label={zoomLabels.label}
        allLabel={zoomLabels.all}
        options={years.map((y) => ({ value: y, label: y }))}
        value={year}
        onChange={setYear}
        className="hidden md:flex"
      />
      <CareerGantt {...gantt} year={year === null ? undefined : Number(year)} />
    </div>
  );
}
