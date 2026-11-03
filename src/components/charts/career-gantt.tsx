import type { LocalizedExperience } from "@/lib/content";
import { cn } from "@/lib/cn";
import { toMonthIndex } from "@/lib/month";

interface CareerGanttProps {
  roles: LocalizedExperience[];
  /** Mes actual (`YYYY-MM`): cierra los roles vigentes y el eje. */
  now: string;
  locale: string;
  labels: {
    list: string;
    present: string;
  };
  /** Zoom: si se indica, el eje cubre solo ese año (ene–dic) con marcas por mes. */
  year?: number;
}

interface Tick {
  key: string;
  at: number;
  label: string;
}

/**
 * Trayectoria (Fusion). Desktop: Gantt con eje de años, o de meses con `year` (zoom). Móvil: lista
 * vertical con el periodo en texto (la barra se oculta). Sin estado ni efectos: sirve como Server
 * Component (Home) y dentro del zoom cliente de Experiencia.
 */
export function CareerGantt({ roles, now, locale, labels, year }: CareerGanttProps) {
  const nowIndex = toMonthIndex(now);
  const domainStart =
    year !== undefined ? year * 12 : Math.min(...roles.map((r) => toMonthIndex(r.start))) - 1;
  const domainEnd = year !== undefined ? (year + 1) * 12 : nowIndex + 2;
  const span = domainEnd - domainStart;
  const pct = (index: number) => ((index - domainStart) / span) * 100;

  const monthName = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  let ticks: Tick[];
  if (year !== undefined) {
    // Una marca por mes, centrada en el mes.
    ticks = Array.from({ length: 12 }, (_, m) => ({
      key: `m${m}`,
      at: pct(domainStart + m + 0.5),
      label: monthName.format(new Date(Date.UTC(year, m, 1))).replace(".", ""),
    }));
  } else {
    const firstYear = Math.ceil(domainStart / 12);
    const lastYear = Math.floor(domainEnd / 12);
    // Se omiten los años pegados a un extremo del eje: su etiqueta quedaría cortada.
    ticks = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i)
      .filter((y) => pct(y * 12) > 3 && pct(y * 12) < 97)
      .map((y) => ({ key: `y${y}`, at: pct(y * 12), label: String(y) }));
  }

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
        {ticks.map((tick) => (
          <span
            key={tick.key}
            className="absolute -translate-x-1/2"
            style={{ left: `${tick.at.toFixed(1)}%` }}
          >
            {tick.label}
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
          // Con zoom, la barra se recorta al año; un rol fuera del año queda atenuado y sin barra.
          const from = Math.max(start, domainStart);
          const to = Math.min(end, domainEnd);
          const inRange = to > from;
          const period = `${formatMonth(role.start)} – ${role.end ? formatMonth(role.end) : labels.present}`;

          return (
            <li
              key={role.id}
              className={cn(
                "grid items-center gap-x-5 border-l-2 border-border py-2.5 pl-4 transition-opacity md:col-span-2 md:grid-cols-subgrid md:border-0 md:pl-0",
                !inRange && "md:opacity-40",
              )}
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
                {inRange && (
                  <div
                    // Con `key` por año, la barra vuelve a animarse al cambiar el zoom.
                    key={year ?? "all"}
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
                      left: `${pct(from).toFixed(1)}%`,
                      width: `${(((to - from) / span) * 100).toFixed(1)}%`,
                    }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
