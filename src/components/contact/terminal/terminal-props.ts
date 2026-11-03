import "server-only";

import { getMessages, getTranslations } from "next-intl/server";

import { getAreas, getExperience, getProfile, getProjects, getStack } from "@/lib/content";

import type { TerminalData, TerminalStrings } from "./commands";

/**
 * Datos y textos de la terminal, armados en el servidor desde `content/` y `messages/`: el cliente
 * no formatea mensajes ICU (solo rellena `{placeholders}` simples) ni recibe todo el contenido.
 */
export async function getTerminalProps(locale: "es" | "en") {
  const [t, tCareer, messages] = await Promise.all([
    getTranslations({ locale, namespace: "Terminal" }),
    getTranslations({ locale, namespace: "Career" }),
    getMessages({ locale }),
  ]);
  const profile = getProfile(locale);
  const year = (ym: string) => ym.slice(0, 4);

  const data: TerminalData = {
    locale,
    name: profile.name,
    role: profile.role,
    location: profile.location,
    summary: profile.summary,
    experience: getExperience(locale).map((role) => ({
      period: `${year(role.start)} – ${role.end ? year(role.end) : tCareer("present")}`,
      role: role.role,
      company: role.company,
    })),
    stack: getStack().map((item) => item.label),
    areas: getAreas(locale).map(({ slug, title }) => ({ slug, title })),
    projects: getProjects(locale)
      .filter((project) => project.caseStudy)
      .map(({ slug, title }) => ({ slug, title })),
    contacts: [...profile.contactLinks]
      .sort((a, b) => Number(b.primary) - Number(a.primary))
      .map(({ id, label, href }) => ({ id, label, href })),
  };

  return {
    data,
    // Plantillas sin formatear: `commands.ts` rellena los `{placeholders}`.
    strings: messages.Terminal satisfies TerminalStrings,
    labels: { input: t("inputLabel"), placeholder: t("placeholder"), output: t("outputLabel") },
  };
}

export type TerminalProps = Awaited<ReturnType<typeof getTerminalProps>>;
