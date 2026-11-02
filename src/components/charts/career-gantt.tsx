import type { LocalizedExperience } from "@/lib/content";
import { cn } from "@/lib/cn";
import { toMonthIndex } from "@/lib/time";

interface CareerGanttProps {
  roles: LocalizedExperience[];
  /** Mes actual (`YYYY-MM`): cierra los roles vigentes y el eje. */
  now: string;
  locale: string;
  labels: {
    list: string;
    present: string;
  };
}

/**
 * Trayectoria (Fusion). Desktop: Gantt con eje de años. Móvil: lista vertical con el periodo en
 * texto (la barra se oculta). Server Component: posiciones calculadas en el servidor, sin JS.
 */
export function CareerGantt({ roles, now, locale, labels }: CareerGanttProps) {
  const nowIndex = toMonthIndex(now);
  const domainStart = Math.min(...roles.map((r) => toMonthIndex(r.start))) - 1;
  const domainEnd = nowIndex + 2;
  const span = domainEnd - domainStart;
  const pct = (index: number) => ((index - domainStart) / span) * 100;

  const firstYear = Math.ceil(domainStart / 12);
  const lastYear = Math.floor(domainEnd / 12);
  // Se omiten los años pegados a un extremo del eje: su etiqueta quedaría cortada.
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i).filter(
    (year) => pct(year * 12) > 3 && pct(year * 12) < 97,
  );

  const month = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const formatMonth = (yearMonth: string) => month.format(new Date(`${yearMonth}-01T00:00:00Z`));

  return (
    <div className="grid gap-x-5 md:grid-cols-[240px_1fr]">
      {/* Eje de años (solo desktop) */}
      <div aria-hidden="true" className="hidden md:block" />
      <div
        aria-hidden="true"
        className="relative hidden h-[22px] font-mono text-[11px] text-subtle md:block"
      >
        {years.map((year) => (
          <span
            key={year}
            className="absolute -translate-x-1/2"
            style={{ left: `${pct(year * 12).toFixed(1)}%` }}
          >
            {year}
          </span>
        ))}
      </div>

      <ol aria-label={labels.list} className="col-span-full grid md:grid-cols-subgrid">
        {roles.map((role) => {
          const start = toMonthIndex(role.start);
          // El mes final cuenta completo.
          const end = (role.end ? toMonthIndex(role.end) : nowIndex) + 1;
          const current = role.end === null;
          const endedYearsAgo = (nowIndex - end) / 12;
          const period = `${formatMonth(role.start)} – ${role.end ? formatMonth(role.end) : labels.present}`;

          return (
            <li
              key={role.id}
              className="grid items-center gap-x-5 border-l-2 border-border py-2.5 pl-4 md:col-span-2 md:grid-cols-subgrid md:border-0 md:pl-0"
            >
              <div>
                <p className="text-sm font-semibold">{role.company}</p>
                <p className="text-xs text-muted">{role.tagline}</p>
                <p className="mt-1 font-mono text-[11px] text-subtle md:sr-only">{period}</p>
              </div>
              <div
                aria-hidden="true"
                className="relative hidden h-3.5 rounded-pill bg-surface-2 md:block"
              >
                <div
                  title={`${role.role} · ${period}`}
                  className={cn(
                    "absolute inset-y-0 origin-left rounded-pill motion-safe:animate-grow-x",
                    current
                      ? "bg-linear-to-r from-accent-2 to-accent"
                      : endedYearsAgo < 2
                        ? "bg-accent-2"
                        : endedYearsAgo < 4
                          ? "bg-accent-2/60"
                          : "bg-accent-2/40",
                  )}
                  style={{
                    left: `${pct(start).toFixed(1)}%`,
                    width: `${(((end - start) / span) * 100).toFixed(1)}%`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
