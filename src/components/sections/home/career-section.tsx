import { CareerGantt } from "@/components/charts/career-gantt";
import { Link } from "@/i18n/navigation";
import type { LocalizedExperience } from "@/lib/content";

interface CareerSectionProps {
  roles: LocalizedExperience[];
  now: string;
  locale: string;
  labels: {
    title: string;
    fullLink: string;
    list: string;
    present: string;
  };
}

/** "Trayectoria" (Fusion): Gantt de roles + enlace a la página de experiencia. */
export function CareerSection({ roles, now, locale, labels }: CareerSectionProps) {
  return (
    <section aria-labelledby="career-title" className="container-page mt-4">
      <div className="flex flex-col gap-[18px] rounded-card border border-border bg-surface p-5 sm:p-[30px]">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="career-title" className="font-display text-[28px] font-semibold">
            {labels.title}
          </h2>
          <Link
            href="/experiencia"
            className="inline-flex min-h-11 items-center text-sm text-accent-text underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
          >
            {labels.fullLink}
          </Link>
        </div>
        <CareerGantt
          roles={roles}
          now={now}
          locale={locale}
          labels={{ list: labels.list, present: labels.present }}
        />
      </div>
    </section>
  );
}
