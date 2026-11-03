# ADR 0006 — Índice de Áreas como constelación 3D

**Estado:** Aceptado · 2026-11-03

## Contexto

Las secciones «Áreas» y «Contacto» del header llevaban a anclas del Home y pasan a tener páginas dedicadas. Para el índice de Áreas se evaluaron tres formatos:

- grid con radar,
- **constelación 3D**,
- lista editorial.

Se eligió la constelación porque comunica que las áreas **se conectan entre sí** a través de proyectos reales, y eso un grid no lo cuenta.

## Decisión

- **Escena:** react-three-fiber y drei (ya en el stack de CLAUDE.md): núcleo «JMV», 6 nodos y 7 conexiones etiquetadas con el proyecto que comparten. Se carga con `next/dynamic` y `ssr: false`, y el `frameloop` pasa a demanda fuera del viewport o con la pestaña oculta.
- **Fallback 2D obligatorio:** un SVG con botones, renderizado en el servidor. Es lo que se ve al cargar, y se queda:
  - con `prefers-reduced-motion`;
  - sin WebGL o con WebGL **por software** (SwiftShader, llvmpipe…), porque ahí cada frame se dibuja en la CPU y bloquea el hilo principal;
  - si el chunk 3D falla (error boundary).
- **Cuándo se monta el 3D:** con puntero fino (ratón), en tiempo ocioso tras la carga. En pantallas táctiles, con el primer toque o foco en el escenario. Así, en un móvil el arranque no paga el coste de three.js, y el 2D ya es una constelación completa.
- **Etiquetas:** DOM normal encima del lienzo, proyectadas en un único `useFrame`. Se descartó `<Html>` de drei: crea una raíz de React por etiqueta (unas 20) y cada una se reposiciona por su cuenta en cada frame. Medido con Lighthouse móvil, el TBT bajó de ~5 s a ~0,5 s.
- **Accesibilidad:** la escena lleva `aria-hidden`. La selección accesible es un `radiogroup` (los botones del 2D, o radios ocultos con la escena 3D) con flechas, y el escenario pinta el foco. Debajo hay **siempre** una lista de 6 tarjetas renderizadas en el servidor: es la vía rápida para reclutadores, para SEO y para lectores de pantalla.
- **Selección compartible:** `?area=<slug>`, actualizada con `history.replaceState` (sin scroll ni petición al servidor).

## Consecuencias

- El JS inicial de `/areas` es el mismo que el del Home (~174 kB). La escena 3D (~256 kB) solo se descarga cuando se va a montar.
- Los E2E de CI corren en un Chromium con WebGL por software, donde la página se queda en 2D. Para probar el 3D, fuerzan la escena con la clave `constellation:3d` de `localStorage` (`FORCE_3D_KEY`).
- El copy de la escena (nombres de los nodos y de las conexiones) vive en `content/areas-graph.ts` y `content/areas.ts`, no en la escena.
