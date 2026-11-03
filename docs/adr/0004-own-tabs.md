# ADR 0004 — Tabs propias (`useTabs`) en lugar de Radix Tabs en el Home

**Estado:** Aceptado · 2026-11-03

## Contexto

La 7.3 pide Lighthouse ≥ 90 en móvil. En el Home, la puntuación la arrastra el Total Blocking Time, que viene casi todo del JS de framework (React, runtime de Next). Lo único grande que no era framework era el chunk de Radix: ~10 kB gz y ~100 ms de CPU (con CPU 4x) al evaluarse. Radix Tabs se usaba solo en dos sitios, los dos en el Home: las tabs del globo (Equipo / Empresas) y las de las 6 áreas.

| Opción                         | JS inicial del Home                           | Accesibilidad                       | Mantenimiento      |
| ------------------------------ | --------------------------------------------- | ----------------------------------- | ------------------ |
| Seguir con Radix Tabs          | +10 kB gz, ~100 ms CPU (4x)                   | Completa, probada                   | Ninguno            |
| Cargar Radix de forma diferida | Igual al hidratar (las tabs se ven al cargar) | Completa                            | Más complejo       |
| **Hook propio (`useTabs`)**    | ~1 kB                                         | Patrón WAI-ARIA, cubierto por tests | Un archivo pequeño |

## Decisión

**Hook propio**: `src/components/ui/use-tabs.ts`. Implementa el patrón WAI-ARIA «Tabs» con activación automática, igual que Radix por defecto:

- Roles `tablist`, `tab` y `tabpanel`, enlazados con `aria-controls` y `aria-labelledby`.
- Teclado: ← y → (circulares), Home y End. Solo la tab activa entra en el orden de Tab (_roving tabindex_).
- Atributo `data-state="active" | "inactive"` en tabs y paneles, como Radix, para que los estilos no cambien.
- Los paneles inactivos llevan `hidden`: todo el contenido sigue en el HTML y es indexable.

Radix sigue usándose para Dialog (menú móvil y ⌘K), que se carga de forma diferida y no pesa en el JS inicial.

## Consecuencias

- El JS inicial del Home quedó en 169 kB gz, sin Radix. Mediana de 5 corridas de Lighthouse móvil en local: de 82 a 84; TBT, de 358 a 333 ms.
- Los tests unitarios de las tabs, axe y la prueba E2E de teclado (flechas en las tabs del globo, foco visible) cubren el comportamiento.
- Si en el futuro se necesitan tabs con orientación vertical o activación manual, se amplía el hook o se vuelve a Radix en esa página.
