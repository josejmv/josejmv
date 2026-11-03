import { cacheLife } from "next/cache";

/**
 * Mes actual como `YYYY-MM`. Con `cacheComponents`, `new Date()` solo puede ir dentro de
 * `use cache`; se recalcula a diario.
 */
export async function getCurrentMonth(): Promise<string> {
  "use cache";
  cacheLife("days");
  return new Date().toISOString().slice(0, 7);
}

// Puro y sin "use cache": vive aparte para poder usarse en componentes cliente.
export { toMonthIndex } from "./month";
