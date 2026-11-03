"use client";

import { useCallback, useEffect, useState } from "react";

/** Selección inicial: `?area=<slug>` si es un área válida; si no, el valor por defecto. */
export function initialSelection<T extends string>(
  search: string,
  ids: readonly T[],
  fallback: T,
): T {
  const area = new URLSearchParams(search).get("area");
  return area && (ids as readonly string[]).includes(area) ? (area as T) : fallback;
}

/** Siguiente área en el orden de `ids`, circular (`delta` = +1 o −1). */
export function stepSelection<T extends string>(ids: readonly T[], current: T, delta: number): T {
  const index = ids.indexOf(current);
  return ids[(index + delta + ids.length) % ids.length];
}

/**
 * Área seleccionada en /areas, compartible con `?area=<slug>`. El primer render usa el valor por
 * defecto (igual en servidor y cliente) y, ya montado, lee la URL. Al cambiar, actualiza la query con
 * `history.replaceState`: sin scroll, sin entrada nueva en el historial y sin pedir nada al servidor.
 */
export function useAreaSelection<T extends string>(ids: readonly T[], fallback: T) {
  const [selected, setSelected] = useState<T>(fallback);

  useEffect(() => {
    // Sincroniza con un sistema externo (la URL), una vez al montar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(initialSelection(window.location.search, ids, fallback));
  }, [ids, fallback]);

  const select = useCallback((id: T) => {
    setSelected(id);
    const url = new URL(window.location.href);
    url.searchParams.set("area", id);
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const step = useCallback(
    (delta: number) => select(stepSelection(ids, selected, delta)),
    [ids, select, selected],
  );

  return { selected, select, step };
}
