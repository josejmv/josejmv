import { ImpactBars } from "@/components/charts/impact-bars";
import { Chip } from "@/components/ui/chip";
import type { LocalizedArea } from "@/lib/content";

interface AreaHeroProps {
  area: LocalizedArea;
  labels: {
    eyebrow: string;
    impact: string;
  };
}

/** Cabecera de una página de área: la frase del área como titular, resumen, stack e impacto. */
export function AreaHero({ area, labels }: AreaHeroProps) {
  return (
    <header className="container-page grid gap-8 pt-12 pb-10 lg:grid-cols-[1fr_380px] lg:pt-16">
      <div className="flex flex-col gap-5">
        <p className="font-mono text-[13px] text-muted">
          {labels.eyebrow} · {area.title}
        </p>
        <h1 className="font-display text-4xl font-light tracking-[-0.02em] sm:text-5xl">
          {area.tagline}
        </h1>
        <p className="max-w-[640px] leading-[1.7] text-text-2">{area.summary}</p>
        <ul className="list-disc pl-[18px] text-sm leading-[1.8] text-muted marker:text-subtle">
          {area.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-1.5">
          {area.tech.map((tech) => (
            <li key={tech}>
              <Chip variant="tech">{tech}</Chip>
            </li>
          ))}
        </ul>
      </div>

      {area.metrics.length > 0 && (
        <div className="self-start rounded-card border border-border bg-surface p-6">
          <ImpactBars title={labels.impact} metrics={area.metrics} />
        </div>
      )}
    </header>
  );
}
