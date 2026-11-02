import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** tailwind-merge conoce los tokens de globals.css para resolver conflictos correctamente. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "bg",
        "surface",
        "surface-2",
        "chip",
        "border",
        "text",
        "text-2",
        "muted",
        "subtle",
        "accent",
        "on-accent",
        "accent-text",
        "accent-2",
        "success",
      ],
      radius: ["card", "pill"],
      font: ["display", "sans", "mono"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
