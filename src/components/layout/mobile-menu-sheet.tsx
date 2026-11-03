"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useLocale, useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

import type { MobileMenuArea } from "./mobile-menu";
import { NAV_ITEMS } from "./nav-items";

const itemClasses =
  "flex h-11 w-full items-center justify-center rounded-xl bg-surface-2 text-sm text-text-2 transition-colors hover:bg-chip hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

interface MobileMenuSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  areas: MobileMenuArea[];
  /** Devuelve el foco al botón ☰ (el Sheet se monta de forma diferida, sin Dialog.Trigger). */
  onCloseAutoFocus: (event: Event) => void;
}

/** Contenido del menú móvil. Se carga solo al abrirlo por primera vez (Radix Dialog). */
export function MobileMenuSheet({ open, setOpen, areas, onCloseAutoFocus }: MobileMenuSheetProps) {
  const t = useTranslations("Nav");
  const tHeader = useTranslations("Header");
  const tLocale = useTranslations("LocaleSwitcher");
  const tTheme = useTranslations("Theme");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm motion-safe:animate-fade-up" />
        <Dialog.Content
          onCloseAutoFocus={onCloseAutoFocus}
          className="fixed inset-x-3 top-3 z-50 max-h-[calc(100dvh-24px)] overflow-y-auto rounded-card border border-border bg-surface p-4 shadow-2xl motion-safe:animate-fade-up"
        >
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-mono text-xs text-muted">
              {tHeader("menuTitle")}
            </Dialog.Title>
            <Dialog.Close
              aria-label={tHeader("closeMenu")}
              className="inline-flex size-11 items-center justify-center rounded-pill text-text transition-colors hover:bg-chip focus-visible:outline-2 focus-visible:outline-accent-text"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{tHeader("menuDescription")}</Dialog.Description>

          <nav aria-label={tHeader("primaryNav")}>
            <ul className="flex flex-col gap-2">
              {NAV_ITEMS.filter((item) => item.key !== "areas").map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={item.match?.(pathname) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(itemClasses, item.match?.(pathname) && "text-text")}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              <li>
                <details className="group">
                  <summary
                    className={cn(
                      itemClasses,
                      "cursor-pointer list-none gap-1.5 [&::-webkit-details-marker]:hidden",
                    )}
                  >
                    {t("areas")}
                    <span aria-hidden="true" className="transition-transform group-open:rotate-90">
                      ▸
                    </span>
                    <span className="font-mono text-xs text-subtle">{areas.length}</span>
                  </summary>
                  <ul className="mt-2 grid grid-cols-2 gap-2">
                    <li className="col-span-2">
                      <Link
                        href="/areas"
                        aria-current={pathname === "/areas" ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(itemClasses, "px-2 text-[13px] text-accent-text")}
                      >
                        {t("allAreas")}
                      </Link>
                    </li>
                    {areas.map((area) => (
                      <li key={area.slug}>
                        <Link
                          href={{ pathname: "/areas/[slug]", params: { slug: area.slug } }}
                          onClick={() => setOpen(false)}
                          className={cn(itemClasses, "px-2 text-[13px]")}
                        >
                          {area.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            </ul>
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <LocaleSwitcher
              label={tLocale("label", { language: tLocale(locale === "es" ? "en" : "es") })}
              className="w-full justify-center"
            />
            <ThemeToggle label={tTheme("toggle")} className="w-full" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
