import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

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
      </body>
    </html>
  );
}
