"use client";

import { Command } from "cmdk";
import { useParams, useRouter as useNextRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type ComponentProps, type ReactNode, useEffect, useState } from "react";

import { getPathname, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Href = Parameters<ReturnType<typeof useRouter>["push"]>[0];

export interface CommandArea {
  slug: string;
  title: string;
}

export interface CommandProject {
  slug: string;
  title: string;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areas: CommandArea[];
  /** Proyectos con case study. */
  projects: CommandProject[];
  email: string;
}

const itemClasses =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm text-text-2 data-[selected=true]:bg-chip data-[selected=true]:text-text";

function Item({
  children,
  hint,
  ...props
}: ComponentProps<typeof Command.Item> & { hint?: ReactNode }) {
  return (
    <Command.Item {...props} className={itemClasses}>
      <span className="flex-1">{children}</span>
      {hint && <span className="font-mono text-xs text-subtle">{hint}</span>}
    </Command.Item>
  );
}

const groupClasses =
  "**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:font-mono **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:text-subtle";

/** Paleta ⌘K: navegar a secciones y áreas, cambiar idioma y tema, y copiar el email. */
export function CommandPalette({
  open,
  onOpenChange,
  areas,
  projects,
  email,
}: CommandPaletteProps) {
  const t = useTranslations("Command");
  const tNav = useTranslations("Nav");
  const tLocale = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  const params = useParams();
  const { resolvedTheme, setTheme } = useTheme();
  const [status, setStatus] = useState("");

  // La confirmación se oculta sola a los 2,5 s.
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(""), 2500);
    return () => clearTimeout(timer);
  }, [status]);

  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  function run(action: () => void) {
    action();
    onOpenChange(false);
  }

  function go(href: Href) {
    run(() => router.push(href));
  }

  /** El router de next-intl no acepta `hash`: se resuelve la URL y se navega con el de Next. */
  function goToSection(hash: string) {
    run(() => nextRouter.push(`${getPathname({ href: "/", locale })}#${hash}`));
  }

  function switchLocale() {
    const { locale: _ignored, ...routeParams } = params;
    void _ignored;
    run(() =>
      router.replace({ pathname, params: routeParams } as unknown as Href, {
        locale: otherLocale,
      }),
    );
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus(t("copied"));
    } catch {
      setStatus(t("copyFailed", { email }));
    }
  }

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={onOpenChange}
        label={t("title")}
        overlayClassName="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm"
        contentClassName="fixed top-[12vh] left-1/2 z-50 w-[min(640px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-card border border-border bg-surface shadow-2xl motion-safe:animate-fade-up"
      >
        <Command.Input
          placeholder={t("placeholder")}
          className="h-14 w-full border-b border-border bg-transparent px-5 font-mono text-sm text-text outline-none placeholder:text-subtle"
        />
        <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
            {t("empty")}
          </Command.Empty>

          <Command.Group heading={t("groups.navigation")} className={groupClasses}>
            <Item value="nav-home" keywords={[tNav("home")]} onSelect={() => go("/")}>
              {tNav("home")}
            </Item>
            <Item
              value="nav-experience"
              keywords={[tNav("experience")]}
              onSelect={() => go("/experiencia")}
            >
              {tNav("experience")}
            </Item>
            <Item
              value="nav-projects"
              keywords={[tNav("projects")]}
              onSelect={() => go("/proyectos")}
            >
              {tNav("projects")}
            </Item>
            <Item
              value="nav-contact"
              keywords={[tNav("contact")]}
              onSelect={() => goToSection("contacto")}
            >
              {tNav("contact")}
            </Item>
          </Command.Group>

          <Command.Group heading={t("groups.areas")} className={groupClasses}>
            {areas.map((area) => (
              <Item
                key={area.slug}
                value={`area-${area.slug}`}
                keywords={[area.title, tNav("areas")]}
                onSelect={() => go({ pathname: "/areas/[slug]", params: { slug: area.slug } })}
              >
                {area.title}
              </Item>
            ))}
          </Command.Group>

          {projects.length > 0 && (
            <Command.Group heading={t("groups.projects")} className={groupClasses}>
              {projects.map((project) => (
                <Item
                  key={project.slug}
                  value={`project-${project.slug}`}
                  keywords={[project.title, tNav("projects")]}
                  onSelect={() =>
                    go({ pathname: "/proyectos/[slug]", params: { slug: project.slug } })
                  }
                >
                  {project.title}
                </Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading={t("groups.preferences")} className={groupClasses}>
            <Item
              value="pref-language"
              keywords={[tLocale(otherLocale), "idioma", "language"]}
              hint={otherLocale.toUpperCase()}
              onSelect={switchLocale}
            >
              {t("switchLanguage", { language: tLocale(otherLocale) })}
            </Item>
            <Item
              value="pref-theme"
              keywords={["tema", "theme", "dark", "light"]}
              onSelect={() => run(() => setTheme(resolvedTheme === "light" ? "dark" : "light"))}
            >
              {t("toggleTheme")}
            </Item>
          </Command.Group>

          <Command.Group heading={t("groups.actions")} className={groupClasses}>
            <Item
              value="action-copy-email"
              keywords={["email", "gmail", "correo", "mail"]}
              hint={email}
              onSelect={() => run(() => void copyEmail())}
            >
              {t("copyEmail")}
            </Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>

      {/* Confirmación de "copiar email", visible y anunciada (el diálogo ya está cerrado). */}
      <p
        role="status"
        aria-live="polite"
        className={
          status
            ? "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill border border-border bg-surface px-4 py-2.5 text-sm text-text shadow-xl motion-safe:animate-fade-up"
            : "sr-only"
        }
      >
        {status}
      </p>
    </>
  );
}
