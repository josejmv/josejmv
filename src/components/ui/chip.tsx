import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export type ChipVariant = "default" | "subtle" | "accent" | "tech";

const VARIANTS: Record<ChipVariant, string> = {
  // Stack del Home.
  default: "rounded-pill bg-chip px-3.5 py-2 text-[13px] text-text",
  // Idiomas bajo el globo.
  subtle: "rounded-pill bg-surface px-3 py-1.5 text-xs text-text-2",
  // Etiqueta destacada ("Equipos multiculturales").
  accent:
    "rounded-pill border border-accent-text/35 px-3 py-1.5 text-xs font-semibold text-accent-text",
  // Tecnologías dentro de una tarjeta de área.
  tech: "rounded-md bg-chip px-2.5 py-1.5 font-mono text-xs text-text-2",
};

export interface ChipProps extends ComponentPropsWithoutRef<"span"> {
  variant?: ChipVariant;
}

export function Chip({ variant = "default", className, ...props }: ChipProps) {
  return (
    <span {...props} className={cn("inline-flex items-center", VARIANTS[variant], className)} />
  );
}
