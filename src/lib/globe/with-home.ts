import type { GlobeHome, LocalizedCountry } from "@/lib/content";

/**
 * Puntos de una vista del globo con el origen incluido. Si el país de HOME_COUNTRY no está en la
 * lista (p. ej. te mudas a un país sin compañeros ni sedes), se añade un punto para él; no cuenta
 * en las cifras de las tabs porque estas usan la lista original.
 */
export function withHome(points: LocalizedCountry[], home: GlobeHome): LocalizedCountry[] {
  if (points.some((p) => p.id === home.id)) return points;
  return [...points, { id: home.id, kind: "team", lat: home.lat, lng: home.lng, name: home.name }];
}
