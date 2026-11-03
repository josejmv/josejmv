# ADR 0005 — Formulario de contacto con mailto prellenado

**Estado:** Aceptado · 2026-11-03

## Contexto

La página de Contacto necesita un formulario cuyo envío termine en Gmail (josejmvasquez@gmail.com) **sin servicios de terceros**: nada de Resend, Formspree ni APIs externas.

Opciones evaluadas (1–5):

| Criterio                                              | Gmail SMTP en servidor | **mailto prellenado** | Ambos |
| ----------------------------------------------------- | ---------------------- | --------------------- | ----- |
| Experiencia del visitante                             | 5                      | 2                     | 5     |
| Fiabilidad                                            | 4                      | 3                     | 5     |
| Esfuerzo                                              | 3                      | 5                     | 2     |
| Privacidad (sin credenciales ni datos en el servidor) | 4                      | 5                     | 4     |

## Decisión

Usamos un **mailto prellenado**:

- Al enviar, el formulario valida con `contactFormSchema` (`content/contact-form.ts`). Si algo falla, muestra una alerta, marca cada campo con `aria-invalid` y su error en `aria-describedby`, y mueve el foco al primer campo con error.
- Si todo está bien, `buildMailto()` arma la URL: asunto `Portafolio · {tipo} · {nombre}` y cuerpo con el mensaje y la firma (nombre, email y, si existe, empresa). Después navega con `location.href`, no con `window.open`: funciona en móvil y el bloqueador de popups no lo frena.
- El esquema usa `zod/mini`: es lo único de Zod que llega al navegador, y así `/contacto` no carga Zod completo (~117 kB sin comprimir). `content/schema.ts` lo reexporta junto al resto de esquemas.

## Consecuencias

- No hay backend, ni credenciales en Vercel, ni anti-spam que mantener, ni datos personales guardados. El E2E comprueba que enviar no hace ninguna petición de red.
- Si el visitante no tiene una app de correo configurada, no pasa nada visible. Para mitigarlo:
  - el estado de éxito trae un enlace «Ábrelo aquí»;
  - el botón «Copiar email» está siempre visible;
  - el correo aparece en grande arriba.
- Las URLs mailto largas pueden fallar en algunos clientes: el mensaje se recorta (nunca la firma) para que la URL no pase de ~1.800 caracteres.
- Si en el futuro se quiere enviar sin salir de la página, la alternativa evaluada es una Server Action con nodemailer y Gmail SMTP con contraseña de aplicación. Sigue sin terceros, pero necesita verificación en 2 pasos, variables de entorno y anti-spam.
