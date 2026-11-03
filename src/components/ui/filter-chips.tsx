"use client";

import { cn } from "@/lib/cn";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterChipsProps {
  label: string;
  options: FilterOption[];
  /** `null` = sin filtro ("Todas"). */
  value: string | null;
  allLabel: string;
  onChange: (value: string | null) => void;
  className?: string;
}

/** Grupo de botones-filtro de selección única. Cada botón expone su estado con `aria-pressed`. */
export function FilterChips({
  label,
  options,
  value,
  allLabel,
  onChange,
  className,
}: FilterChipsProps) {
  const all: FilterOption = { value: "", label: allLabel };

  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {[all, ...options].map((option) => {
        const active = (option.value || null) === value;
        return (
          <button
            key={option.value || "all"}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value || null)}
            className={cn(
              "h-11 rounded-pill border px-4 text-sm transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
              active
                ? "border-transparent bg-accent font-semibold text-on-accent"
                : "border-border text-text-2 hover:bg-chip hover:text-text",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
