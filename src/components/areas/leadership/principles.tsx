export interface Principle {
  key: string;
  title: string;
  body: string;
  /** Evidencia concreta que respalda el principio. */
  evidence: string;
}

interface PrinciplesProps {
  title: string;
  items: Principle[];
}

/** Principles: tarjetas con forma de valores, cada una con su evidencia. */
export function Principles({ title, items }: PrinciplesProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <ul className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex flex-col gap-2 rounded-2xl border border-accent-text/25 bg-surface p-5"
          >
            <p className="font-mono text-xs text-accent-text">{item.title}</p>
            <p className="font-display text-lg leading-snug">{item.body}</p>
            <p className="mt-auto text-xs leading-relaxed text-muted">{item.evidence}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
