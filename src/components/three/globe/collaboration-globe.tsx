"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { GlobeHome, LocalizedCountry } from "@/lib/content";
import { cn } from "@/lib/cn";

// three + react-globe.gl van en un chunk aparte que solo se pide cerca del viewport (ADR 0001).
const GlobeCanvas = dynamic(() => import("./globe-canvas"), { ssr: false });

/** Duración del fundido SVG → 3D (ms). El 3D empieza a rotar al terminar. */
const FADE_MS = 700;

/** Solo desktop con puntero fino: el chunk 3D pesa ~555 kB gz (ver ADR 0001). */
const DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine)";

function canUse3d(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia(DESKTOP_QUERY).matches && !connection?.saveData && hasWebGL();
}

function subscribeDesktop(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** `true` cuando el navegador quedó ocioso tras la carga: el 3D no compite con el LCP. */
function useIdle(): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const done = () => setIdle(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(done, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(done, 1200);
    return () => clearTimeout(id);
  }, []);
  return idle;
}

/** WebGL acelerado por GPU. Con renderer por software (sin GPU) el globo congelaría la página. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension?.("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

export interface CollaborationGlobeProps {
  points: LocalizedCountry[];
  home: GlobeHome;
  /** Globo estático (GlobeStaticSvg) del mismo dataset: se ve en SSR, sin WebGL o con reduced-motion. */
  fallback: ReactNode;
  className?: string;
}

/**
 * Globo de colaboración. Sirve primero el SVG estático. Carga el 3D solo en desktop con WebGL, sin
 * reduced-motion ni ahorro de datos, cerca del viewport y con el navegador ocioso; hace un fundido
 * cuando pinta el primer cuadro y pausa el render fuera del viewport.
 */
export function CollaborationGlobe({ points, home, fallback, className }: CollaborationGlobeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const capable = useSyncExternalStore(subscribeDesktop, canUse3d, () => false);
  const idle = useIdle();
  const near = useInView(ref, { once: true, rootMargin: "200px" });
  const visible = useInView(ref);
  const [ready, setReady] = useState(false);

  const use3d = capable && !reducedMotion && near && idle;
  const show3d = use3d && ready;

  return (
    <div ref={ref} className={cn("relative aspect-square w-full max-w-[440px]", className)}>
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          // Sigue en el árbol accesible: su `role="img"` describe el globo también cuando se ve el 3D.
          show3d ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        {fallback}
      </div>
      {use3d && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            show3d ? "opacity-100" : "opacity-0",
          )}
        >
          <GlobeCanvas
            points={points}
            home={home}
            active={visible}
            onReady={() => setReady(true)}
            rotateAfterMs={FADE_MS + 300}
          />
        </div>
      )}
    </div>
  );
}
