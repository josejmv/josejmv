/**
 * Máquina de estados del PaymentFlowSimulator (datos ficticios). Modela las garantías que importan
 * en un cobro: un solo intento por obligación (lock + idempotency key), webhooks verificados y
 * eventos duplicados que no vuelven a aplicarse.
 */

export const STEPS = ["intent", "checkout", "webhook", "reconciled"] as const;
export type Step = "idle" | (typeof STEPS)[number];

export type LogCode =
  | "intentCreated"
  | "lockAcquired"
  | "idempotentReplay"
  | "checkoutCreated"
  | "webhookVerified"
  | "reconciled"
  | "lockReleased"
  | "clientNotified"
  | "alreadyPaid"
  | "duplicateIgnored";

export interface LogEntry {
  /** Número de secuencia (el log es append-only: nunca se edita ni se borra). */
  seq: number;
  code: LogCode;
  tone: "info" | "ok" | "warn";
  params: Record<string, string>;
}

export interface FlowState {
  step: Step;
  intentId: string | null;
  idempotencyKey: string | null;
  locked: boolean;
  /** Ids de eventos de webhook ya aplicados. */
  processedEvents: string[];
  log: LogEntry[];
  attempts: number;
}

export type FlowAction =
  { type: "pay" } | { type: "advance" } | { type: "replayWebhook" } | { type: "reset" };

/** Obligación ficticia de la demo. */
export const OBLIGATION = "OBL-1042";

export const initialFlow: FlowState = {
  step: "idle",
  intentId: null,
  idempotencyKey: null,
  locked: false,
  processedEvents: [],
  log: [],
  attempts: 0,
};

function append(state: FlowState, ...entries: Omit<LogEntry, "seq">[]): LogEntry[] {
  const start = state.log.length;
  return [...state.log, ...entries.map((entry, i) => ({ ...entry, seq: start + i + 1 }))];
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "pay": {
      if (state.step === "reconciled") {
        return {
          ...state,
          log: append(state, {
            code: "alreadyPaid",
            tone: "warn",
            params: { obligation: OBLIGATION },
          }),
        };
      }
      if (state.locked && state.intentId && state.idempotencyKey) {
        // Segundo clic con un pago en curso: misma llave, mismo intento, ningún cobro nuevo.
        return {
          ...state,
          log: append(state, {
            code: "idempotentReplay",
            tone: "warn",
            params: { intent: state.intentId, key: state.idempotencyKey },
          }),
        };
      }
      const attempts = state.attempts + 1;
      const intentId = `pi_${String(attempts).padStart(4, "0")}`;
      const idempotencyKey = `idem-${OBLIGATION}-${attempts}`;
      return {
        ...state,
        step: "intent",
        intentId,
        idempotencyKey,
        locked: true,
        attempts,
        log: append(
          state,
          {
            code: "intentCreated",
            tone: "info",
            params: { intent: intentId, key: idempotencyKey },
          },
          { code: "lockAcquired", tone: "info", params: { obligation: OBLIGATION } },
        ),
      };
    }

    case "advance": {
      const intent = state.intentId ?? "";
      if (state.step === "intent") {
        return {
          ...state,
          step: "checkout",
          log: append(state, { code: "checkoutCreated", tone: "info", params: { intent } }),
        };
      }
      if (state.step === "checkout") {
        const event = `evt_${intent}`;
        return {
          ...state,
          step: "webhook",
          processedEvents: [...state.processedEvents, event],
          log: append(state, { code: "webhookVerified", tone: "ok", params: { event } }),
        };
      }
      if (state.step === "webhook") {
        return {
          ...state,
          step: "reconciled",
          locked: false,
          log: append(
            state,
            { code: "reconciled", tone: "ok", params: { intent } },
            { code: "lockReleased", tone: "info", params: { obligation: OBLIGATION } },
            { code: "clientNotified", tone: "ok", params: { obligation: OBLIGATION } },
          ),
        };
      }
      return state;
    }

    case "replayWebhook": {
      if (state.step !== "reconciled" || !state.intentId) return state;
      const event = `evt_${state.intentId}`;
      // El evento ya se aplicó: se registra y se ignora (no cambia el estado del pago).
      return {
        ...state,
        log: append(state, { code: "duplicateIgnored", tone: "warn", params: { event } }),
      };
    }

    case "reset":
      return initialFlow;
  }
}

/** Pasos completados para la vista (los anteriores al actual y el actual si ya concilió). */
export function stepStatus(state: FlowState, step: (typeof STEPS)[number]) {
  if (state.step === "idle") return "pending" as const;
  const current = STEPS.indexOf(state.step as (typeof STEPS)[number]);
  const index = STEPS.indexOf(step);
  if (index < current || state.step === "reconciled") return "done" as const;
  if (index === current) return "active" as const;
  return "pending" as const;
}
