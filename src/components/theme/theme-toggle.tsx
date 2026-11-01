"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

/**
 * Alterna entre oscuro y claro. Los dos íconos se renderizan siempre y la variante `dark:`
 * (ligada a `data-theme`) decide cuál se ve, así el HTML del servidor y el del cliente coinciden.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("Theme");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={t("toggle")}
      title={t("toggle")}
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className={`inline-flex size-11 items-center justify-center rounded-pill border border-border bg-surface text-text transition-colors hover:bg-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text ${className}`}
    >
      {/* Luna: se muestra en oscuro */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="hidden size-5 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      {/* Sol: se muestra en claro */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="block size-5 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
