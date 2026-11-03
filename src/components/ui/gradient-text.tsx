import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

/**
 * Texto con degradado `--accent-text` → `--accent-2`. Usa los tokens de texto (no `--accent`)
 * para que los dos extremos pasen AA también en el tema claro.
 */
export function GradientText({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "bg-linear-to-r from-accent-text to-accent-2 bg-clip-text text-transparent",
        className,
      )}
    />
  );
}
