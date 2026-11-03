"use client";

import { useTranslations } from "next-intl";
import { type CSSProperties, useId, useState } from "react";

import { cn } from "@/lib/cn";

type BrandKey = "a" | "b" | "c";

/** Marcas ficticias: solo cambian sus fundamentos (tono, croma y radio). */
const BRANDS: Record<BrandKey, { hue: number; chroma: number; radius: number }> = {
  a: { hue: 75, chroma: 0.11, radius: 12 },
  b: { hue: 250, chroma: 0.13, radius: 4 },
  c: { hue: 160, chroma: 0.12, radius: 22 },
};

/** Capa 1 → capa 2: los tokens semánticos se derivan de los fundamentos de la marca. */
function semanticTokens(hue: number, chroma: number) {
  return {
    "--demo-action": `oklch(0.74 ${chroma} ${hue})`,
    "--demo-action-text": `oklch(0.22 0.02 ${hue})`,
    "--demo-accent-surface": `oklch(0.74 ${chroma} ${hue} / 0.14)`,
    // Texto de acento: claro sobre el tema oscuro y oscuro sobre el claro (contraste AA en ambos).
    "--demo-accent-text": `oklch(0.82 ${chroma} ${hue})`,
    "--demo-accent-text-light": `oklch(0.42 ${chroma} ${hue})`,
  };
}

/**
 * TokenPlayground (módulo firma de Frontend): cambia de marca o mueve el tono y los componentes
 * reales se re-tematizan en vivo a través de las 3 capas de tokens.
 */
export function TokenPlayground() {
  const t = useTranslations("AreaFrontend");
  const sliderId = useId();
  const [brand, setBrand] = useState<BrandKey>("a");
  const [hue, setHue] = useState(BRANDS.a.hue);
  const { chroma, radius } = BRANDS[brand];
  const semantic = semanticTokens(hue, chroma);

  const selectBrand = (key: BrandKey) => {
    setBrand(key);
    setHue(BRANDS[key].hue);
  };

  const layers = [
    {
      title: t("layers.foundations"),
      tokens: { "brand.hue": `${hue}`, "brand.chroma": `${chroma}`, "brand.radius": `${radius}px` },
    },
    { title: t("layers.semantic"), tokens: semantic },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col gap-5">
        <div role="radiogroup" aria-label={t("brandLabel")} className="flex flex-wrap gap-2">
          {(Object.keys(BRANDS) as BrandKey[]).map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={brand === key}
              onClick={() => selectBrand(key)}
              className={cn(
                "h-11 rounded-pill border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
                brand === key
                  ? "border-transparent bg-accent font-semibold text-on-accent"
                  : "border-border text-text-2 hover:bg-chip",
              )}
            >
              {t(`brands.${key}`)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={sliderId} className="flex justify-between font-mono text-xs text-muted">
            <span>{t("hueLabel")}</span>
            <span>{hue}°</span>
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(event) => setHue(Number(event.target.value))}
            className="h-11 w-full cursor-pointer accent-accent"
          />
        </div>

        {layers.map((layer, index) => (
          <div key={layer.title} className="rounded-2xl border border-border bg-surface-2 p-4">
            <p className="mb-2 font-mono text-xs text-subtle">
              {index + 1} · {layer.title}
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
              {Object.entries(layer.tokens).map(([name, value]) => (
                <div key={name} className="contents">
                  <dt className="text-muted">{name}</dt>
                  <dd className="truncate text-text-2">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Capa 3: componentes que solo consumen tokens semánticos. */}
      <div
        aria-live="polite"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
        style={{ ...semantic, "--demo-radius": `${radius}px` } as CSSProperties}
      >
        <p className="font-mono text-xs text-subtle">3 · {t("layers.components")}</p>
        <div className="flex flex-col gap-3 rounded-(--demo-radius) border border-border bg-surface-2 p-5 transition-all duration-300">
          <span className="inline-flex self-start rounded-(--demo-radius) bg-(--demo-accent-surface) px-2.5 py-1 text-xs font-semibold text-(--demo-accent-text-light) transition-colors duration-300 dark:text-(--demo-accent-text)">
            {t("demo.badge")}
          </span>
          <p className="text-sm text-muted">{t("demo.balanceLabel")}</p>
          <p className="font-display text-3xl font-semibold">{t("demo.balance")}</p>
          <label className="flex flex-col gap-1.5 text-xs text-muted">
            {t("demo.inputLabel")}
            <input
              readOnly
              value={t("demo.inputValue")}
              className="h-11 rounded-(--demo-radius) border border-border bg-surface px-3 text-sm text-text transition-all duration-300 outline-none focus-visible:border-(--demo-action)"
            />
          </label>
          <button
            type="button"
            className="h-11 rounded-(--demo-radius) bg-(--demo-action) px-4 text-sm font-semibold text-(--demo-action-text) transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--demo-action)"
          >
            {t("demo.cta")}
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted">{t("demo.note")}</p>
      </div>
    </div>
  );
}
