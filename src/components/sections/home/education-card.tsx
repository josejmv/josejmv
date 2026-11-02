import type { LocalizedEducation } from "@/lib/content";
import { cn } from "@/lib/cn";

interface EducationCardProps {
  title: string;
  items: LocalizedEducation[];
}

function EducationIcon({ kind }: { kind: LocalizedEducation["kind"] }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      {kind === "degree" ? (
        <path d="M2 9l10-5 10 5-10 5-10-5Zm4 2v5c0 1 2.7 3 6 3s6-2 6-3v-5" />
      ) : (
        <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-3.5 4L9 14m6.5 5L15 14m-6 7 3-2 3 2" />
      )}
    </svg>
  );
}

/** Formación (Fusion): carrera y certificaciones. */
export function EducationCard({ title, items }: EducationCardProps) {
  return (
    <section
      aria-labelledby="education-title"
      className="flex flex-col gap-4 rounded-card border border-border bg-surface p-7"
    >
      <h2 id="education-title" className="font-mono text-xs font-normal text-muted">
        {title}
      </h2>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3.5">
            <span
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-xl bg-chip",
                item.kind === "degree" ? "text-accent-text" : "text-accent-2",
              )}
            >
              <EducationIcon kind={item.kind} />
            </span>
            <div>
              <p className="text-[15px] font-semibold">{item.title}</p>
              <p className="text-[13px] text-muted">{item.institution}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
