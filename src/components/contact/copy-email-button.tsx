"use client";

import { useEffect, useState } from "react";

import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface CopyEmailButtonProps {
  email: string;
  /** `id` del elemento con el email, para seleccionarlo si el portapapeles falla. */
  targetId: string;
  labels: { copy: string; copied: string; manual: string };
  className?: string;
}

type Status = "idle" | "copied" | "manual";

/** Copia el email al portapapeles. Durante 1,8 s muestra «¡Copiado!» y lo anuncia. */
export function CopyEmailButton({ email, targetId, labels, className }: CopyEmailButtonProps) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status !== "copied") return;
    const timer = setTimeout(() => setStatus("idle"), 1800);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      // Sin permiso o sin API: deja el email seleccionado para copiarlo a mano.
      const target = document.getElementById(targetId);
      const selection = window.getSelection();
      if (target && selection) {
        const range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("manual");
    }
  }

  const text =
    status === "copied" ? labels.copied : status === "manual" ? labels.manual : labels.copy;

  return (
    <>
      <button
        type="button"
        onClick={() => void copy()}
        className={buttonClasses({
          variant: "secondary",
          size: "lg",
          shape: "pill",
          className: cn("text-[15px]", className),
        })}
      >
        {text}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "idle" ? "" : text}
      </span>
    </>
  );
}
