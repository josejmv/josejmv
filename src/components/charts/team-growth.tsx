import { cn } from "@/lib/cn";

export interface TeamStage {
  key: string;
  org: string;
  period: string;
  role: string;
  /** Personas al empezar. */
  start: number;
  /** Personas confirmadas al final. */
  end: number;
  /** Personas "posibles" (rangos como 5-6): se dibujan punteadas, no se redondea hacia arriba. */
  maybe: number;
  /** Texto accesible, p. ej. "equipo de 3 a 5-6 personas". */
  summary: string;
}

interface TeamGrowthChartProps {
  title: string;
  stages: TeamStage[];
  legend: {
    start: string;
    growth: string;
    maybe: string;
  };
}

function Dot({ kind }: { kind: "start" | "growth" | "maybe" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-4 rounded-full",
        kind === "start" && "bg-accent-2",
        kind === "growth" && "bg-accent",
        kind === "maybe" && "border-2 border-dashed border-accent-text",
      )}
    />
  );
}

/** TeamGrowthChart: tamaño de los equipos que lideré, una persona por punto. */
export function TeamGrowthChart({ title, stages, legend }: TeamGrowthChartProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <ul className="flex flex-col gap-3">
        {stages.map((stage) => (
          <li
            key={stage.key}
            className="grid gap-3 rounded-2xl border border-border bg-surface-2 p-4 sm:grid-cols-[220px_1fr] sm:items-center"
          >
            <div>
              <p className="text-sm font-semibold">{stage.org}</p>
              <p className="text-xs text-muted">
                {stage.role} · {stage.period}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {Array.from({ length: stage.start }, (_, i) => (
                <Dot key={`s${i}`} kind="start" />
              ))}
              {Array.from({ length: stage.end - stage.start }, (_, i) => (
                <Dot key={`g${i}`} kind="growth" />
              ))}
              {Array.from({ length: stage.maybe }, (_, i) => (
                <Dot key={`m${i}`} kind="maybe" />
              ))}
              <span className="ml-2 font-mono text-xs text-text-2">{stage.summary}</span>
            </div>
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-4 text-xs text-muted">
        <li className="inline-flex items-center gap-1.5">
          <Dot kind="start" /> {legend.start}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Dot kind="growth" /> {legend.growth}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Dot kind="maybe" /> {legend.maybe}
        </li>
      </ul>
    </div>
  );
}
