import { Chip } from "@/components/ui/chip";

interface GlobeLegendProps {
  /** Insignia destacada, p. ej. "Equipos multiculturales". */
  highlight: string;
  /** Idiomas con su nivel, p. ej. "Español · nativo". */
  languages: string[];
  /** Línea con la lista de países (o de sedes) de la vista activa. */
  summary: string;
}

/** Bajo el globo: LanguageBadges + lista de países de la vista activa (Fusion). */
export function GlobeLegend({ highlight, languages, summary }: GlobeLegendProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <ul className="flex max-w-[480px] flex-wrap justify-center gap-2">
        <li>
          <Chip variant="accent">{highlight}</Chip>
        </li>
        {languages.map((language) => (
          <li key={language}>
            <Chip variant="subtle">{language}</Chip>
          </li>
        ))}
      </ul>
      <p className="max-w-[460px] text-center text-xs leading-relaxed text-subtle">{summary}</p>
    </div>
  );
}
