import { Inter, JetBrains_Mono, Sora } from "next/font/google";

/** Títulos. Expone `--font-sora`, mapeada a `font-display` en globals.css. */
export const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

/** Texto. Expone `--font-inter`, mapeada a `font-sans`. */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Detalles tech. Expone `--font-jetbrains`, mapeada a `font-mono`. */
export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = [sora.variable, inter.variable, jetbrainsMono.variable].join(" ");
