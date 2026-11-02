interface Level {
  key: string;
  label: string;
  /** Nombres de componentes de ejemplo (identificadores de código: no se traducen). */
  items: string[];
}

interface AtomicLibraryMapProps {
  title: string;
  note: string;
  levels: Level[];
}

/** Mapa de la librería atómica (10 átomos · 7 moléculas · 5 organismos · 5 templates). */
export function AtomicLibraryMap({ title, note, levels }: AtomicLibraryMapProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {levels.map((level) => (
          <li
            key={level.key}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-2 p-4"
          >
            <p className="flex items-baseline justify-between">
              <span className="text-sm font-semibold">{level.label}</span>
              <span className="font-display text-2xl font-semibold text-accent-text">
                {level.items.length}
              </span>
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {level.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md bg-chip px-2 py-1 font-mono text-[11px] text-text-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted">{note}</p>
    </div>
  );
}
