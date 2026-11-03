# Spec: página índice de Áreas (constelación 3D)

- **Ruta:** `app/[locale]/areas/page.tsx`, con pathname localizado `es: /areas`, `en: /areas`. Las páginas hijas `/areas/[slug]` ya existen.
- **Referencias visuales:**
  - `docs/design/screens/areas-desktop.png` (estado inicial, con Backend & Pagos seleccionado)
  - `docs/design/screens/areas-nodo-seleccionado.png` (con Compliance seleccionado)
  - `docs/design/screens/areas-movil.png`
- **Fuente:** `docs/design/source/Areas.dc.html`
- **Datos:** `content/areas-graph.ts`, más los datos de áreas que ya existen. Textos: `messages/areas-contact.{es,en}.json`, namespace `areas`.

## 1. Estructura

```
<SiteHeader active="areas" />
<main>
  <AreasHero />                              Server
  <section class="flex wrap gap-20">
    <ConstellationStage>                     Client, flex 999 1 560px, min-height 600px
      <ConstellationScene3D />               dynamic(ssr:false), react-three-fiber
      <ConstellationFallback2D />            SVG + botones; se usa con reduced-motion o sin WebGL
    </ConstellationStage>
    <AreaDetailPanel />                      Client, flex 1 1 320px, aria-live="polite"
  </section>
  <AreasList />                              Server: 6 tarjetas <a> hacia /areas/[slug]
</main>
<SiteFooter />
```

- **Componentes**, en `src/components/areas/index/`:
  - `areas-hero.tsx`
  - `constellation-stage.tsx`
  - `constellation-scene-3d.tsx`
  - `constellation-fallback-2d.tsx`
  - `area-detail-panel.tsx`
  - `areas-list.tsx`
  - `use-area-selection.ts`
- **Estado compartido:** `selectedId`. El valor inicial es `backend-pagos`, o el slug que venga en `?area=` si es válido.
  - Al seleccionar un área, se actualiza la query con `router.replace`, sin scroll, para que la selección se pueda compartir con un enlace.

## 2. Hero

- Eyebrow `áreas`.
- H1 en Sora 600, `clamp(40px, 6vw, 60px)`, con el degradado en la segunda parte: "Seis áreas, **un mismo criterio**". EN: "Six areas, **one standard**".
- Lead: "Cada nodo es un área y cada línea, un proyecto que las cruza. Elige un nodo para ver qué hice ahí, con qué métrica y dónde se conecta con lo demás."

## 3. Constelación

### 3.1 Datos (`content/areas-graph.ts`)

- **Nodos:** `id` (el slug existente), `code` (FE, BE, KYC, OPS, AI, LD), `position3d: [x, y, z]`, `position2d: { x, y }` en un viewBox de 1000×600, y `depth` para la escala del fallback.
- **Conexiones:** `[from, to, labelKey]`, 7 en total. La etiqueta es el proyecto que comparten las dos áreas:

| De | A | Etiqueta ES | Etiqueta EN |
|---|---|---|---|
| frontend | backend-pagos | Sitio de pagos (Next.js) | Payments site (Next.js) |
| backend-pagos | devops | Gate de CI | CI gate |
| backend-pagos | compliance | Motor KYC (FastAPI) | KYC engine (FastAPI) |
| compliance | ai-engineering | Extracción con Bedrock | Extraction with Bedrock |
| ai-engineering | leadership | Workflow con Claude Code | Claude Code workflow |
| leadership | frontend | Estándar de documentación | Documentation standard |
| frontend | devops | Suite de tests −30% | Test suite −30% |

### 3.2 Escena 3D (react-three-fiber + drei)

- **Canvas:**
  - Fondo transparente sobre el contenedor, que lleva `radial-gradient(circle at 50% 50%, #121A2A, #0B0F18 70%)`, radio 28px y borde `rgba(255,255,255,0.07)`.
  - Cámara en perspectiva, fov 45, posición `[0, 1.2, 9]`.
  - `dpr={[1, 1.5]}`.
- **Núcleo "JMV":** esfera de radio 0,55 con `meshStandardMaterial`.
  - Color `#D4BF8E`, metalness 0,4 y roughness 0,35.
  - Glow con un sprite aditivo y el texto "JMV" en `<Html>` o `<Text>`.
- **Nodos (6):**
  - Esferas de radio 0,32.
  - Inactivos: azul `#5F7FA3`, con emissive tenue `#8FB8DE` a 0,15.
  - Activo: champagne `#D4BF8E`, escala 1,15 y halo.
  - Cada nodo lleva una etiqueta pill con el nombre del área (`<Html>`, con `pointer-events` desactivado en la etiqueta).
- **Conexiones:**
  - `<Line>` de drei, punteadas (dashed) y con un dash offset animado.
  - Inactivas: `#8FB8DE` con opacidad 0,3. Conectadas al nodo activo: `#D4BF8E`, opacidad 0,95 y ancho ×2.
  - La etiqueta de una conexión solo aparece cuando la conexión está activa.
- **Rayos al núcleo:** líneas finas `rgba(255,255,255,0.08)` desde cada nodo.
- **Anillos:** dos `torus`/`ring` inclinados unos 72°.
  - Uno champagne con opacidad 0,25 y periodo de 40 s.
  - Otro azul punteado con opacidad 0,18 y periodo de 70 s.
  - Ambos rotan despacio.
- **Estrellas:** `<Points>` con unas 150 partículas, con titileo suave.
- **Movimiento:**
  - El grupo entero rota en Y unos ±12° en un ciclo de 30 s.
  - Cada nodo flota en Y ±0,08, con un desfase por índice.
  - Al arrastrar se puede orbitar con límites: sin zoom ni pan, y con un ángulo polar acotado.
- **Interacción:**
  - Hover: el cursor cambia a pointer y la etiqueta se ilumina.
  - Clic o tap: selecciona el nodo.
  - La cámara hace un pequeño dolly hacia el nodo, de 0,4 s con easing.
- **Rendimiento:**
  - El frameloop pasa a `demand` cuando el canvas está fuera del viewport (IntersectionObserver) o la pestaña está oculta.
  - Nada de postprocessing pesado.
  - El chunk se carga de forma diferida y no bloquea el LCP. El H1 es el LCP.

### 3.3 Fallback 2D (obligatorio)

Se usa cuando:

- hay `prefers-reduced-motion: reduce`,
- no hay WebGL,
- o el chunk 3D falla al cargar (error boundary).

Cómo es:

- Un SVG con viewBox 1000×600 y `preserveAspectRatio="none"` para las líneas, igual que el prototype.
- Los nodos son `<button>` con posición absoluta en porcentaje, sobre el SVG.
- Usa las mismas reglas de color y de etiquetas que la escena 3D.

### 3.4 Accesibilidad de la escena

- La escena 3D lleva `aria-hidden="true"`. La interacción accesible ocurre en una capa paralela.
- Un `role="radiogroup"` con `aria-label="Áreas"` contiene 6 `role="radio"`, visualmente ocultos pero enfocables, o directamente los botones del fallback.
  - Las flechas ←/→ (y ↑/↓) mueven la selección.
  - Enter o Space confirma.
  - Tab sale del grupo.
- Al cambiar la selección, el panel lo anuncia en `aria-live="polite"`.
- La lista "Todas las áreas" es la ruta principal para lectores de pantalla.

### 3.5 Móvil (menos de 640px)

- El escenario ocupa el ancho completo con `aspect-ratio: 4/5`, unos 520px de alto como mínimo.
- En el fallback, las posiciones 2D se recalculan a una disposición más compacta: ningún nodo ni etiqueta sale del contenedor. En el prototipo, la etiqueta de Compliance se corta: hay que corregirlo.
- En 3D, la cámara se aleja (z ≈ 11) y las etiquetas usan la versión corta: el `code`, más el nombre solo en el nodo activo.
- El panel de detalle baja debajo de la escena.

## 4. Panel de detalle (`AreaDetailPanel`)

- **Contenedor:** fondo `--surface`, borde `rgba(212,191,142,0.2)`, radio 28px y padding 28px.
- **Contenido**, en orden:
  1. Eyebrow mono en `--accent-text`: `◆ {módulo firma}`. Por ejemplo `PaymentFlowSimulator`, `KycPipeline`, etc.
  2. Titular H2 en Sora 600, 26px. Es el H1 de la página de área.
  3. Texto descriptivo del área, en 14px y `--text-2`.
  4. Una métrica estrella dentro de una tarjeta `--surface-2`: el valor en Sora 30px `--accent-text` y la etiqueta en 13px `--muted`.
  5. "se conecta con": una lista con `{área vecina} · {etiqueta de la conexión}` por cada conexión del nodo.
  6. Chips de stack, entre 3 y 4.
  7. CTA a ancho completo, que lleva a `/areas/{slug}`: "Explorar {área} →".
- **Transición** al cambiar de área: crossfade de 150 ms, que se desactiva con reduced-motion.

Métricas por área (las mismas que ya muestran las páginas de área):

| Área | Métrica | Etiqueta |
|---|---|---|
| Frontend | −30% | suite de tests (255 s → 178 s) |
| Backend & Pagos | −98.8% | paginación por cursor (300k filas) |
| Compliance AML/KYC | 224 | commits de código en 8 semanas |
| DevOps | −97% | guardado de caché en CI (1:36 → 0:03) |
| AI Engineering | 403 | commits pareados con IA en 4 repositorios |
| Leadership | 63 | features con el estándar RFC → ADR |

## 5. Lista "Todas las áreas"

- Título H2: "Todas las áreas".
- La grilla es `repeat(auto-fit, minmax(min(100%, 340px), 1fr))`, gap 14px.
- Cada tarjeta es un `<a>` completo hacia `/areas/[slug]` y contiene:
  - `0N · {área}` en mono 12px;
  - el titular en Sora 19px;
  - la métrica en negrita `--accent-text` más su etiqueta;
  - "Ver área →".
- En hover: el borde pasa a `rgba(212,191,142,0.3)` y la tarjeta sube 2px. Con reduced-motion, solo cambia el borde.

## 6. SEO

- `title`: "Áreas · José M. Vasquez". `description`: el lead del hero.
- JSON-LD `CollectionPage`, con un `ItemList` de las 6 áreas y su URL.
- La lista de tarjetas se renderiza en servidor, así que el contenido es indexable aunque la escena 3D cargue en el cliente.

## 7. Tests

**Unit:**

- `use-area-selection`: el valor inicial, `?area=` válido e inválido, y el avance con las flechas.
- Helper de conexiones: devuelve los vecinos correctos de cada nodo.

**E2E:**

- `/es/areas` carga con Backend & Pagos seleccionado.
- Al pulsar el nodo "Compliance", el panel muestra "AML/KYC automatizado (art. 492)" y la URL lleva `?area=compliance`.
- Con las flechas del teclado, la selección cambia.
- "Explorar … →" lleva a `/es/areas/compliance`.
- Con `reducedMotion: 'reduce'` aparece el fallback 2D y no se monta el canvas.
- A 390px no hay overflow horizontal y ninguna etiqueta queda recortada. Comprueba el bounding box de cada etiqueta contra el escenario.
- axe sin violaciones serias.

## 8. Criterios de aceptación

- [ ] La página responde 200 en ES y EN. El header marca "Áreas" como activo en `/areas` y en `/areas/[slug]`.
- [ ] Sin JS o sin WebGL, la página sigue siendo útil gracias a la lista de tarjetas y al fallback.
- [ ] El chunk 3D no entra en el JS inicial. Verifícalo con el bundle analyzer.
- [ ] 60 fps en un portátil medio. En móvil, el frameloop baja a demanda fuera del viewport.
