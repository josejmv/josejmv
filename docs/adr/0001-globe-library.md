# ADR 0001 — Librería del globo

**Estado:** Aceptado · 2026-11-01

## Contexto

El Home lleva un globo al estilo GitHub con arcos desde Colombia. Se evaluaron tres opciones (puntaje de 1 a 5):

| Criterio                        | cobe | react-globe.gl | R3F a mano |
| ------------------------------- | ---- | -------------- | ---------- |
| Parecido al globo de GitHub     | 4    | 5              | 5          |
| Peso del bundle                 | 5    | 2              | 3          |
| Rendimiento en móvil            | 5    | 3              | 3          |
| Arcos, tooltips y clic por país | 2    | 5              | 4          |
| Esfuerzo de integración         | 5    | 4              | 2          |
| Encaje con Three.js             | 2    | 4              | 5          |

## Decisión

**react-globe.gl.** Necesitamos dos datasets con tabs (ver ADR 0003), tooltips por país y arcos animados.

## Consecuencias

- Se carga con `next/dynamic(() => import(...), { ssr: false })` y fallback `GlobeStaticSvg` (assets en `docs/design/assets/globe-*.svg`).
- La rotación y el render se pausan fuera del viewport (IntersectionObserver). Con `prefers-reduced-motion`, el globo queda estático y sin arcos.
- En móvil se reduce la resolución (pixel ratio ≤ 1.5) y la cantidad de puntos.
- Cuidar el presupuesto de JS del Home (< 200 kB gz sin contar el chunk del globo, que se carga de forma diferida).
