/**
 * Configuración compartida de motion (ADR 0002): solo se usa en las demos de área, con
 * `LazyMotion` + `m` y las features en un chunk aparte que se carga al montar la demo.
 */
export const loadMotionFeatures = () => import("./motion-features").then((mod) => mod.default);

export const listItemTransition = { duration: 0.25, ease: [0.2, 0.8, 0.2, 1] } as const;
