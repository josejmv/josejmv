// Datos del globo (react-globe.gl). Dos vistas: 'team' y 'company'.
// Validar con Zod en content/schema.ts (tarea 2.1).

export type GlobeKind = "team" | "company";

export interface GlobePoint {
  id: string; // ISO 3166-1 alpha-2
  kind: GlobeKind;
  lat: number;
  lng: number;
  name: { es: string; en: string };
  companies?: string[]; // solo para kind 'company': empresas empleadoras (permitido mostrar)
}

/** Origen de los arcos: Cajicá, Colombia */
export const HOME = { lat: 4.92, lng: -74.03 } as const;

export const teamCountries: GlobePoint[] = [
  { id: "CO", kind: "team", lat: 4.71, lng: -74.07, name: { es: "Colombia", en: "Colombia" } },
  { id: "MX", kind: "team", lat: 19.43, lng: -99.13, name: { es: "México", en: "Mexico" } },
  {
    id: "SV",
    kind: "team",
    lat: 13.69,
    lng: -89.22,
    name: { es: "El Salvador", en: "El Salvador" },
  },
  { id: "VE", kind: "team", lat: 10.48, lng: -66.9, name: { es: "Venezuela", en: "Venezuela" } },
  {
    id: "US",
    kind: "team",
    lat: 38.9,
    lng: -77.04,
    name: { es: "Estados Unidos", en: "United States" },
  },
  { id: "BR", kind: "team", lat: -15.79, lng: -47.88, name: { es: "Brasil", en: "Brazil" } },
  { id: "AR", kind: "team", lat: -34.6, lng: -58.38, name: { es: "Argentina", en: "Argentina" } },
  { id: "ES", kind: "team", lat: 40.42, lng: -3.7, name: { es: "España", en: "Spain" } },
  { id: "FR", kind: "team", lat: 48.86, lng: 2.35, name: { es: "Francia", en: "France" } },
  { id: "LT", kind: "team", lat: 54.69, lng: 25.28, name: { es: "Lituania", en: "Lithuania" } },
  { id: "UA", kind: "team", lat: 50.45, lng: 30.52, name: { es: "Ucrania", en: "Ukraine" } },
  { id: "BD", kind: "team", lat: 23.81, lng: 90.41, name: { es: "Bangladesh", en: "Bangladesh" } },
];

export const companyCountries: GlobePoint[] = [
  // TODO(José): confirmar la sede de Inlaze (se asumió Colombia).
  {
    id: "CO",
    kind: "company",
    lat: 4.71,
    lng: -74.07,
    name: { es: "Colombia", en: "Colombia" },
    companies: ["UPCARD", "Trades.org", "Inlaze"],
  },
  {
    id: "FR",
    kind: "company",
    lat: 48.86,
    lng: 2.35,
    name: { es: "Francia", en: "France" },
    companies: ["MincaAI"],
  },
  {
    id: "PA",
    kind: "company",
    lat: 8.98,
    lng: -79.52,
    name: { es: "Panamá", en: "Panama" },
    companies: ["Centria Group"],
  },
  {
    id: "VE",
    kind: "company",
    lat: 10.48,
    lng: -66.9,
    name: { es: "Venezuela", en: "Venezuela" },
    companies: ["SEO Contenidos"],
  },
];
