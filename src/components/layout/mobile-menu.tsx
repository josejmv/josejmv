"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { cn } from "@/lib/cn";

// Radix Dialog solo se descarga al abrir el menú: no pesa en el JS inicial.
const MobileMenuSheet = dynamic(
  () => import("./mobile-menu-sheet").then((m) => m.MobileMenuSheet),
  { ssr: false },
);

export interface MobileMenuArea {
  slug: string;
  title: string;
}

/** Botón ☰ del header móvil. Abre el Sheet con secciones, las 6 áreas, idioma y tema. */
export function MobileMenu({ areas, className }: { areas: MobileMenuArea[]; className?: string }) {
  const tHeader = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        onPointerEnter={() => setLoaded(true)}
        aria-label={tHeader("openMenu")}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-pill border border-border text-text transition-colors hover:bg-chip",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
          className,
        )}
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
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      {loaded && (
        <MobileMenuSheet
          open={open}
          setOpen={setOpen}
          areas={areas}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        />
      )}
    </>
  );
}
