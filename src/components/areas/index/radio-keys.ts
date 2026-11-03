import type { KeyboardEvent } from "react";

const NEXT = new Set(["ArrowRight", "ArrowDown"]);
const PREV = new Set(["ArrowLeft", "ArrowUp"]);

/**
 * Teclado de un `radiogroup` (patrón WAI-ARIA): las flechas mueven la selección y el foco al nuevo
 * radio; Enter y Espacio confirman (el radio ya quedó seleccionado); Tab sale del grupo.
 */
export function radioKeyDown(event: KeyboardEvent<HTMLElement>, onStep: (delta: number) => void) {
  const delta = NEXT.has(event.key) ? 1 : PREV.has(event.key) ? -1 : 0;
  if (!delta) return;
  event.preventDefault();
  onStep(delta);
  // El radio activo cambia en el próximo render: se enfoca después.
  const group = event.currentTarget;
  requestAnimationFrame(() =>
    group.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')?.focus(),
  );
}
