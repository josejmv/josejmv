/**
 * URL pública del sitio. Orden: variable explícita (dominio propio, 7.5) → dominio de producción
 * que Vercel inyecta en cada build → fallback local.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/** Solo producción se indexa: las previews de Vercel quedan fuera de buscadores. */
export const IS_INDEXABLE = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
