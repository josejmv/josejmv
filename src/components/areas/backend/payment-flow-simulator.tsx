"use client";

import { AnimatePresence, LazyMotion, m, MotionConfig } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useReducer } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { listItemTransition, loadMotionFeatures } from "@/lib/motion";

import { flowReducer, initialFlow, OBLIGATION, STEPS, stepStatus } from "./payment-flow";

/** Tiempo de cada transición automática (ms). */
const STEP_DELAY = 900;

/**
 * PaymentFlowSimulator (módulo firma de Backend & Pagos): Intent → Checkout (idempotente) →
 * Webhook firmado → Conciliado, con un AuditTrailLog append-only en vivo. "Doble clic en pagar"
 * muestra que el segundo intento devuelve el mismo pago gracias al lock y la idempotency key.
 */
export function PaymentFlowSimulator() {
  const t = useTranslations("AreaBackend");
  const [state, dispatch] = useReducer(flowReducer, initialFlow);
  const running = state.step === "intent" || state.step === "checkout" || state.step === "webhook";

  // Avance automático entre pasos mientras hay un pago en curso.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => dispatch({ type: "advance" }), STEP_DELAY);
    return () => clearTimeout(timer);
  }, [running, state.step]);

  const doubleClick = () => {
    dispatch({ type: "pay" });
    dispatch({ type: "pay" });
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <ol aria-label={t("stepsLabel")} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STEPS.map((step) => {
                const status = stepStatus(state, step);
                return (
                  <li
                    key={step}
                    aria-current={status === "active" ? "step" : undefined}
                    className={cn(
                      "flex min-h-16 flex-col justify-center rounded-xl border px-3 py-2 text-center text-[13px] transition-colors duration-300",
                      status === "done" && "border-success/40 bg-success/10 text-text",
                      status === "active" &&
                        "border-accent-text bg-accent/15 font-semibold text-text",
                      status === "pending" && "border-border bg-surface-2 text-muted",
                    )}
                  >
                    {t(`steps.${step}`)}
                    <span className="sr-only">: {t(`status.${status}`)}</span>
                  </li>
                );
              })}
            </ol>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-2xl border border-border bg-surface-2 p-4 font-mono text-xs">
              <dt className="text-muted">{t("fields.obligation")}</dt>
              <dd>{OBLIGATION}</dd>
              <dt className="text-muted">{t("fields.intent")}</dt>
              <dd>{state.intentId ?? "—"}</dd>
              <dt className="text-muted">idempotency-key</dt>
              <dd className="truncate">{state.idempotencyKey ?? "—"}</dd>
              <dt className="text-muted">{t("fields.lock")}</dt>
              <dd className={state.locked ? "text-accent-text" : "text-muted"}>
                {state.locked ? t("fields.locked") : t("fields.free")}
              </dd>
            </dl>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => dispatch({ type: "pay" })}>{t("actions.pay")}</Button>
              <Button variant="secondary" onClick={doubleClick}>
                {t("actions.doubleClick")}
              </Button>
              <Button
                variant="secondary"
                onClick={() => dispatch({ type: "replayWebhook" })}
                disabled={state.step !== "reconciled"}
              >
                {t("actions.replay")}
              </Button>
              <Button variant="ghost" onClick={() => dispatch({ type: "reset" })}>
                {t("actions.reset")}
              </Button>
            </div>
          </div>

          <section
            aria-labelledby="audit-title"
            className="flex min-h-72 flex-col rounded-2xl border border-border bg-surface-2"
          >
            <h3
              id="audit-title"
              className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-xs text-muted"
            >
              <span>AuditTrailLog</span>
              <span>{t("audit.appendOnly")}</span>
            </h3>
            <ol
              aria-live="polite"
              className="flex max-h-80 flex-1 flex-col gap-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed"
            >
              {state.log.length === 0 && <li className="text-subtle">{t("audit.empty")}</li>}
              <AnimatePresence initial={false}>
                {state.log.map((entry) => (
                  <m.li
                    key={entry.seq}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={listItemTransition}
                    className="flex gap-2"
                  >
                    <span className="shrink-0 text-subtle">
                      {String(entry.seq).padStart(3, "0")}
                    </span>
                    <span
                      className={cn(
                        entry.tone === "ok" && "text-success",
                        entry.tone === "warn" && "text-accent-text",
                        entry.tone === "info" && "text-text-2",
                      )}
                    >
                      {t(`log.${entry.code}`, entry.params)}
                    </span>
                  </m.li>
                ))}
              </AnimatePresence>
            </ol>
          </section>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
