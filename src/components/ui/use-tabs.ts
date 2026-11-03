"use client";

import { type KeyboardEvent, useId } from "react";

/**
 * Tabs accesibles sin dependencias (patrón WAI-ARIA «Tabs» con activación automática). Reemplaza a
 * Radix Tabs en el Home para no cargar su runtime en el JS inicial (ADR 0004).
 *
 * - `tablist` / `tab` / `tabpanel` con `aria-controls` y `aria-labelledby`.
 * - Teclado: ← → (circular), Home y End; solo la tab activa entra en el orden de Tab.
 * - `data-state="active" | "inactive"` en tabs y paneles, como Radix, para los estilos.
 */
export function useTabs<T extends string>(
  values: readonly T[],
  value: T,
  onChange: (next: T) => void,
) {
  const base = useId();
  const tabId = (v: T) => `${base}-tab-${v}`;
  const panelId = (v: T) => `${base}-panel-${v}`;
  const state = (v: T) => (v === value ? "active" : "inactive");

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const index = values.indexOf(value);
    const last = values.length - 1;
    const target =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (target === -1) return;
    event.preventDefault();
    const next = values[target];
    onChange(next);
    event.currentTarget.querySelector<HTMLElement>(`[id="${tabId(next)}"]`)?.focus();
  }

  return {
    listProps: { role: "tablist" as const, onKeyDown },
    tabProps: (v: T) => ({
      id: tabId(v),
      role: "tab" as const,
      type: "button" as const,
      "aria-selected": v === value,
      "aria-controls": panelId(v),
      tabIndex: v === value ? 0 : -1,
      "data-state": state(v),
      onClick: () => onChange(v),
    }),
    panelProps: (v: T) => ({
      id: panelId(v),
      role: "tabpanel" as const,
      "aria-labelledby": tabId(v),
      tabIndex: 0,
      hidden: v !== value,
      "data-state": state(v),
    }),
  };
}
