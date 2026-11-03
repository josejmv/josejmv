import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface AvailabilityBadgeProps {
  children: ReactNode;
  /** Si es `false`, el punto se muestra apagado y sin pulso. */
  available?: boolean;
  className?: string;
}

/** Punto de estado + texto mono ("Senior Full Stack Developer · Cajicá, Colombia"). */
export function AvailabilityBadge({
  children,
  available = true,
  className,
}: AvailabilityBadgeProps) {
  return (
    <p
      className={cn("inline-flex items-center gap-2.5 font-mono text-[13px] text-muted", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rounded-full",
          available ? "bg-success motion-safe:animate-pulse-soft" : "bg-subtle",
        )}
      />
      {children}
    </p>
  );
}
