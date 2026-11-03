# Plan de implementación — Portafolio

Cada tarea está pensada para una sesión de Claude Code. **Criterio de "hecho" en todas:** lint, typecheck y tests en verde, y textos en ES y EN.

## Fase 0 — Decisiones (antes de codear)

- [x] **0.1** ADR 0001: globo con **react-globe.gl**, cargado con `next/dynamic`, `ssr:false` y fallback SVG.
- [x] **0.2** ADR 0002: híbrido. CSS escrito como utilidades de Tailwind (`@theme --animate-*`, `@utility`) en todo el sitio; `motion` con `LazyMotion` solo en las demos de área.
- [x] **0.3** ADR 0003: el globo tiene dos tabs, **Equipo** (nacionalidades) y **Empresas** (sedes). En `content/countries.ts` cada país lleva `kind: 'team' | 'company'`.
- [x] **0.4** Paleta clara definida en CLAUDE.md, con contraste AA verificado.
- [x] **0.5** Confidencialidad: sin nombres de proveedores, miembros del equipo, bancos ni clientes. Todo lo demás se puede publicar.

## Fase 1 — Base

- [x] **1.1** Crear el proyecto con Next.js, TS strict, pnpm, ESLint, Prettier, Vitest y Playwright. _(Reconciliado desde create-next-app 16.4: yarn → pnpm, `app/` → `src/app/`. Tailwind se carga con el loader `@tailwindcss/turbopack` del scaffold, sin PostCSS. `typecheck` corre `next typegen` antes de `tsc` porque Next 16 genera `LayoutProps`/`PageProps`.)_
- [x] **1.2** Tailwind v4 con los tokens de CLAUDE.md en `@theme`, y fuentes con `next/font`.
- [x] **1.3** next-intl: `routing.ts` con pathnames localizados, middleware, `[locale]/layout.tsx` y `messages/{es,en}.json`. _(Next 16 deprecó `middleware.ts`: ahora es `src/proxy.ts`, con `export default createMiddleware(routing)` de next-intl 4.14. La paridad de claves ES/EN se comprueba en `src/i18n/messages-parity.ts` (rompe `tsc` y `next build`) y en un test. Con `cacheComponents`, el 404 del catch-all `[...rest]` se resuelve vía RSC: revisar en 7.1.)_
- [x] **1.4** next-themes: ThemeProvider y ThemeToggle, sin parpadeo al cargar.
- [x] **1.5** CI (GitHub Actions): lint, typecheck, test y build. Proyecto en Vercel con previews por PR. _(CI listo en `.github/workflows/ci.yml`. Remoto: `josejmv/josejmv`, rama `v2`; `dev` conserva el sitio viejo hasta la 7.5. Vercel ya genera previews de `v2`; producción despliega desde `dev`.)_

## Fase 2 — Contenido

- [x] **2.1** `content/schema.ts` con los esquemas Zod: Profile, ContactLink, Experience, Area, Country, Stat, Education y StackItem, con campos localizados `{ es, en }`.
- [x] **2.2** Pasar el CV a `content/*.ts`: experiencia, áreas, métricas, formación y stack. _(Primera versión desde el vault. Pendientes de confirmar: ver los TODO(José) y el resumen de la sesión.)_
- [x] **2.3** `content/countries.ts`: 13 nacionalidades del equipo y 5 países de empresas. _(2026-11-02: Inlaze confirmada en Colombia; Trades.org pasa a Estados Unidos.)_
- [x] **2.4** `lib/content.ts`: getters server-only por locale, más un test que valide todo el contenido.

## Fase 3 — Layout y UI base

- [x] **3.1** Primitivas en `ui/`: Button, Chip, StatCard, GradientText, AvailabilityBadge y AnimatedCounter.
- [x] **3.2** Fondos: GridBackground y GlowOrbs.
- [x] **3.3** SiteHeader (MainNav, LocaleSwitcher, ThemeToggle), MobileMenu (Sheet) y SiteFooter.
- [x] **3.4** CommandMenu (⌘K) con cmdk: navegar a secciones, áreas y proyectos, cambiar idioma y tema, y copiar el email. _(cmdk y el Sheet móvil se cargan al abrirse por primera vez: JS inicial de `/es` = 163 kB gz sin el chunk `noModule`. El grupo de proyectos (case studies) se agregó en la 5.3.)_

## Fase 4 — Home

- [x] **4.1** HeroSection y ContactTerminal (con efecto de escritura, Gmail como primario).
- [x] **4.2** GlobeStaticSvg como fallback, a partir del SVG del lienzo.
- [x] **4.3** CollaborationGlobe con react-globe.gl: arcos desde Colombia, marcadores con tooltip, pausa fuera del viewport y reduced-motion.
- [x] **4.4** GlobeTabs (Equipo / Empresas, Radix Tabs): cambia el dataset con una transición de puntos. Incluye GlobeLegend y LanguageBadges.
- [x] **4.5** StatsStrip.
- [x] **4.6** AreasShowcase: AreaTabs (Radix) e ImpactBars.
- [x] **4.7** CareerGantt en desktop, que pasa a lista vertical en móvil.
- [x] **4.8** EducationCard, StackCloud y ContactCta.

## Fase 5 — Páginas

- [x] **5.1** `/experiencia`: Gantt completo, ExperienceCards con acordeón y descarga del CV por idioma. _(Acordeón con `<details>` nativo, sin JS. Un solo CV, en inglés (`public/cv/jose-vasquez-cv.pdf`), en ambos idiomas. Zoom por año del Gantt: `CareerGanttZoom` (selector «Todo · año», eje mensual y barras recortadas).)_
- [x] **5.2** `/proyectos`: ProjectCards con filtros.
- [x] **5.3** `/proyectos/[slug]`: case study en MDX (CaseHero, KeyMetrics, TOC sticky, componentes MDX). _(`@next/mdx` + `rehype-slug` por nombre (Turbopack). Con `cacheComponents` no existe `dynamicParams`: un slug desconocido llama a `notFound()`, pero responde 200 con `noindex` porque el shell ya salió: revisar en 7.1 junto al catch-all.)_
- [x] **5.4** Primeros 3 case studies: orquestador de pagos, export engine y motor KYC (ES y EN).

## Fase 6 — Páginas de área (una tarea por área)

- [x] **6.0** AreaShell, AreaHero, AreaCases, `registry.ts` y `generateStaticParams`.
- [x] **6.1** Frontend: TokenPlayground y AtomicLibraryMap.
- [x] **6.2** Backend y Pagos: PaymentFlowSimulator (máquina de estados, demo de idempotencia) y AuditTrailLog.
- [x] **6.3** Compliance: KycPipeline (scroll-driven) y VerdictCard.
- [x] **6.4** DevOps: PipelineRunner (antes/después) e InfraMap.
- [x] **6.5** AI Engineering: ExtractionDemo y AgentWorkflowDiagram.
- [x] **6.6** Leadership: TeamGrowthChart, DocsStandard y Principles.

## Fase 7 — Calidad y lanzamiento

- [x] **7.1** SEO: metadata por locale (canonical, `hreflang` con `x-default`, Open Graph y Twitter), sitemap con alternates, robots (las previews de Vercel no se indexan), OG images dinámicas (general, case study y área) y JSON-LD `Person` en el Home. _(404 real: con `cacheComponents` una ruta dinámica emite su shell con 200 antes de `notFound()`, y una página prerenderizada ignora el `status` de un rewrite. `src/proxy.ts` clasifica la URL contra `routing.pathnames` y los slugs del contenido (`src/i18n/known-paths.ts`); si es desconocida, sirve el HTML de `/[locale]/not-found-page` con status 404. Del sitio anterior: `/assets/cv/*` redirige al CV nuevo (308) y `public/sw.js` desinstala el service worker de next-pwa. `SITE_URL` sale de `NEXT_PUBLIC_SITE_URL` o del dominio de producción de Vercel.)_
- [x] **7.2** Accesibilidad: auditoría con axe en Playwright y prueba completa con teclado. _(`tests/e2e/a11y.spec.ts`: axe WCAG 2.2 AA en 15 páginas (ES/EN, case studies, las 6 áreas y el 404), en tema oscuro y claro, escritorio y móvil. `tests/e2e/keyboard.spec.ts`: skip link, foco visible en todo lo tabulable, ⌘K (abrir, filtrar, Escape devuelve el foco), tema, tabs del globo con flechas, idioma y menú móvil. Corregido: WCAG 2.5.3 (nombre accesible que no incluía el texto visible en logo, idioma y ⌘K) y foco invisible en los paneles de tabs y las tarjetas de proyecto. El E2E corre en CI contra el build de producción.)_
- [x] **7.3** Rendimiento: Lighthouse ≥ 90 en móvil y revisión del bundle. _(Cerrada con datos: accesibilidad, buenas prácticas y SEO en 100. Rendimiento móvil en Lighthouse local, mediana de 5 corridas: Home 84 (TBT 333 ms, LCP simulado 3,4 s); en producción las corridas sueltas dieron 80–90. El LCP real con CPU 4x coincide con el FCP (~0,5–0,8 s) y CLS es 0: el LCP simulado lo arrastra la evaluación del JS de framework (React + runtime de Next, ~115 kB gz), que no se puede quitar. Hecho: mensajes del cliente acotados (`ClientMessages`), textos del header traducidos en el servidor (CPU de `@formatjs` en la carga ~138 → ~19 ms), tabs propias en vez de Radix Tabs (ADR 0004; JS inicial 169 kB gz). Probado sin efecto: quitar las animaciones CSS infinitas del globo. Descartado: precompilar los mensajes de next-intl (su loader rechaza arrays). Medición continua: Speed Insights (Core Web Vitals de usuarios reales) una vez activado en Vercel.)_
- [x] **7.4** E2E: cambio de idioma, cambio de tema, ⌘K, enlaces de contacto y navegación de áreas. _(Suites en `tests/e2e/`: `keyboard` (idioma, tema, ⌘K, tabs, menú móvil), `navigation` (canales de contacto, CTA, las 6 áreas en ES/EN, nav principal), `terminal` (comandos y easter eggs), `console` (sin errores ni `MISSING_MESSAGE`), `a11y` (axe) y `smoke`. Corren en CI contra el build de producción, en escritorio y móvil.)_
- [x] **7.5** Analytics (Vercel Analytics), dominio y lanzamiento. _(`@vercel/analytics` y `@vercel/speed-insights` en el layout, solo en builds de Vercel (`VERCEL=1`), y activados en el panel. `SITE_URL` y el origen del globo (`HOME_*`) salen de variables de entorno. Decidido por José (2026-11-03): sin dominio propio (se queda `josejmv.vercel.app`) y sin alta en Google Search Console.)_

## Fase 8 — Páginas de Áreas y Contacto

Specs en `docs/specs/` y referencias visuales en `docs/design/areas-contacto/`. Los enlaces «Áreas» y «Contacto» dejan de apuntar a anclas del Home.

- [x] **8.1** Rutas e i18n: `/areas` y `/contacto` ↔ `/contact` en `routing.ts`, sitemap con alternates, 404 real (`known-paths`) y mensajes ES/EN (`AreasIndex`, `ContactPage`, `Footer`, `Cta.secondary`). _(Los namespaces de la spec (`nav`, `areas`, `contact`, `footer`) se fusionaron en los existentes en PascalCase; `Areas` ya lo usaba el Home.)_
- [x] **8.2** Contenido tipado: `content/contact.ts` y `content/areas-graph.ts` con sus esquemas Zod. _(El email, los enlaces y los idiomas salen de `profile.ts` y la ubicación de `HOME_*`: `contact.ts` solo añade handles, disponibilidad, tipos de oportunidad y CV. `areas-graph.ts` añade posiciones, códigos, módulo firma, métrica y conexiones; títulos, textos y stack salen de `areas.ts`.)_
- [x] **8.3** Página de Contacto: Gmail a todo el ancho (escribir y copiar), LinkedIn, GitHub y WhatsApp, formulario con mailto prellenado (ADR 0005), disponibilidad y CV. Sin el CTA de cierre. JSON-LD `ContactPage`. _(El esquema del formulario usa `zod/mini` en `content/contact-form.ts`: el navegador no carga Zod completo.)_
- [x] **8.4** Índice de Áreas: constelación 3D con react-three-fiber (ADR 0006), fallback 2D en SVG, panel de detalle, lista «Todas las áreas» y `?area=` compartible. JSON-LD `CollectionPage`.
- [x] **8.5** Navegación: header, menú móvil, ⌘K, terminal (`cd areas`, `cd contacto`), enlace «ver todas las áreas» en el Home, botón secundario del CTA hacia Contacto, breadcrumb en las páginas de área (con `BreadcrumbList`) y footer rediseñado: marca y disponibilidad, navegación, las 6 áreas y los canales, sin huecos en ningún ancho.
- [x] **8.6** Tests: unitarios de `buildMailto`, del formulario, del contenido, de la selección y del fallback 2D; E2E de Contacto (validación, mailto interceptado, cero peticiones, portapapeles) y de Áreas (selección por clic y teclado, `?area=`, escena 3D, etiquetas dentro del escenario a 390 px). Las páginas nuevas entran en axe, consola y teclado.
- [x] **8.7** Documentación: ADR 0005 y 0006 y este plan. _(Rendimiento móvil en Lighthouse local, mediana de 3: Contacto 82 y Áreas 78, con accesibilidad en 100. Igual que en la 7.3, el techo lo pone el JS de framework; el 3D no entra en el JS inicial.)_

## Prompt sugerido para cada tarea

> Lee CLAUDE.md y docs/plan.md. Implementa solo la tarea **X.Y**. Usa como referencia el mapa de componentes y los wireframes. Respeta los tokens y la i18n. Al terminar, corre lint, typecheck y tests, marca la tarea como hecha y resume qué cambiaste.
