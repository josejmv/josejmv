"use client";

import type { AreaSlug } from "@content/schema";
import dynamic from "next/dynamic";
import {
  Component,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ConstellationView } from "@/lib/content";
import { cn } from "@/lib/cn";

import { AreaDetailPanel, type AreaDetailLabels } from "./area-detail-panel";
import { ConstellationFallback2D } from "./constellation-fallback-2d";
import { radioKeyDown } from "./radio-keys";
import { useAreaSelection } from "./use-area-selection";

const ConstellationScene3D = dynamic(() => import("./constellation-scene-3d"), { ssr: false });

/** Si el chunk 3D o WebGL fallan, se queda el fallback 2D. */
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Los E2E fuerzan la escena 3D con esta clave: el Chromium de CI solo tiene WebGL por software. */
export const FORCE_3D_KEY = "constellation:3d";

/**
 * `true` si hay WebGL con GPU. Un renderer por software (SwiftShader, llvmpipe…) dibuja en la CPU y
 * bloquea el hilo principal en cada frame: ahí la constelación se queda en 2D.
 */
function forced3d(): boolean {
  try {
    return window.localStorage.getItem(FORCE_3D_KEY) === "force";
  } catch {
    return false;
  }
}

function hasHardwareWebGL(): boolean {
  if (forced3d()) return true;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/** Ejecuta `task` cuando el navegador esté ocioso (o a los 1,5 s), para no competir con la hidratación. */
function whenIdle(task: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(task, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(task, 300);
  return () => clearTimeout(id);
}

type Mode = "2d" | "3d";

interface ConstellationStageProps {
  graph: ConstellationView;
  labels: AreaDetailLabels & {
    groupLabel: string;
    sceneNote: string;
    sceneNote2d: string;
    core: string;
  };
}

/**
 * Constelación de /areas: escenario (3D o 2D) más el panel de detalle, con una sola selección
 * compartida (`?area=`). El 2D se renderiza en el servidor y se queda con reduced-motion o sin WebGL;
 * si no, la escena 3D lo reemplaza con un fundido cuando está lista.
 */
export function ConstellationStage({ graph, labels }: ConstellationStageProps) {
  const ids = useMemo(() => graph.nodes.map((node) => node.id), [graph]);
  const { selected, select, step } = useAreaSelection<AreaSlug>(ids, graph.defaultSelected);
  const stage = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("2d");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 639px)");
    const fine = window.matchMedia("(pointer: fine)");
    // La sonda de WebGL crea un contexto (caro con un renderer por software): solo se hace cuando
    // la escena se va a montar.
    let webgl: boolean | undefined;
    const node = stage.current;
    // Con ratón, la escena se monta sola cuando el navegador está ocioso. En pantallas táctiles
    // (CPU de móvil) se monta con el primer toque o foco en el escenario: el arranque de la página
    // no paga el coste de three.js y el 2D ya es una constelación completa.
    let wanted = fine.matches || forced3d();
    const sync = () => {
      const show = wanted && !reduced.matches && (webgl ??= hasHardwareWebGL());
      setMode(show ? "3d" : "2d");
      setCompact(small.matches);
    };
    const engage = () => {
      if (wanted) return;
      wanted = true;
      sync();
    };
    const cancel = whenIdle(sync);
    reduced.addEventListener("change", sync);
    small.addEventListener("change", sync);
    node?.addEventListener("pointerdown", engage, { once: true });
    node?.addEventListener("focusin", engage, { once: true });
    return () => {
      cancel();
      reduced.removeEventListener("change", sync);
      small.removeEventListener("change", sync);
      node?.removeEventListener("pointerdown", engage);
      node?.removeEventListener("focusin", engage);
    };
  }, []);

  // Fuera del viewport o con la pestaña oculta, el render pasa a demanda.
  useEffect(() => {
    if (mode !== "3d" || !stage.current) return;
    let inView = true;
    const update = () => setVisible(inView && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(stage.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [mode]);

  const node = graph.nodes.find((n) => n.id === selected)!;
  const show3d = mode === "3d";

  return (
    <section className="container-page flex flex-wrap gap-5">
      <div
        ref={stage}
        // Con la escena 3D, los radios accesibles son invisibles: el anillo de foco lo pinta el escenario.
        data-focus-ring=""
        className="relative isolate aspect-4/5 min-h-[520px] w-full flex-[999_1_560px] overflow-hidden rounded-[28px] border border-border bg-radial from-(--constellation-from) to-(--constellation-to) to-70% has-[.sr-only_[role=radio]:focus-visible]:outline-2 has-[.sr-only_[role=radio]:focus-visible]:outline-offset-2 has-[.sr-only_[role=radio]:focus-visible]:outline-accent-text sm:aspect-auto sm:min-h-[600px]"
      >
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            show3d && ready && "pointer-events-none opacity-0",
          )}
          aria-hidden={show3d && ready ? true : undefined}
          inert={show3d && ready ? true : undefined}
        >
          <ConstellationFallback2D
            graph={graph}
            selected={selected}
            onSelect={select}
            onStep={step}
            groupLabel={labels.groupLabel}
            coreLabel={labels.core}
          />
        </div>

        {show3d && (
          <SceneBoundary onError={() => setMode("2d")}>
            <div
              data-scene-3d=""
              aria-hidden="true"
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                ready ? "opacity-100" : "opacity-0",
              )}
            >
              <ConstellationScene3D
                graph={graph}
                selected={selected}
                onSelect={select}
                active={visible}
                compact={compact}
                coreLabel={labels.core}
                onReady={() => setReady(true)}
              />
            </div>
            {/* Capa accesible paralela a la escena 3D: radios ocultos pero enfocables. */}
            {ready && (
              <div
                role="radiogroup"
                aria-label={labels.groupLabel}
                className="sr-only"
                onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => radioKeyDown(event, step)}
              >
                {graph.nodes.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    role="radio"
                    aria-checked={n.id === selected}
                    tabIndex={n.id === selected ? 0 : -1}
                    data-area={n.id}
                    onClick={() => select(n.id)}
                  >
                    {n.title}
                  </button>
                ))}
              </div>
            )}
          </SceneBoundary>
        )}

        <p className="pointer-events-none absolute bottom-4 left-5 font-mono text-[11px] text-subtle">
          {show3d && ready ? labels.sceneNote : labels.sceneNote2d}
        </p>
      </div>

      <AreaDetailPanel node={node} labels={labels} />
    </section>
  );
}
