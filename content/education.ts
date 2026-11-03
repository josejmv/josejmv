import type { EducationInput } from "./schema";

export const education = [
  {
    id: "unet",
    kind: "degree",
    title: {
      es: "Ingeniería en Informática (estudios)",
      en: "Computer Engineering (coursework)",
    },
    institution: {
      es: "Universidad Nacional Experimental del Táchira · UNET",
      en: "Universidad Nacional Experimental del Táchira · UNET",
    },
  },
  {
    id: "platzi",
    kind: "certification",
    title: { es: "Certificaciones Platzi", en: "Platzi certifications" },
    institution: { es: "Next.js · React", en: "Next.js · React" },
  },
] satisfies EducationInput[];
