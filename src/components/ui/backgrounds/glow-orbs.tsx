import { cn } from "@/lib/cn";

/**
 * Dos halos radiales (Fusion): azul arriba a la derecha y champagne a la izquierda,
 * a la altura de las áreas. Decorativos; el contenedor padre debe ser `relative overflow-hidden`.
 */
export function GlowOrbs({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <div className="absolute -top-[260px] -right-[160px] size-[min(820px,160vw)] rounded-full bg-glow-1" />
      <div className="absolute top-[900px] -left-[280px] size-[min(680px,140vw)] rounded-full bg-glow-2" />
    </div>
  );
}
