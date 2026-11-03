"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { ComponentProps } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Href = ComponentProps<typeof Link>["href"];

/**
 * Enlace al otro idioma conservando la página actual (incluidas rutas con `[slug]`).
 * Es un `<a>` real con `hreflang`, así que funciona sin JS y lo entienden los buscadores.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const target = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  const { locale: _ignored, ...routeParams } = params;
  void _ignored;
  const href = { pathname, params: routeParams } as unknown as Href;

  return (
    <Link
      href={href}
      locale={target}
      hrefLang={target}
      aria-label={t("label", { language: t(target) })}
      className={cn(
        "inline-flex h-11 items-center rounded-pill border border-border px-3.5 font-mono text-xs font-semibold text-muted transition-colors hover:bg-chip",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
        className,
      )}
    >
      <span aria-hidden="true">
        {routing.locales.map((l, i) => (
          <span key={l}>
            {i > 0 && "/"}
            <span className={l === locale ? "text-text" : undefined}>{l.toUpperCase()}</span>
          </span>
        ))}
      </span>
    </Link>
  );
}
