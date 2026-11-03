"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";

import type { CommandArea, CommandProject } from "./command-palette";

// cmdk solo se descarga la primera vez que se abre el menú: no pesa en el JS inicial del Home.
const CommandPalette = dynamic(() => import("./command-palette").then((m) => m.CommandPalette), {
  ssr: false,
});

const subscribeNoop = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export interface CommandMenuProps {
  areas: CommandArea[];
  projects: CommandProject[];
  email: string;
  className?: string;
}

/** Botón "Buscar… ⌘K" del header + atajo global ⌘K / Ctrl+K. */
export function CommandMenu({ areas, projects, email, className }: CommandMenuProps) {
  const t = useTranslations("Command");
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // Elemento con foco antes de abrir: se restaura al cerrar (el diálogo se monta de forma diferida).
  const restoreFocus = useRef<HTMLElement | null>(null);
  // En el servidor se asume ⌘; tras hidratar se corrige a Ctrl fuera de Apple.
  const apple = useSyncExternalStore(subscribeNoop, isApple, () => true);
  const shortcut = apple ? "⌘K" : "Ctrl K";

  const changeOpen = useCallback((next: boolean) => {
    if (next) {
      restoreFocus.current = document.activeElement as HTMLElement | null;
      setLoaded(true);
    } else {
      // Tras el cierre de Radix, que intenta mover el foco por su cuenta.
      setTimeout(() => restoreFocus.current?.focus(), 0);
    }
    setOpen(next);
  }, []);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        changeOpen(!openRef.current);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeOpen]);

  const openMenu = () => changeOpen(true);

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        onPointerEnter={() => setLoaded(true)}
        aria-keyshortcuts={apple ? "Meta+K" : "Control+K"}
        className={cn(
          "inline-flex h-11 min-w-11 items-center justify-center gap-2.5 rounded-pill border border-border bg-surface-2 pr-3 pl-4 font-mono text-[13px] text-muted transition-colors hover:text-text pointer-coarse:px-0",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
          className,
        )}
      >
        {/* El nombre accesible sale del contenido (WCAG 2.5.3): el texto solo se oculta visualmente. */}
        <span className="sr-only lg:not-sr-only">{t("trigger")}</span>
        <kbd className="rounded-md bg-chip px-2 py-0.5 font-mono text-text-2 pointer-coarse:hidden">
          {shortcut}
        </kbd>
        {/* En pantallas táctiles no hay atajo de teclado: se muestra una lupa. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="hidden size-5 text-text pointer-coarse:block"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
      {loaded && (
        <CommandPalette
          open={open}
          onOpenChange={changeOpen}
          areas={areas}
          projects={projects}
          email={email}
        />
      )}
    </>
  );
}
