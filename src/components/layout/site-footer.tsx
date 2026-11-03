import { getTranslations } from "next-intl/server";

import { ContactIcon } from "@/components/contact/contact-icon";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import type { ContentLocale } from "@content/schema";
import { getHeaderLabels } from "@/i18n/header-labels";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { getAreas, getContact, getProfile } from "@/lib/content";
import { getCurrentMonth } from "@/lib/time";

import { NAV_ITEMS } from "./nav-items";
import { SiteLogo } from "./site-logo";

const SOURCE_URL = "https://github.com/josejmv/josejmv";

const linkClasses =
  "inline-flex min-h-11 items-center text-sm text-text-2 transition-colors hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text sm:min-h-9";

const headingClasses = "mb-2 font-mono text-xs text-subtle";

/**
 * Footer de todas las páginas. Una tarjeta con cuatro bloques que se reparten el ancho sin huecos:
 * - marca, titular, disponibilidad (→ Contacto) y ubicación;
 * - navegación principal;
 * - las 6 áreas;
 * - los 4 canales de contacto con su handle.
 * Debajo, una barra con © y ubicación, el stack del sitio con el enlace a su código, el selector de
 * idioma y «volver arriba».
 */
export async function SiteFooter({ locale }: { locale: ContentLocale }) {
  const [t, tNav, tHeader, tCta, month, labels] = await Promise.all([
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Header" }),
    getTranslations({ locale, namespace: "Cta" }),
    getCurrentMonth(),
    getHeaderLabels(locale),
  ]);
  const profile = getProfile(locale);
  const contact = getContact(locale);
  const areas = getAreas(locale);
  const available = contact.availability.status === "available";
  const timezone = contact.availability.rows.find((row) => row.key === "timezone")?.value;

  return (
    <footer className="relative z-10 container-page mt-16 pb-8">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 rounded-card border border-border bg-surface/70 p-6 backdrop-blur-sm sm:p-8 md:grid-cols-3 lg:grid-cols-[1.35fr_0.8fr_1fr_1.15fr] lg:gap-x-10">
        {/* Marca: ocupa la fila completa hasta lg, donde pasa a ser la primera columna. */}
        <div className="col-span-2 flex flex-col gap-4 md:col-span-3 md:flex-row md:items-end md:justify-between lg:col-span-1 lg:flex-col lg:items-start">
          <div className="flex flex-col gap-2">
            <SiteLogo
              monogram={profile.monogram}
              label={tHeader("home", { name: profile.name })}
              className="self-start"
            />
            <p className="max-w-xs text-sm text-muted">{profile.headline}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/contacto"
              className="group inline-flex min-h-11 items-center gap-2.5 self-start rounded-pill border border-border bg-surface-2 px-4 text-sm text-text transition-colors hover:border-accent-text/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full",
                  available ? "bg-success motion-safe:animate-pulse-soft" : "bg-muted",
                )}
              />
              {available ? contact.availability.title : t("unavailable")}
              <span aria-hidden="true" className="text-accent-text">
                →
              </span>
            </Link>
            <p className="font-mono text-xs text-subtle">
              {profile.location}
              {timezone && ` · ${timezone.split("·").pop()!.trim()}`}
            </p>
            <p className="text-sm text-muted">{tCta("subtitle")}</p>
          </div>
        </div>

        <nav aria-label={t("navTitle")}>
          <h2 className={headingClasses}>{t("navTitle")}</h2>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClasses}>
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <a href={contact.cv.href} download className={linkClasses}>
                {t("cv")}
                <span aria-hidden="true" className="ml-1.5 text-accent-text">
                  ↓
                </span>
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label={t("areasTitle")}>
          <h2 className={headingClasses}>{t("areasTitle")}</h2>
          <ul>
            {areas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={{ pathname: "/areas/[slug]", params: { slug: area.slug } }}
                  className={linkClasses}
                >
                  {area.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 flex flex-col md:col-span-1">
          <h2 className={headingClasses}>{t("channelsTitle")}</h2>
          {/* Desde md, los canales se reparten el alto de la fila: terminan a ras de las áreas. */}
          <ul className="grid flex-1 gap-x-6 min-[480px]:grid-cols-2 md:grid-cols-1 md:content-between">
            {contact.channels.map((channel) => {
              const external = channel.href.startsWith("http");
              return (
                <li key={channel.id}>
                  <a
                    href={channel.href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="group flex min-h-11 items-center gap-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-lg bg-chip text-text-2 transition-colors group-hover:text-accent-text"
                    >
                      <ContactIcon id={channel.id} />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm text-text-2 transition-colors group-hover:text-accent-text">
                        {channel.label}
                      </span>
                      <span
                        title={channel.handle}
                        className="truncate font-mono text-[11px] text-subtle"
                      >
                        {channel.handle}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Móvil: ©, botones y stack. md: © y botones en una fila, stack debajo. lg: todo en una fila. */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-1 text-xs text-subtle">
        <p className="w-full md:w-auto">
          {t("rights", { year: month.slice(0, 4), name: profile.name })} · {profile.location}
        </p>
        <p className="order-3 w-full font-mono text-[11px] lg:order-0 lg:w-auto">
          {t("builtWith")} ·{" "}
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-2 underline-offset-4 hover:text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
          >
            {t("source")} ↗
          </a>
        </p>
        <div className="flex items-center gap-2">
          <LocaleSwitcher label={labels.switchLocale} />
          <a
            href="#contenido"
            className="inline-flex h-11 items-center gap-1.5 rounded-pill border border-border px-4 text-text-2 transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
          >
            {t("backToTop")}
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
