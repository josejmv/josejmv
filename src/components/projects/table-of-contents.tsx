import type { TocEntry } from "@/lib/case-study";

interface TableOfContentsProps {
  entries: TocEntry[];
  label: string;
}

/** Índice del case study. Sticky en desktop; en móvil va antes del artículo. */
export function TableOfContents({ entries, label }: TableOfContentsProps) {
  return (
    <nav aria-label={label} className="lg:sticky lg:top-28 lg:self-start">
      <p className="mb-2 font-mono text-xs text-subtle">{label}</p>
      <ol className="flex flex-col border-l border-border">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="-ml-px flex min-h-11 items-center border-l border-transparent pl-4 text-sm text-muted transition-colors hover:border-accent-text hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
