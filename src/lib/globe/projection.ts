/**
 * Proyección ortográfica del globo estático (GlobeStaticSvg). Coincide con los assets
 * `public/globe/globe-*.svg`: viewBox 440, centro (220, 220), radio 200, vista centrada en
 * lon −35°, lat 18° (docs/design/README.md).
 */

export const GLOBE_VIEWBOX = 440;
export const GLOBE_CENTER = 220;
export const GLOBE_RADIUS = 200;
export const VIEW_CENTER = { lat: 18, lng: -35 } as const;

const DEG = Math.PI / 180;

/** Cámara de react-globe.gl (three `PerspectiveCamera` por defecto) y radio interno de three-globe. */
const CAMERA_FOV_DEG = 50;
const GLOBE_3D_RADIUS = 100;

/**
 * Altitud de cámara (en radios del globo) para que la esfera 3D ocupe en el lienzo la misma
 * fracción que la del SVG estático (radio 200 de 440). Así el fundido estático → 3D no cambia de
 * tamaño: la esfera de radio R vista a distancia d subtiende asin(R/d), y en pantalla mide
 * tan(asin(R/d)) / tan(fov/2) de la mitad del alto.
 */
export function cameraAltitude(fill = (2 * GLOBE_RADIUS) / GLOBE_VIEWBOX): number {
  const tanAngle = fill * Math.tan((CAMERA_FOV_DEG / 2) * DEG);
  const distance = GLOBE_3D_RADIUS / Math.sin(Math.atan(tanAngle));
  return distance / GLOBE_3D_RADIUS - 1;
}

export interface ProjectedPoint {
  x: number;
  y: number;
  /** `false` si el punto está en la cara oculta del globo. */
  visible: boolean;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export function project({ lat, lng }: LatLng, center: LatLng = VIEW_CENTER): ProjectedPoint {
  const phi = lat * DEG;
  const phi0 = center.lat * DEG;
  const lambda = (lng - center.lng) * DEG;

  const x = GLOBE_RADIUS * Math.cos(phi) * Math.sin(lambda);
  const y =
    GLOBE_RADIUS *
    (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda));
  const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda);

  return { x: GLOBE_CENTER + x, y: GLOBE_CENTER - y, visible: cosC > 0 };
}

/**
 * Para puntos ocultos: los lleva al borde del globo (un poco por fuera), en la dirección en que
 * quedan, para dibujar una flecha "→" hacia ellos.
 */
export function toLimb(point: ProjectedPoint, offset = 14): ProjectedPoint {
  const dx = point.x - GLOBE_CENTER;
  const dy = point.y - GLOBE_CENTER;
  const length = Math.hypot(dx, dy) || 1;
  const r = GLOBE_RADIUS + offset;
  return {
    x: GLOBE_CENTER + (dx / length) * r,
    y: GLOBE_CENTER + (dy / length) * r,
    visible: false,
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Arco cuadrático entre dos puntos, curvado hacia afuera del centro del globo. */
export function arcPath(from: ProjectedPoint, to: ProjectedPoint): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const dx = mx - GLOBE_CENTER;
  const dy = my - GLOBE_CENTER;
  const length = Math.hypot(dx, dy) || 1;
  // Cuanto más largo el arco, más se separa del globo (como un gran círculo visto de frente).
  const lift = distance * 0.35;
  const cx = mx + (dx / length) * lift;
  const cy = my + (dy / length) * lift;
  return `M${round(from.x)} ${round(from.y)} Q${round(cx)} ${round(cy)} ${round(to.x)} ${round(to.y)}`;
}
