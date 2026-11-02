import { StatCard } from "@/components/ui/stat-card";
import type { LocalizedStat } from "@/lib/content";

interface StatsStripProps {
  stats: LocalizedStat[];
  label: string;
}

/** Cuatro cifras bajo el Hero (Fusion). 2 columnas en móvil, 4 en desktop. */
export function StatsStrip({ stats, label }: StatsStripProps) {
  return (
    <section aria-label={label} className="container-page pb-10">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.id}>
            <StatCard value={stat.value} label={stat.label} className="h-full" />
          </li>
        ))}
      </ul>
    </section>
  );
}
