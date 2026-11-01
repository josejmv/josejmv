@AGENTS.md

# CLAUDE.md — Portafolio José M. Vasquez

## Qué es

Portafolio personal bilingüe (ES/EN), con estética "Midnight Champagne" y elementos tech (terminal, ⌘K, retícula), globo 3D de colaboración y páginas de área con un diseño propio cada una. Se publica en Vercel.

Referencias de diseño en `docs/design/` (lee primero su `README.md`):

- `screens/Fusion.png`: diseño visual final del Home (oscuro).
- `screens/Palette.png`: tokens oscuro/claro y Home en claro.
- `screens/Components.png`: nombres y archivos de componentes.
- `screens/Pages.png`: Experiencia, Proyectos, Case study y móvil.
- `screens/Areas.png`: las 6 páginas de área y sus módulos firma.
- `screens/Architecture.png`: estructura del repo y flujo de datos.
- `source/*.dc.html`: markup fuente con medidas exactas.

Ya incluidos: `src/app/globals.css` (tokens), `content/countries.ts` (datos del globo), `docs/adr/0001`, `0003`.

## Stack

- Next.js (App Router, última estable), TypeScript `strict`, React Server Components por defecto.
- Tailwind CSS v4, con tokens en `src/app/globals.css` (`@theme`).
- next-intl: locales `es` (por defecto) y `en`, con rutas localizadas (`/es/experiencia` ↔ `/en/experience`).
- next-themes: tema oscuro (por defecto) y claro.
- three, @react-three/fiber y drei para 3D. **Globo: react-globe.gl** (decidido), con dos tabs: **Equipo** (nacionalidades de los compañeros) y **Empresas** (sedes de las empresas donde trabajó). Las dos vistas usan estilos de marcador distintos.
- cmdk (⌘K), Radix UI (Tabs, Dialog, Accordion), Zod (contenido), MDX (case studies).
- Vitest + Testing Library, Playwright. pnpm.

## Comandos

- `pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm e2e`
- Antes de dar por terminada una tarea: `pnpm lint && pnpm typecheck && pnpm test`.

## Tokens de diseño

| Token           | Oscuro (default)      | Claro              | Uso                                                                             |
| --------------- | --------------------- | ------------------ | ------------------------------------------------------------------------------- |
| `--bg`          | #0A0D14               | #F6F5F1            | fondo                                                                           |
| `--surface`     | #121722               | #FFFFFF            | tarjetas                                                                        |
| `--surface-2`   | #0E131D               | #EFEDE6            | tarjetas internas, terminal                                                     |
| `--chip`        | #1B2232               | #E7E4DB            | chips                                                                           |
| `--border`      | rgba(255,255,255,.08) | rgba(18,21,28,.10) | bordes                                                                          |
| `--text`        | #E8EAF0               | #12151C            | texto principal                                                                 |
| `--text-2`      | #C9D0DB               | #2E3440            | texto secundario                                                                |
| `--muted`       | #9AA3B2               | #5B6270            | etiquetas                                                                       |
| `--subtle`      | #7E8798               | #5B6270            | notas pequeñas, ejes                                                            |
| `--accent`      | #D4BF8E               | #C9AE74            | relleno de CTA y tab activa (texto encima: `--text` en claro, `--bg` en oscuro) |
| `--accent-text` | #D4BF8E               | #7D5F24            | links, cifras, texto destacado                                                  |
| `--accent-2`    | #8FB8DE               | #2F5F8A            | azul: marcadores del globo, barras                                              |
| `--success`     | #6EE7B7               | #0E7C55            | indicador disponible                                                            |

Todos los pares de texto pasan AA (≥ 4.5:1). Nunca uses `--accent` del tema claro como color de texto: para eso está `--accent-text`.
Fuentes: Sora (títulos), Inter (texto), JetBrains Mono (detalles tech), cargadas con `next/font`.

## Reglas

1. **Sin textos sueltos.** La UI usa `t('…')` (messages/*.json). El contenido viene de `content/` (validado con Zod). Toda clave debe existir en `es` y `en`, y el build falla si falta alguna.
2. **Server first.** Solo usa `"use client"` cuando hay interactividad: globo, tabs, ⌘K, toggles y demos de área.
3. **3D:** siempre con `next/dynamic` y `ssr: false`, con fallback SVG estático. Respeta `prefers-reduced-motion`. Pausa el render cuando no está en viewport.
4. **Colores solo desde tokens.** Nada de hex en componentes.
5. **Accesibilidad:** HTML semántico, objetivos táctiles ≥ 44px, contraste AA, `aria-label` en botones de solo ícono y navegación completa por teclado.
6. **Rendimiento:** LCP < 2.5 s, JS del Home < 200 kB gz, imágenes con `next/image`.
7. **Confidencialidad:** nunca nombres de proveedores, de miembros del equipo, de bancos ni de clientes institucionales. Tampoco datos de producción. Las demos usan datos ficticios. Los nombres de empresas empleadoras sí se permiten.
8. **Contacto:** el CTA primario es Gmail (`mailto:`). LinkedIn, GitHub y WhatsApp van como secundarios.
9. **Una tarea a la vez** de `docs/plan.md`, en commits pequeños. Las decisiones con alternativas van a `docs/adr/NNNN-*.md`.
10. **Nombres:** archivos en kebab-case, componentes en PascalCase, un componente por archivo.

## Mapa rápido

- Páginas: `src/app/[locale]/…`
- Secciones del Home: `src/components/sections/home/*`
- Áreas: `src/components/areas/<area>/*`. El registro está en `areas/registry.ts` (slug → componente de página).
- Contenido: `content/*.ts`, `content/projects/{es,en}/*.mdx`
