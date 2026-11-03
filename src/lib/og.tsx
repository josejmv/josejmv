import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Satori (next/og) no lee variables CSS, así que la imagen OG usa una copia de los tokens del tema
 * oscuro de `globals.css`. Es el único sitio fuera de ese archivo donde viven estos valores.
 */
const palette = {
  bg: "#0A0D14",
  surface: "#121722",
  border: "rgba(255,255,255,.08)",
  text: "#E8EAF0",
  text2: "#C9D0DB",
  muted: "#9AA3B2",
  accentText: "#D4BF8E",
  accent2: "#8FB8DE",
};

/** Recorta en el último espacio antes del límite, para no partir palabras. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

interface OgCardProps {
  eyebrow: string;
  title: string;
  description?: string;
  footer: string;
}

/** Tarjeta OG común: monograma, etiqueta, título y pie con el dominio. */
export function ogImage({ eyebrow, title, description, footer }: OgCardProps) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: `radial-gradient(circle at 85% 10%, rgba(212,191,142,.18), transparent 45%), radial-gradient(circle at 10% 95%, rgba(143,184,222,.14), transparent 40%), ${palette.bg}`,
        color: palette.text,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            padding: "10px 18px",
            borderRadius: 14,
            border: `1px solid ${palette.border}`,
            background: palette.surface,
            color: palette.accentText,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          JMV.
        </div>
        <div style={{ display: "flex", color: palette.muted, fontSize: 26, letterSpacing: 2 }}>
          {eyebrow.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 48 ? 58 : 72,
            fontWeight: 700,
            lineHeight: 1.08,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.4,
              color: palette.text2,
              maxWidth: 980,
            }}
          >
            {truncate(description, 150)}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 24,
          color: palette.muted,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 12,
            height: 12,
            borderRadius: 6,
            background: palette.accent2,
          }}
        />
        {footer}
      </div>
    </div>,
    OG_SIZE,
  );
}
