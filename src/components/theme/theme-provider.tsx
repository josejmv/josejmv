"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export const THEMES = ["dark", "light"] as const;

/**
 * Tema oscuro por defecto. next-themes inyecta un script bloqueante que fija `data-theme`
 * en <html> antes del primer paint, así que no hay parpadeo al cargar.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      themes={[...THEMES]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
