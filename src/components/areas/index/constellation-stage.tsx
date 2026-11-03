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

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
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
    const sync = () => {
      setMode(!reduced.matches && supportsWebGL() ? "3d" : "2d");
      setCompact(small.matches);
    };
    sync();
    reduced.addEventListener("change", sync);
    small.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      small.removeEventListener("change", sync);
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
