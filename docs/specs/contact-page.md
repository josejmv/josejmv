# Spec: página de Contacto

- **Ruta:** `app/[locale]/contacto/page.tsx`, con pathname localizado `es: /contacto`, `en: /contact`.
- **Referencias visuales:**
  - `docs/design/screens/contacto-desktop.png`
  - `docs/design/screens/contacto-error-validacion.png`
  - `docs/design/screens/contacto-enviado.png`
  - `docs/design/screens/contacto-movil.png`
- **Fuente:** `docs/design/source/Contact.dc.html`
- **Datos:** `content/contact.ts`. Textos: `messages/areas-contact.{es,en}.json`, namespace `contact`.

## 1. Estructura

```
<SiteHeader active="contact" />
<main>
  <ContactHero />                 Server
  <ContactChannels />             Server + <CopyEmailButton> (client)
  <section class="flex wrap">
    <ContactForm />               Client, flex 999 1 560px
    <aside>
      <AvailabilityCard />        Server
      <CvCard />                  Server
    </aside>                      flex 1 1 320px
  </section>
</main>
<SiteFooter showCta={false} />
```

Componentes sugeridos, en `src/components/contact/`:

- `contact-hero.tsx`
- `contact-channels.tsx`
- `copy-email-button.tsx`
- `contact-form.tsx`
- `build-mailto.ts` (función pura, con test)
- `availability-card.tsx`
- `cv-card.tsx`

## 2. Secciones

### 2.1 ContactHero

- Eyebrow mono, 13px, `--muted`: `contacto`.
- H1 en Sora 600, `clamp(44px, 7vw, 68px)`, letter-spacing −1.6px, line-height 1. La segunda mitad del título usa un degradado `--accent` → `--accent-2` con `background-clip: text`.
  - ES: "Hablemos de lo **que quieres construir**".
  - EN: "Let's talk about **what you want to build**".
- Lead: 17px, `--muted`, max-width 760px.

### 2.2 ContactChannels

- La grilla es `repeat(auto-fit, minmax(min(100%, 250px), 1fr))`, gap 14px.
- **Gmail ocupa toda la fila** (`grid-column: 1 / -1`):
  - Fondo: degradado champagne/azul suave, con borde `rgba(212,191,142,0.3)`.
  - Ícono: cuadrado de 56px con fondo `--accent`.
  - Eyebrow: `vía principal · Gmail`.
  - Email en Sora 600, `clamp(18px, 3vw, 26px)`, con `overflow-wrap: anywhere`.
  - Acción **Escribir un correo**: `<a href="mailto:josejmvasquez@gmail.com">`, pill de fondo `--accent`.
  - Acción **Copiar email**: `<button>` que llama a `navigator.clipboard.writeText`.
    - Durante 1,8 s el texto cambia a "¡Copiado!" y se anuncia en una región `aria-live="polite"`.
    - Si el clipboard falla, selecciona el texto del email y muestra "Copia manualmente".
- **LinkedIn, GitHub y WhatsApp** son tarjetas `<a>` completas: ícono de 44px, nombre, handle en mono y una descripción de una línea.
  - Usa `target="_blank" rel="noopener noreferrer"` para los enlaces externos.
  - Ningún enlace lleva datos personales en la query.

### 2.3 ContactForm (client)

**Campos.** Cada uno con `<label>` real y `name`/`autocomplete`:

| name | tipo | requerido | autocomplete | validación |
|---|---|---|---|---|
| `name` | text | sí | `name` | trim, 2–80 caracteres |
| `email` | email | sí | `email` | Zod `.email()` |
| `company` | text | no | `organization` | máximo 80 |
| `type` | select | sí (default `empleo`) | — | enum `empleo` · `contrato` · `consultoria` · `otro` |
| `message` | textarea, 6 filas, resize vertical | sí | — | trim, 10–2000 caracteres |

Las etiquetas del select vienen de `content/contact.ts` → `opportunityTypes`.

**Envío (ADR 0004: sin terceros).**

1. Al pulsar **Enviar mensaje**, valida con Zod (`contactFormSchema` en `content/schema.ts`).
2. Si es inválido:
   - Muestra un bloque `role="alert"` con el mensaje general.
   - Marca cada campo con `aria-invalid` y su error en `aria-describedby`.
   - Mueve el foco al primer campo con error.
3. Si es válido:
   - Arma la URL con `buildMailto(values, locale)`:
     - **to:** `josejmvasquez@gmail.com`.
     - **subject:** `Portafolio · {tipo} · {nombre}`. En EN: `Portfolio · {type} · {name}`.
     - **body:** `{mensaje}\n\n—\n{nombre}\n{email}` y, si existe, `\n{empresa}`.
     - Usa `encodeURIComponent` en `subject` y `body`, y recorta la URL total a unos 1.800 caracteres, recortando el mensaje con "…".
   - Ejecuta `window.location.href = mailtoUrl`, no `window.open`, para que funcione en móvil y no lo bloquee el bloqueador de popups.
   - Cambia al estado **enviado**.
4. **Estado enviado** (`role="status"`, con el foco en el título):
   - Ícono de check verde.
   - Título: "Listo, {nombre}. Tu correo ya está redactado."
   - Texto: "Se abrió tu app de correo con el mensaje para josejmvasquez@gmail.com: solo falta pulsar Enviar. ¿No se abrió? [Ábrelo aquí](mailtoUrl) o copia el email de arriba."
   - Botón **Escribir otro mensaje**, que limpia el formulario y vuelve al estado inicial.
5. El formulario no guarda nada en el servidor, no hace `fetch` y no usa cookies.
6. Persistir el borrador en `sessionStorage` es opcional. Si se hace, el acceso va en `try/catch`.

**Microcopy**, en mono 11px, junto al botón: "sin servicios de terceros · se envía desde tu correo".
**Intro:** "Al enviar se abre tu app de correo con el mensaje listo para josejmvasquez@gmail.com. Los campos con * son obligatorios."

**Estilos.**

- Inputs: alto 46px, radio 12px, fondo `--surface-2`, borde `rgba(255,255,255,0.12)`.
- Foco: `outline: 2px solid var(--accent); outline-offset: 1px`.
- Error: fondo `rgba(240,128,128,0.12)` con texto `#F3B4B4`. En el tema claro, usa un rojo que pase AA sobre `--surface`.

### 2.4 AvailabilityCard

- Punto verde (`--success`) con glow. Respeta `prefers-reduced-motion`: en reposo, sin pulso.
- Título: "Disponible para nuevos proyectos".
- `<dl>` con estas filas, que salen de `content/contact.ts` → `availability`:
  - **Modalidad:** Remoto.
  - **Tipo de contrato:** Full-time (preferido) · contrato por tiempo con opción de renovación.
  - **Zona horaria:** Bogotá · UTC−5.
  - **Idiomas:** Español nativo · Inglés B2.
  - **Ubicación:** Cajicá, Colombia.
- Si `availability.status` cambia a `"unavailable"`, el punto pasa a `--muted` y el título a "Sin disponibilidad por ahora".

### 2.5 CvCard

- Título "Currículum" y la línea "Senior Full Stack Developer · pagos, compliance y plataforma."
- Botón: `<a href="/cv/jose-vasquez-cv.pdf" download>Descargar CV (PDF, en inglés)</a>`. Si existe un CV en el idioma activo, usa ese.
- Enlace "o ver la trayectoria completa →", que lleva a `/experiencia`.

## 3. Responsive

- En **menos de 640px**:
  - La tarjeta de Gmail pasa a columna: ícono + email arriba, y los dos botones a ancho completo.
  - Las tarjetas de canales quedan en 1 columna.
  - El aside baja debajo del formulario.
- Los objetivos táctiles miden 44px o más, y no hay scroll horizontal a 360px.

## 4. SEO

- `title`: "Contacto · José M. Vasquez". `description`: el lead del hero.
- `alternates` con hreflang es/en.
- JSON-LD `ContactPage`, con `mainEntity` de tipo `Person`, `email` y `sameAs` (LinkedIn, GitHub).

## 5. Tests

**Unit (Vitest):**

- `buildMailto` codifica tildes, saltos de línea y `&`.
- Incluye la empresa solo si existe.
- Respeta el límite de longitud.

**E2E (Playwright), en `/es/contacto` y `/en/contact`:**

- Enviar vacío muestra la alerta, marca los campos con `aria-invalid` y deja el foco en "Nombre".
- Con datos válidos, intercepta la navegación a `mailto:` y verifica `to`, `subject` y `body`; después verifica que aparece el estado enviado.
- "Copiar email" cambia el texto. Concede el permiso de clipboard en el contexto.
- No hay botón CTA del footer en esta página.
- axe sin violaciones serias, y navegación completa con teclado.

## 6. Criterios de aceptación

- [ ] `/es/contacto` y `/en/contact` responden 200. Las rutas viejas `/#contacto` siguen funcionando como ancla del Home.
- [ ] El formulario no hace ninguna petición de red. Compruébalo en el test: cero requests al enviar.
- [ ] Todo el copy está en ES y EN, y no hay strings sueltos en los componentes.
- [ ] Lighthouse móvil: 95 o más en accesibilidad y 90 o más en rendimiento.
