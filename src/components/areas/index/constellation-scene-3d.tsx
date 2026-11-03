"use client";

import type { AreaSlug } from "@content/schema";
import { Line, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  type Group,
  type Mesh,
  type Object3D,
  type PointsMaterial,
  Vector3,
} from "three";

import { isEdgeActive } from "@/lib/constellation";
import type { ConstellationView } from "@/lib/content";
import { cn } from "@/lib/cn";

interface ConstellationScene3DProps {
  graph: ConstellationView;
  selected: AreaSlug;
  onSelect: (id: AreaSlug) => void;
  /** En pantalla y con la pestaña visible: si no, el render pasa a demanda. */
  active: boolean;
  compact: boolean;
  coreLabel: string;
  onReady: () => void;
}

interface Palette {
  accent: string;
  accent2: string;
  node: string;
  ray: string;
  text: string;
}

/** Colores de los tokens del tema actual (regla 4: nada de hex en componentes). */
function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    accent: v("--accent"),
    accent2: v("--accent-2"),
    node: v("--constellation-node"),
    ray: v("--constellation-ray"),
    text: v("--text"),
  };
}

/** `rgba(r,g,b,a)` → color y opacidad por separado (three no entiende el canal alfa en CSS). */
function splitAlpha(color: string): { color: string; opacity: number } {
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) return { color, opacity: 1 };
  const [r, g, b, a = "1"] = match[1].split(",").map((part) => part.trim());
  return { color: `rgb(${r}, ${g}, ${b})`, opacity: Number(a) };
}

/** Textura de brillo: degradado radial blanco → transparente (se tiñe con el color del sprite). */
function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.35)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, []);
}

function Glow({ color, scale, opacity }: { color: string; scale: number; opacity: number }) {
  const map = useGlowTexture();
  return (
    <sprite scale={scale}>
      <spriteMaterial
        map={map}
        color={color}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}

const CORE_RADIUS = 0.55;
const NODE_RADIUS = 0.32;
const ORIGIN = new Vector3(0, 0, 0);

function circle(radius: number, segments = 128): [number, number, number][] {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2;
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
  });
}

function Stars({ color }: { color: string }) {
  const material = useRef<PointsMaterial>(null);
  const geometry = useMemo(() => {
    // Posiciones fijas (semilla determinista): el cielo no cambia entre renders.
    let seed = 7;
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      const radius = 9 + random() * 6;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions.set(
        [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta) - 4,
        ],
        i * 3,
      );
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (material.current) material.current.opacity = 0.45 + Math.sin(clock.elapsedTime * 1.3) * 0.2;
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial ref={material} color={color} size={0.05} transparent sizeAttenuation />
    </points>
  );
}

function Rings({ palette }: { palette: Palette }) {
  const champagne = useRef<Group>(null);
  const blue = useRef<Group>(null);
  const outer = useMemo(() => circle(4.6), []);
  const inner = useMemo(() => circle(3.7), []);

  useFrame((_, delta) => {
    // Periodos de 40 s y 70 s.
    if (champagne.current) champagne.current.rotation.y += (delta * Math.PI * 2) / 40;
    if (blue.current) blue.current.rotation.y -= (delta * Math.PI * 2) / 70;
  });

  return (
    <group rotation={[(18 * Math.PI) / 180, 0, (8 * Math.PI) / 180]}>
      <group ref={champagne}>
        <Line points={outer} color={palette.accent} transparent opacity={0.25} lineWidth={1} />
      </group>
      <group ref={blue} rotation={[0, 0, (-14 * Math.PI) / 180]}>
        <Line
          points={inner}
          color={palette.accent2}
          transparent
          opacity={0.18}
          lineWidth={1}
          dashed
          dashSize={0.18}
          gapSize={0.14}
        />
      </group>
    </group>
  );
}

/**
 * Etiquetas de la escena: DOM normal encima del lienzo, sin una raíz de React por etiqueta (como
 * haría `<Html>` de drei). Cada etiqueta tiene un ancla 3D; `LabelProjector` las proyecta a píxeles
 * en un único `useFrame` y escribe el `transform` directamente en el nodo.
 */
interface LabelRegistry {
  anchors: Map<string, Object3D>;
  elements: Map<string, HTMLElement>;
}

function anchorRef(registry: LabelRegistry, key: string) {
  return (object: Object3D | null) => {
    if (object) registry.anchors.set(key, object);
    else registry.anchors.delete(key);
  };
}

function elementRef(registry: LabelRegistry, key: string) {
  return (element: HTMLElement | null) => {
    if (element) registry.elements.set(key, element);
    else registry.elements.delete(key);
  };
}

function LabelProjector({ registry }: { registry: LabelRegistry }) {
  const point = useMemo(() => new Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const [key, anchor] of registry.anchors) {
      const element = registry.elements.get(key);
      if (!element) continue;
      anchor.getWorldPosition(point).project(camera);
      const x = ((point.x + 1) / 2) * size.width;
      const y = ((1 - point.y) / 2) * size.height;
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  });
  return null;
}

const edgeKey = (edge: { from: string; to: string }) => `edge:${edge.from}-${edge.to}`;

function Edge({
  from,
  to,
  active,
  palette,
  registry,
  labelKey,
}: {
  from: Vector3;
  to: Vector3;
  active: boolean;
  palette: Palette;
  registry: LabelRegistry;
  labelKey: string;
}) {
  const line = useRef<{ material: { dashOffset: number } } | null>(null);
  useFrame((_, delta) => {
    if (line.current) line.current.material.dashOffset -= delta * 0.4;
  });
  const mid = useMemo(() => from.clone().lerp(to, 0.5), [from, to]);

  return (
    <>
      <Line
        ref={line as never}
        points={[from, to]}
        color={active ? palette.accent : palette.accent2}
        transparent
        opacity={active ? 0.95 : 0.3}
        lineWidth={active ? 2 : 1}
        dashed
        dashSize={0.16}
        gapSize={0.12}
      />
      <object3D ref={anchorRef(registry, labelKey)} position={mid} />
    </>
  );
}

function Node({
  id,
  index,
  position,
  active,
  palette,
  registry,
  onSelect,
  onHover,
}: {
  id: AreaSlug;
  index: number;
  position: Vector3;
  active: boolean;
  palette: Palette;
  registry: LabelRegistry;
  onSelect: () => void;
  onHover: (id: AreaSlug | null) => void;
}) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const hovered = useRef(false);

  useFrame(({ clock }, delta) => {
    if (group.current) {
      // Flota ±0,08 con un desfase por índice.
      group.current.position.y =
        position.y + Math.sin(clock.elapsedTime * 0.9 + index * 1.1) * 0.08;
    }
    if (mesh.current) {
      const target = active ? 1.15 : hovered.current ? 1.06 : 1;
      const s = mesh.current.scale.x + (target - mesh.current.scale.x) * Math.min(1, delta * 10);
      mesh.current.scale.setScalar(s);
    }
  });

  function click(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    // Un arrastre para orbitar no es un clic.
    if (event.delta > 6) return;
    onSelect();
  }

  return (
    <group ref={group} position={position}>
      <mesh
        ref={mesh}
        onClick={click}
        onPointerOver={(event) => {
          event.stopPropagation();
          hovered.current = true;
          onHover(id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hovered.current = false;
          onHover(null);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[NODE_RADIUS, 48, 48]} />
        <meshStandardMaterial
          color={active ? palette.accent : palette.node}
          emissive={active ? palette.accent : palette.accent2}
          emissiveIntensity={active ? 0.25 : 0.15}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      {active && <Glow color={palette.accent} scale={1.9} opacity={0.55} />}
      <object3D ref={anchorRef(registry, `code:${id}`)} />
      <object3D ref={anchorRef(registry, `name:${id}`)} position={[0, -NODE_RADIUS - 0.32, 0]} />
    </group>
  );
}

/** Mitad del ancho que debe caber en pantalla: nodos (x ≤ 3,1) más su etiqueta. */
const HALF_WIDTH = 4;
const FOV = 45;

/**
 * Aleja la cámara lo justo para que la constelación quepa a lo ancho: en un escenario vertical
 * (móvil) el campo horizontal es estrecho y con z fija se cortarían los nodos laterales.
 */
function CameraFit() {
  const camera = useThree((state) => state.camera);
  const aspect = useThree((state) => state.size.width / state.size.height);
  const controls = useThree((state) => state.controls) as unknown as { update: () => void } | null;

  useEffect(() => {
    const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
    // En vertical, margen extra: la rotación del grupo (±12°) acerca los nodos laterales al borde.
    const halfWidth = aspect < 1 ? HALF_WIDTH + 0.7 : HALF_WIDTH;
    const distance = Math.max(9, halfWidth / (tan * aspect));
    camera.position.setLength(Math.hypot(distance, 1.2));
    controls?.update();
  }, [aspect, camera, controls]);

  return null;
}

/** Rotación lenta del conjunto (±12° en 30 s) y pequeño acercamiento hacia el nodo elegido. */
function Rig({ focus, children }: { focus: Vector3; children: ReactNode }) {
  const group = useRef<Group>(null);
  const controls = useThree((state) => state.controls) as unknown as {
    target: Vector3;
    update: () => void;
  } | null;
  const target = useRef(new Vector3());

  useFrame(({ clock }, delta) => {
    if (group.current) {
      group.current.rotation.y =
        Math.sin((clock.elapsedTime / 30) * Math.PI * 2) * ((12 * Math.PI) / 180);
    }
    if (controls) {
      // Dolly de ~0,4 s con easing exponencial hacia el 15 % de la posición del nodo.
      target.current.copy(focus).multiplyScalar(0.15);
      controls.target.lerp(target.current, Math.min(1, delta * 8));
      controls.update();
    }
  });

  return <group ref={group}>{children}</group>;
}

function Scene({
  graph,
  selected,
  onSelect,
  onHover,
  palette,
  registry,
}: {
  graph: ConstellationView;
  selected: AreaSlug;
  onSelect: (id: AreaSlug) => void;
  onHover: (id: AreaSlug | null) => void;
  palette: Palette;
  registry: LabelRegistry;
}) {
  const positions = useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, new Vector3(...node.position3d)])),
    [graph],
  );
  const ray = splitAlpha(palette.ray);

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 8]} intensity={0.7} />
      <pointLight position={[0, 0, 0]} intensity={3} distance={5} color={palette.accent} />

      <Stars color={palette.text} />

      <Rig focus={positions.get(selected) ?? ORIGIN}>
        <Rings palette={palette} />

        <mesh>
          <sphereGeometry args={[CORE_RADIUS, 64, 64]} />
          <meshStandardMaterial color={palette.accent} metalness={0.4} roughness={0.35} />
        </mesh>
        <Glow color={palette.accent} scale={3.2} opacity={0.5} />
        <object3D ref={anchorRef(registry, "core")} />

        {graph.nodes.map((node) => (
          <Line
            key={`ray-${node.id}`}
            points={[ORIGIN, positions.get(node.id)!]}
            color={ray.color}
            transparent
            opacity={ray.opacity}
            lineWidth={1}
          />
        ))}

        {graph.edges.map((edge) => (
          <Edge
            key={edgeKey(edge)}
            labelKey={edgeKey(edge)}
            from={positions.get(edge.from)!}
            to={positions.get(edge.to)!}
            active={isEdgeActive(edge, selected)}
            palette={palette}
            registry={registry}
          />
        ))}

        {graph.nodes.map((node, index) => (
          <Node
            key={node.id}
            id={node.id}
            index={index}
            position={positions.get(node.id)!}
            active={node.id === selected}
            palette={palette}
            registry={registry}
            onSelect={() => onSelect(node.id)}
            onHover={onHover}
          />
        ))}
      </Rig>

      <LabelProjector registry={registry} />
      <CameraFit />
      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        enableDamping
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 2 - 0.35}
        maxPolarAngle={Math.PI / 2 + 0.25}
        minAzimuthAngle={-0.6}
        maxAzimuthAngle={0.6}
      />
    </>
  );
}

/**
 * Centrado de una etiqueta sobre su ancla. En móvil, las de los nodos laterales se corren hacia el
 * centro (`amount` % de su ancho) para no salirse del borde.
 */
function labelTranslate(x: number, compact: boolean, amount: number): string {
  if (!compact || Math.abs(x) <= 1.5) return "-50% -50%";
  return `${x > 0 ? -50 - amount : -50 + amount}% -50%`;
}

/** Capa DOM de etiquetas: `LabelProjector` las posiciona; aquí solo se decide su aspecto. */
function Labels({
  graph,
  selected,
  hovered,
  compact,
  coreLabel,
  registry,
}: {
  graph: ConstellationView;
  selected: AreaSlug;
  hovered: AreaSlug | null;
  compact: boolean;
  coreLabel: string;
  registry: LabelRegistry;
}) {
  // Cada etiqueta parte en (0, 0); el proyector la mueve con `transform` y `translate` la centra.
  const base = "absolute top-0 left-0 will-change-transform";
  const xOf = (id: AreaSlug) => graph.nodes.find((n) => n.id === id)!.position3d[0];

  return (
    <div className="pointer-events-none absolute inset-0">
      <span
        ref={elementRef(registry, "core")}
        style={{ translate: "-50% -50%" }}
        className={cn(base, "font-display text-sm font-semibold text-on-accent")}
      >
        {coreLabel}
      </span>

      {graph.edges.map((edge) => {
        const active = isEdgeActive(edge, selected);
        return (
          <span
            key={edgeKey(edge)}
            ref={elementRef(registry, edgeKey(edge))}
            data-constellation-label={active ? "" : undefined}
            style={{ translate: labelTranslate((xOf(edge.from) + xOf(edge.to)) / 2, compact, 35) }}
            className={cn(
              base,
              "rounded-md border border-accent-text/40 bg-surface/90 px-2 py-0.5 text-center font-mono text-[11px] text-accent-text transition-opacity duration-200",
              compact ? "w-max max-w-32" : "whitespace-nowrap",
              active ? "opacity-100" : "invisible opacity-0",
            )}
          >
            {edge.label}
          </span>
        );
      })}

      {graph.nodes.map((node) => {
        const active = node.id === selected;
        const showName = !compact || active;
        return (
          <Fragment key={node.id}>
            <span
              ref={elementRef(registry, `code:${node.id}`)}
              style={{ translate: "-50% -50%" }}
              className={cn(
                base,
                "font-mono text-[11px] font-semibold",
                active ? "text-on-accent" : "text-bg",
              )}
            >
              {node.code}
            </span>
            <span
              ref={elementRef(registry, `name:${node.id}`)}
              data-constellation-label={showName ? "" : undefined}
              style={{ translate: labelTranslate(node.position3d[0], compact, 40) }}
              className={cn(
                base,
                "rounded-full border bg-surface/90 px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                !showName && "invisible",
                active
                  ? "border-accent-text/50 text-text"
                  : hovered === node.id
                    ? "border-accent-text/30 text-text"
                    : "border-border text-text-2",
              )}
            >
              {node.title}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}

/**
 * Escena 3D de /areas (ADR 0006). Se carga con `next/dynamic` y `ssr: false`; es decorativa para
 * lectores de pantalla (su contenedor lleva `aria-hidden`): la selección accesible vive en el
 * radiogroup paralelo.
 */
export default function ConstellationScene3D({
  graph,
  selected,
  onSelect,
  active,
  compact,
  coreLabel,
  onReady,
}: ConstellationScene3DProps) {
  const [registry] = useState<LabelRegistry>(() => ({ anchors: new Map(), elements: new Map() }));
  const [hovered, setHovered] = useState<AreaSlug | null>(null);
  const { resolvedTheme } = useTheme();
  const [palette, setPalette] = useState<Palette>(readPalette);

  useEffect(() => {
    // El tema cambia las variables CSS: se vuelven a leer después de aplicarlo.
    const frame = requestAnimationFrame(() => setPalette(readPalette()));
    return () => cancelAnimationFrame(frame);
  }, [resolvedTheme]);

  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "demand"}
        camera={{ fov: FOV, position: [0, 1.2, compact ? 11 : 9] }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={() => onReady()}
        className="absolute! inset-0"
      >
        <Scene
          graph={graph}
          selected={selected}
          onSelect={onSelect}
          onHover={setHovered}
          palette={palette}
          registry={registry}
        />
      </Canvas>
      <Labels
        graph={graph}
        selected={selected}
        hovered={hovered}
        compact={compact}
        coreLabel={coreLabel}
        registry={registry}
      />
    </>
  );
}
