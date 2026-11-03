/**
 * Abre la app de correo con `location.href` y no con `window.open`: funciona en móvil y el
 * bloqueador de popups no lo frena. Va aparte para poder sustituirlo en los tests.
 */
export function openMailto(url: string) {
  window.location.href = url;
}
