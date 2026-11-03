import type { ContactLink } from "@content/schema";
import type { ReactNode } from "react";

const PATHS: Record<ContactLink["id"], ReactNode> = {
  gmail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  whatsapp: (
    <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3L3 21Zm6-12.5c0 4 2.5 6.5 6.5 6.5l1-1.5-2-1-1 1c-1 0-3-2-3-3l1-1-1-2Z" />
  ),
};

/** Ícono de línea (16px) de cada canal de contacto. Hereda el color del texto. */
export function ContactIcon({ id, className }: { id: ContactLink["id"]; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "size-4"}
    >
      {PATHS[id]}
    </svg>
  );
}
