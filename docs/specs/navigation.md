# Spec: rutas, i18n y navegación

## 1. Rutas nuevas (next-intl `pathnames`)

```ts
// src/i18n/routing.ts (añadir a lo existente)
pathnames: {
  // …existentes: '/', '/experiencia', '/proyectos', '/proyectos/[slug]', '/areas/[slug]'
  '/areas':    { es: '/areas',    en: '/areas' },
  '/contacto': { es: '/contacto', en: '/contact' },
}
```

- Crea las páginas `app/[locale]/areas/page.tsx` y `app/[locale]/contacto/page.tsx`. Ambas son estáticas, con `generateStaticParams` para los dos locales.
- Si `app/[locale]/areas/[slug]` ya existe, la carpeta `areas/` pasa a tener también un `page.tsx`, y no hay conflicto.
- `sitemap.ts`: añade `/areas` y `/contacto` en los dos idiomas, con `alternates.languages`.
- El switch ES/EN del header debe llevar a la ruta equivalente: `/es/contacto` ↔ `/en/contact`.

## 2. Header (`site-header.tsx` / `main-nav.tsx`)

- **Áreas:** `href="/areas"`, con el `<Link>` de next-intl. Queda activo cuando el pathname empieza por `/areas`.
- **Contacto:** `href="/contacto"`. Queda activo en `/contacto`.
- Quita los enlaces a `/#areas` y `/#contacto`. Los ids `areas` y `contacto` del Home se pueden conservar para enlaces internos, pero el menú ya no los usa.
- **Estado activo:** el link activo usa color `--text` y `aria-current="page"`. Los demás usan `--muted`.
- El menú móvil (Sheet) sigue las mismas reglas.

## 3. Command palette (⌘K)

Añade estas entradas al grupo "Navegar":

- "Áreas": `/areas`, con keywords `areas, skills, habilidades, constelación`.
- "Contacto": `/contacto`, con keywords `contacto, email, gmail, whatsapp, contratar`.

Al grupo "Acciones", añade "Copiar email": copia `josejmvasquez@gmail.com` y muestra un toast.

## 4. Home

- En la sección "Áreas de dominio", a la derecha del título, añade el enlace mono 12px "ver todas las áreas →", que lleva a `/areas`.
- Los enlaces "Ver casos de X →" no cambian: siguen yendo a `/areas/[slug]`.

## 5. Footer (`site-footer.tsx`)

- Prop nueva: `showCta?: boolean` (por defecto `true`). La página de Contacto pasa `false`.
- **CTA:**
  - Botón principal: "Escríbeme a Gmail", hacia `mailto:josejmvasquez@gmail.com`.
  - Botón secundario nuevo, con outline: "Ver todas las vías de contacto", hacia `/contacto`.
- **Barra inferior:**
  - Izquierda: `© {año} José M. Vasquez · Cajicá, Colombia`.
  - Derecha: Experiencia · Áreas · Proyectos · Contacto · LinkedIn · GitHub.

## 6. Páginas de área

- En el eyebrow `área · {X}`, el texto "áreas" pasa a ser un enlace a `/areas`, a modo de breadcrumb.
- Opcional: añade un JSON-LD `BreadcrumbList` con Inicio → Áreas → {X}.

## 7. Textos

`messages/areas-contact.{es,en}.json` trae los namespaces `nav`, `areas`, `contact` y `footer`, con solo las claves nuevas. Fusiónalos en los archivos de mensajes que ya existen sin pisar claves actuales. Si una clave ya existe con otro texto, pregunta.
