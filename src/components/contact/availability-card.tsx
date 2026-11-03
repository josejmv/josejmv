import { cn } from "@/lib/cn";
import type { ContactView } from "@/lib/content";

interface AvailabilityCardProps {
  availability: ContactView["availability"];
  /** Título cuando `status` es `unavailable`. */
  unavailableTitle: string;
  label: string;
}

/** Disponibilidad: estado con punto (verde si disponible) y una `<dl>` de condiciones. */
export function AvailabilityCard({ availability, unavailableTitle, label }: AvailabilityCardProps) {
  const available = availability.status === "available";

  return (
    <section aria-label={label} className="rounded-card border border-border bg-surface p-6">
      <h2 className="flex items-start gap-3 text-[17px] leading-snug font-semibold">
        <span
          aria-hidden="true"
          className={cn(
            "mt-1.5 size-2.5 shrink-0 rounded-full",
            available
              ? "bg-success shadow-[0_0_0_4px_color-mix(in_srgb,var(--success)_18%,transparent)] motion-safe:animate-pulse-soft"
              : "bg-muted",
          )}
        />
        {available ? availability.title : unavailableTitle}
      </h2>
      <dl className="mt-4 flex flex-col gap-3 text-sm">
        {availability.rows.map((row) => (
          <div
            key={row.key}
            className="flex items-baseline justify-between gap-4 border-t border-border pt-3 first:border-0 first:pt-0"
          >
            <dt className="shrink-0 text-muted">{row.label}</dt>
            <dd className="text-right text-balance text-text-2">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
