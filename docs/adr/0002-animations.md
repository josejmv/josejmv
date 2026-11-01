# ADR 0002 — Animaciones: CSS (como utilidades de Tailwind) + motion en áreas

**Estado:** Aceptado · 2026-11-01

## Contexto
Hay que animar: contador de stats, efecto de escritura del terminal, transición de tabs, barras de impacto, Gantt y, en las páginas de área, simuladores (flujo de pagos, pipeline KYC con scroll, runner de CI). El Home tiene un presupuesto de JS < 200 kB gz y debe ser server-first.

| Opción | JS en el Home | Server-first | Demos complejas |
|---|---|---|---|
| Solo CSS | 0 kB | Sí | Costosas a mano (salidas, layout, secuencias) |
| motion en todo | +15–35 kB gz | No (obliga a `"use client"`) | Cómodas |
| **Híbrido** | ~0 kB | Sí | motion donde aporta |

## Decisión
**Híbrido.**

1. **Todo lo que se resuelva con CSS se escribe como Tailwind**, no como CSS suelto:
   - Animaciones con nombre en `@theme` (`--animate-*` + `@keyframes`) → se usan como `animate-caret`, `animate-fade-up`, etc.
   - Comportamiento reutilizable con `@utility` (p. ej. barras que crecen con `--progress`, retrasos escalonados con `--stagger`).
   - Variantes propias con `@custom-variant` cuando haga falta (estados `data-state` de Radix, `motion-safe`/`motion-reduce` nativos).
   - Todo vive en `src/app/globals.css` (o un `src/styles/animations.css` importado desde ahí si crece).
2. **JS mínimo para lo que CSS no cubre en el Home:** hooks propios pequeños (`use-in-view`, `use-reduced-motion`, contador con `requestAnimationFrame`) que solo alternan clases o `data-*`.
3. **motion (`motion/react`) solo en las demos de área** que necesiten `AnimatePresence`, animaciones de layout o secuencias orquestadas. Se usa con `LazyMotion` + `m` y `domAnimation` cargado de forma diferida, dentro de islas client. Nunca en el Home ni en el layout.

## Consecuencias
- El Home no paga JS de animación; los componentes animados con CSS pueden seguir siendo Server Components.
- `prefers-reduced-motion` se respeta con las variantes `motion-safe:`/`motion-reduce:` y la regla global de `globals.css`; en motion, con `useReducedMotion` / `MotionConfig reducedMotion="user"`.
- `lib/motion.ts` agrupa la configuración compartida de motion (transiciones, `LazyMotion` features) para las áreas.
- Si una animación del Home acaba necesitando motion, se reabre este ADR.
