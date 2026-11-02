import type { ReactNode } from "react";

interface CalloutProps {
  /** Título corto en mono, p. ej. "decisión" o "trade-off". */
  title: string;
  children: ReactNode;
}

/** Recuadro destacado dentro de un case study. */
export function Callout({ title, children }: CalloutProps) {
  return (
    <aside className="mt-6 rounded-2xl border border-accent-text/25 bg-surface-2 p-5">
      <p className="font-mono text-xs text-accent-text">{title}</p>
      <div className="mt-2 text-sm leading-[1.7] text-text-2 [&>p]:mt-0">{children}</div>
    </aside>
  );
}
