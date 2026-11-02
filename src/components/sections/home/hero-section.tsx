import type { ReactNode } from "react";

import { ContactTerminal } from "@/components/contact/contact-terminal";
import { AvailabilityBadge } from "@/components/ui/availability-badge";
import { GradientText } from "@/components/ui/gradient-text";
import type { LocalizedProfile } from "@/lib/content";

interface HeroSectionProps {
  profile: LocalizedProfile;
  labels: {
    terminalTitle: string;
    terminalCommand: string;
    contactList: string;
  };
  /** Columna derecha: el globo con sus tabs (tareas 4.2–4.4). */
  aside?: ReactNode;
}

/** Hero del Home: identidad + terminal de contacto a la izquierda y globo a la derecha. */
export function HeroSection({ profile, labels, aside }: HeroSectionProps) {
  // El apellido va con degradado: "José M. <Vasquez>".
  const lastSpace = profile.name.lastIndexOf(" ");
  const first = profile.name.slice(0, lastSpace + 1);
  const last = profile.name.slice(lastSpace + 1);

  return (
    <section
      aria-labelledby="hero-title"
      className="container-page grid items-center gap-8 pt-12 pb-10 lg:grid-cols-2 lg:pt-16"
    >
      <div className="flex flex-col gap-[22px]">
        <AvailabilityBadge available={profile.available}>
          {profile.role} · {profile.location}
        </AvailabilityBadge>

        <h1
          id="hero-title"
          className="font-display text-5xl leading-none font-light tracking-[-0.025em] sm:text-6xl xl:text-[72px]"
        >
          {first}
          <GradientText className="font-bold">{last}</GradientText>
        </h1>

        <p className="font-display text-lg text-text-2 sm:text-xl">{profile.headline}</p>

        <p className="max-w-[540px] text-base leading-[1.7] text-muted">{profile.summary}</p>

        <ContactTerminal
          title={labels.terminalTitle}
          command={labels.terminalCommand}
          listLabel={labels.contactList}
          links={profile.contactLinks}
        />
      </div>

      {aside && <div className="flex flex-col items-center gap-4">{aside}</div>}
    </section>
  );
}
