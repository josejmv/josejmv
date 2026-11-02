"use client";

import { type RefObject, useEffect, useState } from "react";

interface Options {
  /** Deja de observar tras la primera intersección. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/** Indica si el elemento está en el viewport (IntersectionObserver). */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = false, rootMargin = "0px", threshold = 0 }: Options = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, once, rootMargin, threshold]);

  return inView;
}
