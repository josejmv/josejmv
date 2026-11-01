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
- [ ] **1.4** next-themes: ThemeProvider y ThemeToggle, sin parpadeo al cargar.
- [ ] **1.5** CI (GitHub Actions): lint, typecheck, test y build. Proyecto en Vercel con previews por PR.

## Fase 2 — Contenido

- [ ] **2.1** `content/schema.ts` con los esquemas Zod: Profile, ContactLink, Experience, Area, Country, Stat, Education y StackItem, con campos localizados `{ es, en }`.
- [ ] **2.2** Pasar el CV a `content/*.ts`: experiencia, áreas, métricas, formación y stack.
- [x] **2.3** `content/countries.ts`: 12 nacionalidades del equipo y 4 países de empresas (ya incluido; falta confirmar la sede de Inlaze).
- [ ] **2.4** `lib/content.ts`: getters server-only por locale, más un test que valide todo el contenido.

## Fase 3 — Layout y UI base

- [ ] **3.1** Primitivas en `ui/`: Button, Chip, StatCard, GradientText, AvailabilityBadge y AnimatedCounter.
- [ ] **3.2** Fondos: GridBackground y GlowOrbs.
- [ ] **3.3** SiteHeader (MainNav, LocaleSwitcher, ThemeToggle), MobileMenu (Sheet) y SiteFooter.
- [ ] **3.4** CommandMenu (⌘K) con cmdk: navegar a secciones, áreas y proyectos, cambiar idioma y tema, y copiar el email.

## Fase 4 — Home

- [ ] **4.1** HeroSection y ContactTerminal (con efecto de escritura, Gmail como primario).
- [ ] **4.2** GlobeStaticSvg como fallback, a partir del SVG del lienzo.
- [ ] **4.3** CollaborationGlobe con react-globe.gl: arcos desde Colombia, marcadores con tooltip, pausa fuera del viewport y reduced-motion.
- [ ] **4.4** GlobeTabs (Equipo / Empresas, Radix Tabs): cambia el dataset con una transición de puntos. Incluye GlobeLegend y LanguageBadges.
- [ ] **4.5** StatsStrip.
- [ ] **4.6** AreasShowcase: AreaTabs (Radix) e ImpactBars.
- [ ] **4.7** CareerGantt en desktop, que pasa a lista vertical en móvil.
- [ ] **4.8** EducationCard, StackCloud y ContactCta.

## Fase 5 — Páginas

- [ ] **5.1** `/experiencia`: Gantt completo, ExperienceCards con acordeón y descarga del CV por idioma.
- [ ] **5.2** `/proyectos`: ProjectCards con filtros.
- [ ] **5.3** `/proyectos/[slug]`: case study en MDX (CaseHero, KeyMetrics, TOC sticky, componentes MDX).
- [ ] **5.4** Primeros 3 case studies: orquestador de pagos, export engine y motor KYC (ES y EN).

## Fase 6 — Páginas de área (una tarea por área)

- [ ] **6.0** AreaShell, AreaHero, AreaCases, `registry.ts` y `generateStaticParams`.
- [ ] **6.1** Frontend: TokenPlayground y AtomicLibraryMap.
- [ ] **6.2** Backend y Pagos: PaymentFlowSimulator (máquina de estados, demo de idempotencia) y AuditTrailLog.
- [ ] **6.3** Compliance: KycPipeline (scroll-driven) y VerdictCard.
- [ ] **6.4** DevOps: PipelineRunner (antes/después) e InfraMap.
- [ ] **6.5** AI Engineering: ExtractionDemo y AgentWorkflowDiagram.
- [ ] **6.6** Leadership: TeamGrowthChart, DocsStandard y Principles.

## Fase 7 — Calidad y lanzamiento

- [ ] **7.1** SEO: metadata por locale, `hreflang`, sitemap, robots, OG images dinámicas y JSON-LD `Person`.
- [ ] **7.2** Accesibilidad: auditoría con axe en Playwright y prueba completa con teclado.
- [ ] **7.3** Rendimiento: Lighthouse ≥ 90 en móvil y revisión del bundle.
- [ ] **7.4** E2E: cambio de idioma, cambio de tema, ⌘K, enlaces de contacto y navegación de áreas.
- [ ] **7.5** Analytics (Vercel Analytics), dominio y lanzamiento.

## Prompt sugerido para cada tarea

> Lee CLAUDE.md y docs/plan.md. Implementa solo la tarea **X.Y**. Usa como referencia el mapa de componentes y los wireframes. Respeta los tokens y la i18n. Al terminar, corre lint, typecheck y tests, marca la tarea como hecha y resume qué cambiaste.
