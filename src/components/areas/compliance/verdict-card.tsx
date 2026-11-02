import { cn } from "@/lib/cn";

export type CheckResult = "pass" | "review" | "fail";

export interface VerdictCheck {
  name: string;
  result: CheckResult;
  reason: string;
}

interface VerdictCardProps {
  title: string;
  subject: string;
  verdict: string;
  verdictResult: CheckResult;
  checks: VerdictCheck[];
  resultLabels: Record<CheckResult, string>;
}

const RESULT_STYLES: Record<CheckResult, string> = {
  pass: "bg-success/15 text-success",
  review: "bg-accent/15 text-accent-text",
  fail: "bg-text/10 text-text",
};

const RESULT_ICONS: Record<CheckResult, string> = { pass: "✓", review: "!", fail: "✕" };

/** Veredicto con el motivo de cada validación (expediente ficticio). */
export function VerdictCard({
  title,
  subject,
  verdict,
  verdictResult,
  checks,
  resultLabels,
}: VerdictCardProps) {
  return (
    <section
      aria-labelledby="verdict-title"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="verdict-title" className="font-mono text-xs text-muted">
            {title}
          </h3>
          <p className="mt-1 font-display text-lg font-semibold">{subject}</p>
        </div>
        <p
          className={cn(
            "rounded-pill px-3 py-1.5 text-sm font-semibold",
            RESULT_STYLES[verdictResult],
          )}
        >
          {verdict}
        </p>
      </div>
      <ul className="flex flex-col divide-y divide-border">
        {checks.map((check) => (
          <li key={check.name} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 py-3">
            <span
              aria-hidden="true"
              className={cn(
                "row-span-2 grid size-7 place-items-center rounded-full text-xs font-bold",
                RESULT_STYLES[check.result],
              )}
            >
              {RESULT_ICONS[check.result]}
            </span>
            <p className="text-sm font-semibold">
              {check.name} <span className="sr-only">: {resultLabels[check.result]}</span>
            </p>
            <p className="text-[13px] leading-relaxed text-muted">{check.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
