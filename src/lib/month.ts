/** `YYYY-MM` → índice absoluto de mes (año × 12 + mes), para restar fechas. Puro: sirve en cliente. */
export function toMonthIndex(yearMonth: string): number {
  const [year, month] = yearMonth.split("-").map(Number);
  return year * 12 + (month - 1);
}
