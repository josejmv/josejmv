import { getTranslations } from "next-intl/server";

import { CommandMenu } from "@/components/command/command-menu";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { ContentLocale } from "@content/schema";
import { getAreas, getProfile, getProjects } from "@/lib/content";

import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { SiteLogo } from "./site-logo";

/**
 * Header en píldora (Fusion). Desktop: logo · MainNav · idioma · tema.
 * Móvil (< md): logo · menú (Sheet). El buscador ⌘K se suma en la tarea 3.4.
 */
export async function SiteHeader({ locale }: { locale: ContentLocale }) {
  const t = await getTranslations({ locale, namespace: "Header" });
  const profile = getProfile(locale);
  const areas = getAreas(locale).map(({ slug, title }) => ({ slug, title }));
  const projects = getProjects(locale)
    .filter((project) => project.caseStudy)
    .map(({ slug, title }) => ({ slug, title }));

  return (
    <header className="relative z-20 container-page pt-4 md:pt-7">
      <div className="flex items-center justify-between gap-4 rounded-pill border border-border bg-surface/75 py-1.5 pr-1.5 pl-5 backdrop-blur-md md:py-2.5 md:pr-3 md:pl-[22px]">
        <SiteLogo monogram={profile.monogram} label={t("home", { name: profile.name })} />
        <MainNav className="hidden md:block" />
        <div className="flex items-center gap-2">
          <CommandMenu areas={areas} projects={projects} email={profile.email} />
          <LocaleSwitcher className="hidden md:inline-flex" />
          <ThemeToggle className="hidden md:inline-flex" />
          <MobileMenu areas={areas} className="md:hidden" />
        </div>
      </div>
    </header>
  );
}
