import { buttonClasses } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface CvCardProps {
  href: string;
  labels: { title: string; subtitle: string; download: string; experience: string };
}

/** Descarga del CV y enlace a la trayectoria completa. */
export function CvCard({ href, labels }: CvCardProps) {
  return (
    <section
      aria-labelledby="cv-title"
      className="rounded-card border border-border bg-surface p-6"
    >
      <h2 id="cv-title" className="font-display text-xl font-semibold">
        {labels.title}
      </h2>
      <p className="mt-2 mb-5 text-sm text-muted">{labels.subtitle}</p>
      <a
        href={href}
        download
        className={buttonClasses({
          variant: "inverted",
          size: "lg",
          className: "mt-5 w-full text-[15px] whitespace-normal",
        })}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
        </svg>
        {labels.download}
      </a>
      <Link
        href="/experiencia"
        className="mt-4 inline-flex min-h-11 items-center text-sm text-accent-text underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
      >
        {labels.experience}
      </Link>
    </section>
  );
}
