import type { AbstractIntlMessages, Messages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";

/** Namespaces que usan los componentes cliente presentes en todas las páginas (header y ⌘K). */
export const GLOBAL_CLIENT_NAMESPACES = [
  "Header",
  "Nav",
  "LocaleSwitcher",
  "Theme",
  "Command",
] as const satisfies readonly (keyof Messages)[];

interface ClientMessagesProps {
  /** Namespaces extra que necesita el subárbol cliente (p. ej. la demo de un área). */
  namespaces?: readonly (keyof Messages)[];
  children: ReactNode;
}

/**
 * Proveedor de next-intl que envía al cliente solo los namespaces necesarios, en vez de todos los
 * mensajes del sitio. Los componentes de servidor no dependen de esto: leen todo en el servidor.
 * Un namespace que falte aquí rompe el test E2E de consola (`MISSING_MESSAGE`).
 */
export async function ClientMessages({ namespaces = [], children }: ClientMessagesProps) {
  const all = await getMessages();
  const picked = Object.fromEntries(
    [...GLOBAL_CLIENT_NAMESPACES, ...namespaces].map((ns) => [ns, all[ns]]),
  ) as AbstractIntlMessages;
  return <NextIntlClientProvider messages={picked}>{children}</NextIntlClientProvider>;
}
