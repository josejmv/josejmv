import "server-only";

import { getTranslations } from "next-intl/server";

import type { NavKey } from "@/components/layout/nav-items";

import { routing } from "./routing";

type Locale = (typeof routing.locales)[number];

/**
 * Textos del header calculados en el servidor. Los componentes cliente que se hidratan en todas
 * las páginas (nav, idioma, tema, ⌘K, ☰) los reciben como props: así no formatean ICU en el
 * cliente y el parser de next-intl no entra en el JS inicial.
 */
export async function getHeaderLabels(locale: Locale) {
  const [tNav, tHeader, tLocale, tTheme, tCommand] = await Promise.all([
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Header" }),
    getTranslations({ locale, namespace: "LocaleSwitcher" }),
    getTranslations({ locale, namespace: "Theme" }),
    getTranslations({ locale, namespace: "Command" }),
  ]);
  const target = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const nav: Record<NavKey, string> = {
    home: tNav("home"),
    experience: tNav("experience"),
    areas: tNav("areas"),
    projects: tNav("projects"),
    contact: tNav("contact"),
  };

  return {
    nav,
    primaryNav: tHeader("primaryNav"),
    openMenu: tHeader("openMenu"),
    switchLocale: tLocale("label", { language: tLocale(target) }),
    theme: tTheme("toggle"),
    search: tCommand("trigger"),
  };
}

export type HeaderLabels = Awaited<ReturnType<typeof getHeaderLabels>>;
