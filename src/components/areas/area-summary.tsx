import { Chip } from "@/components/ui/chip";
import { Link } from "@/i18n/navigation";
import type { LocalizedArea } from "@/lib/content";

interface AreaSummaryProps {
  area: LocalizedArea;
  casesLabel: string;
}

/** Texto, bullets, tecnologías y enlace a la página del área. */
export function AreaSummary({ area, casesLabel }: AreaSummaryProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <p className="leading-[1.7] text-text-2">{area.summary}</p>
      <ul className="list-disc pl-[18px] text-sm leading-[1.8] text-muted marker:text-subtle">
        {area.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-1.5">
        {area.tech.map((tech) => (
          <li key={tech}>
            <Chip variant="tech">{tech}</Chip>
          </li>
        ))}
      </ul>
      <Link
        href={{ pathname: "/areas/[slug]", params: { slug: area.slug } }}
        className="inline-flex min-h-11 items-center self-start text-sm text-accent-text underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
      >
        {casesLabel}
      </Link>
    </div>
  );
}
