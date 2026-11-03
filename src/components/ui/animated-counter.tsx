"use client";

import { useLocale } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimatedCounterProps {
  value: number;
  /** Duración en ms. */
  duration?: number;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Cuenta de 0 al valor la primera vez que entra en el viewport.
 * El HTML del servidor trae el valor final (sin JS o con reduced-motion no se anima),
 * y los lectores de pantalla siempre leen el valor final.
 */
export function AnimatedCounter({ value, duration = 1200, className }: AnimatedCounterProps) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, threshold: 0.4 });
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(value);
  const format = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  useEffect(() => {
    if (!inView || reducedMotion) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCurrent(Math.round(value * easeOutCubic(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reducedMotion, value, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {format.format(current)}
      </span>
      <span className="sr-only">{format.format(value)}</span>
    </span>
  );
}
