import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverted";
export type ButtonSize = "md" | "lg";
export type ButtonShape = "rounded" | "pill";

interface VariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  className?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  // Relleno champagne: CTA primario (Gmail, tab activa).
  primary: "bg-accent text-on-accent font-semibold hover:brightness-105",
  secondary: "border border-border text-text font-medium hover:bg-chip",
  ghost: "text-text-2 font-medium hover:bg-chip hover:text-text",
  // Alto contraste sobre fondos con gradiente (ContactCta).
  inverted: "bg-text text-bg font-semibold hover:opacity-90",
};

const SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-[13px] gap-2",
  lg: "h-[50px] px-6 text-base gap-2.5",
};

const SHAPES: Record<ButtonShape, string> = {
  rounded: "rounded-[10px]",
  pill: "rounded-pill",
};

/**
 * Clases del botón. Útil para dar aspecto de botón a un `<Link>` de next-intl.
 * Todas las combinaciones miden ≥ 44px de alto (objetivo táctil AA).
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  shape = "rounded",
  className,
}: VariantOptions = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    SHAPES[shape],
    className,
  );
}

type ButtonAsButton = VariantOptions &
  ComponentPropsWithoutRef<"button"> & {
    href?: undefined;
  };

type ButtonAsAnchor = VariantOptions &
  ComponentPropsWithoutRef<"a"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/** `<button>` o, si recibe `href`, `<a>` (para enlaces externos y `mailto:`). */
export function Button({ variant, size, shape, className, ...props }: ButtonProps) {
  const classes = buttonClasses({ variant, size, shape, className });

  if (props.href !== undefined) {
    return <a {...(props as ComponentPropsWithoutRef<"a">)} className={classes} />;
  }

  const { type = "button", ...rest } = props as ComponentPropsWithoutRef<"button">;
  return <button type={type} {...rest} className={classes} />;
}
