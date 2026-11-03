import type { ContactLink as ContactLinkData } from "@content/schema";
import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

import { ContactLink } from "./contact-link";
import type { TerminalProps } from "./terminal/terminal-props";
import { TerminalPrompt } from "./terminal/terminal-prompt";

interface ContactTerminalProps {
  title: string;
  command: string;
  /** Etiqueta accesible de la lista de enlaces. */
  listLabel: string;
  links: ContactLinkData[];
  /** Prompt interactivo (comandos, easter eggs). */
  terminal: TerminalProps;
  className?: string;
}

const STEP_MS = 55;
const START_MS = 300;

/**
 * Terminal de contacto (Fusion). El comando se "escribe" con CSS (`typing`) y los enlaces aparecen
 * después, escalonados; con reduced-motion todo aparece de inmediato. Gmail va primero y con relleno
 * (CTA primario). La última línea es un prompt real (`TerminalPrompt`): acepta comandos.
 */
export function ContactTerminal({
  title,
  command,
  listLabel,
  links,
  terminal,
  className,
}: ContactTerminalProps) {
  const ordered = [...links].sort((a, b) => Number(b.primary) - Number(a.primary));
  const typedMs = START_MS + command.length * STEP_MS;

  return (
    <div
      // El input no dibuja anillo propio: la terminal entera marca el foco.
      data-focus-ring
      className={cn(
        "max-w-[560px] overflow-hidden rounded-2xl border border-border bg-surface-2/90",
        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent-text",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-3.5 py-2.5">
        {[0, 1, 2].map((dot) => (
          <span key={dot} aria-hidden="true" className="size-2.5 rounded-full bg-chip" />
        ))}
        <span className="ml-2.5 font-mono text-xs text-subtle">{title}</span>
      </div>

      <div className="px-[18px] py-3.5 font-mono text-[13px] leading-[1.9]">
        <p>
          <span aria-hidden="true" className="text-accent-text">
            ${" "}
          </span>
          <span className="typing" style={{ "--chars": command.length } as CSSProperties}>
            {command}
          </span>
        </p>

        <ul aria-label={listLabel} className="flex flex-wrap gap-2 py-2">
          {ordered.map((link, index) => (
            <li
              key={link.id}
              className="motion-safe:animate-fade-up"
              style={{ animationDelay: `${typedMs + index * 90}ms` }}
            >
              <ContactLink link={link} />
            </li>
          ))}
        </ul>

        <TerminalPrompt {...terminal} />
      </div>
    </div>
  );
}
