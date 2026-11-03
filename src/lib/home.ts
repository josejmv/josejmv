import { z } from "zod";

/**
 * Dónde vive José: origen de los arcos del globo, ubicación del perfil y país del JSON-LD.
 * Se configura con variables de entorno para cambiarlo sin tocar código (en Vercel: cambiar la
 * variable y hacer Redeploy, porque las páginas se generan en el build). Sin variables, usa los
 * valores por defecto.
 *
 *   HOME_COUNTRY=CL  HOME_CITY=Santiago  HOME_LAT=-33.45  HOME_LNG=-70.67
 */
const DEFAULTS = { country: "CO", city: "Cajicá", lat: 4.92, lng: -74.03 } as const;

const HomeEnv = z.object({
  country: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, "HOME_COUNTRY debe ser un código ISO 3166-1 alfa-2 (p. ej. AR, CL)"),
  city: z.string().trim().min(1, "HOME_CITY no puede estar vacío"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export type HomeConfig = z.infer<typeof HomeEnv>;

/** Lee y valida las variables. Un valor inválido rompe el build con un mensaje claro. */
export function readHome(env: Record<string, string | undefined> = process.env): HomeConfig {
  const pick = (value: string | undefined, fallback: string | number) =>
    value === undefined || value.trim() === "" ? fallback : value;
  const result = HomeEnv.safeParse({
    country: pick(env.HOME_COUNTRY, DEFAULTS.country),
    city: pick(env.HOME_CITY, DEFAULTS.city),
    lat: pick(env.HOME_LAT, DEFAULTS.lat),
    lng: pick(env.HOME_LNG, DEFAULTS.lng),
  });
  if (!result.success) {
    throw new Error(`Variables HOME_* inválidas: ${z.prettifyError(result.error)}`);
  }
  return result.data;
}

/** Nombre del país en el idioma pedido (Intl): «Chile» / «Chile», «España» / «Spain». */
export function countryName(code: string, locale: "es" | "en"): string {
  return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
}

export const HOME = readHome();
