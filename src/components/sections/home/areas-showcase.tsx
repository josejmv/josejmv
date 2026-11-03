import { AreaSummary } from "@/components/areas/area-summary";
import { AreaTabs } from "@/components/areas/area-tabs";
import { ImpactBars } from "@/components/charts/impact-bars";
import type { LocalizedArea } from "@/lib/content";

interface AreasShowcaseProps {
  areas: LocalizedArea[];
  defaultSlug: string;
  labels: {
    title: string;
    note: string;
    tabs: string;
    impact: string;
    cases: (area: string) => string;
  };
}

/** "Áreas de dominio" (Fusion): tabs con resumen a la izquierda e impacto medido a la derecha. */
export function AreasShowcase({ areas, defaultSlug, labels }: AreasShowcaseProps) {
  return (
    <section id="areas" aria-labelledby="areas-title" className="container-page scroll-mt-24">
      <div className="flex flex-col gap-6 rounded-card border border-border bg-surface p-5 sm:p-[30px]">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="areas-title" className="font-display text-[28px] font-semibold">
            {labels.title}
          </h2>
          <p className="font-mono text-xs text-subtle">{labels.note}</p>
        </div>

        <AreaTabs
          label={labels.tabs}
          defaultSlug={defaultSlug}
          areas={areas.map((area) => ({
            slug: area.slug,
            title: area.title,
            panel: (
              <div className="grid gap-8 lg:grid-cols-2">
                <AreaSummary area={area} casesLabel={labels.cases(area.title)} />
                {area.metrics.length > 0 ? (
                  <ImpactBars title={labels.impact} metrics={area.metrics} />
                ) : (
                  <blockquote className="flex items-center rounded-2xl border border-border bg-surface-2 p-6 font-display text-2xl leading-snug text-text-2">
                    {area.tagline}
                  </blockquote>
                )}
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
}
