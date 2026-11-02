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

## Actualización · 2026-11-02 (tarea 4.3)

**Medido:** el chunk diferido del globo (three + react-globe.gl + capa de hexágonos + `world-atlas/land-110m`) pesa **~555 kB gz**, muy por encima de lo previsto. El JS inicial del Home no cambia (164 kB gz), pero el globo está en el Hero, así que el chunk se pediría al cargar la página.

**Ajuste de la decisión** (se mantiene react-globe.gl):
- El 3D solo se carga en **desktop con puntero fino** (`(min-width: 1024px) and (pointer: fine)`), con WebGL, sin `prefers-reduced-motion` y sin ahorro de datos (`navigator.connection.saveData`).
- Se pide con el navegador **ocioso** (`requestIdleCallback`, máx. 2,5 s) y cerca del viewport, para no competir con el LCP.
- En móvil y tablet se queda el `GlobeStaticSvg` (~12 kB gz del SVG del tema activo, sin JS). Esto reemplaza el "pixel ratio ≤ 1.5 en móvil", que sigue aplicando en desktop.
- Revisar en la 7.3: si Lighthouse desktop baja de 90 por el chunk, evaluar cobe (ver tabla) o un globo propio con three sin la capa de hexágonos.
