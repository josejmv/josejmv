import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  intro: string;
  /** Debajo del texto: filtros, acciones… */
  children?: ReactNode;
}

/** Cabecera de las páginas internas (Experiencia, Proyectos). */
export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <header className="container-page flex flex-col gap-5 pt-12 pb-8 lg:pt-16">
      {eyebrow && <p className="font-mono text-[13px] text-muted">{eyebrow}</p>}
      <h1 className="font-display text-4xl font-light tracking-[-0.02em] sm:text-5xl">{title}</h1>
      <p className="max-w-[640px] text-base leading-[1.7] text-muted">{intro}</p>
      {children}
    </header>
  );
}
