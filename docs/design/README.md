# Diseño — guía de handoff

Copia el contenido de este zip en la raíz del repo. Claude Code puede leer las imágenes de `screens/` como referencia visual.

## Qué hay aquí

| Archivo                                       | Qué es                                                         | Uso en Claude Code                                    |
| --------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| `screens/Fusion.png`                          | **Diseño final del Home (oscuro)**: A + C v1                   | Referencia visual principal                           |
| `screens/Palette.png`                         | Tabla de tokens oscuro/claro y Home en claro                   | Tema claro y contrastes                               |
| `screens/Components.png`                      | Mapa de componentes del Home (nombre y archivo de cada bloque) | Tareas de las fases 3 y 4                             |
| `screens/Pages.png`                           | Wireframes: Experiencia, Proyectos, Case study, móvil          | Fase 5                                                |
| `screens/Areas.png`                           | Wireframes de las 6 páginas de área con su módulo firma        | Fase 6                                                |
| `screens/Architecture.png`                    | Árbol de archivos y flujo de datos                             | Fase 1 y estructura                                   |
| `screens/Main.png`, `Ivory.png`, `Aurora.png` | Propuestas exploratorias A, B y C (descartadas, solo contexto) | —                                                     |
| `source/*.dc.html`                            | Markup fuente de cada diseño, con estilos inline               | Medidas exactas, espaciados, SVG de iconos y gráficas |
| `source/canvas.json`                          | Índice del lienzo                                              | —                                                     |
| `assets/globe-dark.svg`, `globe-light.svg`    | Globo de puntos estático                                       | Fallback `GlobeStaticSvg`                             |

## Notas sobre los archivos fuente

- Son formato de lienzo, no React. `{{accent}}` = `#D4BF8E` en Fusion/Main, `#2B4ACB` en Ivory y `#4FD1C5` en Aurora.
- `/_blob/e5c9…` es `assets/globe-dark.svg` y `/_blob/aefb…` es `assets/globe-light.svg`.
- Los arcos y marcadores del SVG del globo están calculados con una proyección ortográfica centrada en lon −35°, lat 18°. En la versión real, react-globe.gl los calcula solo.
- Las capturas usan fuentes de reemplazo: los títulos deben ir en **Sora**, el texto en **Inter** y los detalles en **JetBrains Mono**.

## Decisiones cerradas

- Contacto: Gmail es el CTA primario. LinkedIn, GitHub y WhatsApp van como secundarios.
- Globo: react-globe.gl con tabs Equipo/Empresas (`docs/adr/0001`, `0003`, `content/countries.ts`).
- Paleta clara: `src/app/globals.css`.
- PSE, Bre-B, AWS Bedrock, Jira y DigitalOcean se pueden mencionar.
- Áreas: cada una tiene un diseño propio (shell común + módulo firma).

## Pendiente

- Confirmar la sede de Inlaze (se asumió Colombia).
- ~~ADR 0002: motion o solo CSS.~~ Decidido: híbrido (`docs/adr/0002-animations.md`).
