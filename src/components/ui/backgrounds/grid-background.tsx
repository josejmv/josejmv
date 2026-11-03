import { cn } from "@/lib/cn";

/** Retícula de 56px con `--grid-line`. Decorativa: el contenedor padre debe ser `relative`. */
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 bg-grid", className)}
    />
  );
}
