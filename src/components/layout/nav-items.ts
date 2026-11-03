import type { ComponentProps } from "react";

import type { Link } from "@/i18n/navigation";

type Href = ComponentProps<typeof Link>["href"];

export type NavKey = "home" | "experience" | "areas" | "projects" | "contact";

export interface NavItem {
  key: NavKey;
  href: Href;
  /** Ruta interna (next-intl `usePathname`) que marca el ítem como activo. */
  match?: (pathname: string) => boolean;
}

/** Secciones principales. Las etiquetas salen de `messages/*.json` → `Nav.<key>`. */
export const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/", match: (p) => p === "/" },
  { key: "experience", href: "/experiencia", match: (p) => p.startsWith("/experiencia") },
  { key: "areas", href: "/areas", match: (p) => p.startsWith("/areas") },
  { key: "projects", href: "/proyectos", match: (p) => p.startsWith("/proyectos") },
  { key: "contact", href: "/contacto", match: (p) => p.startsWith("/contacto") },
];
