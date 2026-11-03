import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { ClientMessages } from "@/components/i18n/client-messages";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { GlowOrbs } from "@/components/ui/backgrounds/glow-orbs";
import { GridBackground } from "@/components/ui/backgrounds/grid-background";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { IS_INDEXABLE, SITE_URL } from "@/lib/site";

import "../globals.css";

/** `VERCEL=1` en los builds de Vercel (preview y producción). */
const ON_VERCEL = process.env.VERCEL === "1";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    applicationName: "José M. Vasquez",
    authors: [{ name: "José M. Vasquez", url: SITE_URL }],
    robots: IS_INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Header" });

  return (
    // `data-theme="dark"` es el valor por defecto sin JS; next-themes lo reemplaza antes del primer paint.
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ClientMessages>
          <ThemeProvider>
            <div className="relative isolate flex min-h-full flex-1 flex-col overflow-clip">
              <GridBackground />
              <GlowOrbs />
              <a
                href="#contenido"
                className="sr-only z-50 rounded-pill bg-accent px-4 py-3 text-sm font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
              >
                {t("skipToContent")}
              </a>
              <SiteHeader locale={locale} />
              <div id="contenido" tabIndex={-1} className="flex flex-1 flex-col outline-none">
                {children}
              </div>
              <SiteFooter locale={locale} />
            </div>
          </ThemeProvider>
        </ClientMessages>
        {/*
          Analítica sin cookies y Core Web Vitals de usuarios reales. Sus scripts los sirve Vercel
          (/_vercel/*): fuera de Vercel (local, CI) darían 404, así que solo se incluyen allí. Leen
          la URL en el cliente: el Suspense evita que eso vuelva dinámico el shell prerenderizado.
        */}
        {ON_VERCEL && (
          <Suspense fallback={null}>
            <Analytics />
            <SpeedInsights />
          </Suspense>
        )}
      </body>
    </html>
  );
}
