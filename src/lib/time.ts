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

/** `YYYY-MM` → meses desde el año 0 (para restar fechas sin zonas horarias). */
export function toMonthIndex(yearMonth: string): number {
  const [year, month] = yearMonth.split("-").map(Number);
  return year * 12 + (month - 1);
}
