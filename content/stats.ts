import type { StatInput } from "./schema";

export const stats = [
  {
    id: "years",
    value: 7,
    label: { es: "años de experiencia", en: "years of experience" },
  },
  {
    id: "brands",
    value: 3,
    label: { es: "marcas white-label en producción", en: "white-label brands in production" },
  },
  {
    id: "tests",
    value: 4238,
    label: { es: "tests en verde en la suite", en: "green tests in the suite" },
  },
  {
    id: "team",
    value: 6,
    label: {
      es: "personas en el equipo más grande que lideré",
      en: "people in the largest team I led",
    },
  },
] satisfies StatInput[];
