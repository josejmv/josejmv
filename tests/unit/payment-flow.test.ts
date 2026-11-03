import { describe, expect, it } from "vitest";

import {
  type FlowAction,
  flowReducer,
  type FlowState,
  initialFlow,
  stepStatus,
} from "@/components/areas/backend/payment-flow";

const run = (...actions: FlowAction[]): FlowState => actions.reduce(flowReducer, initialFlow);
const advance: FlowAction = { type: "advance" };
const pay: FlowAction = { type: "pay" };

describe("payment flow", () => {
  it("recorre intent → checkout → webhook → conciliado y libera el lock", () => {
    const state = run(pay, advance, advance, advance);
    expect(state.step).toBe("reconciled");
    expect(state.locked).toBe(false);
    expect(state.log.map((e) => e.code)).toEqual([
      "intentCreated",
      "lockAcquired",
      "checkoutCreated",
      "webhookVerified",
      "reconciled",
      "lockReleased",
      "clientNotified",
    ]);
  });

  it("doble clic: el segundo pago devuelve el mismo intento con la misma key", () => {
    const state = run(pay, pay);
    expect(state.attempts).toBe(1);
    expect(state.intentId).toBe("pi_0001");
    const replay = state.log.at(-1)!;
    expect(replay.code).toBe("idempotentReplay");
    expect(replay.params).toEqual({ intent: "pi_0001", key: "idem-OBL-1042-1" });
  });

  it("no cobra dos veces una obligación ya pagada", () => {
    const state = run(pay, advance, advance, advance, pay);
    expect(state.attempts).toBe(1);
    expect(state.log.at(-1)!.code).toBe("alreadyPaid");
  });

  it("un webhook reenviado se registra y se ignora", () => {
    const before = run(pay, advance, advance, advance);
    const after = flowReducer(before, { type: "replayWebhook" });
    expect(after.step).toBe("reconciled");
    expect(after.processedEvents).toEqual(before.processedEvents);
    expect(after.log.at(-1)!.code).toBe("duplicateIgnored");
  });

  it("el log es append-only con secuencia creciente", () => {
    const state = run(pay, pay, advance);
    expect(state.log.map((e) => e.seq)).toEqual([1, 2, 3, 4]);
  });

  it("marca el estado de cada paso para la vista", () => {
    const state = run(pay, advance);
    expect(stepStatus(state, "intent")).toBe("done");
    expect(stepStatus(state, "checkout")).toBe("active");
    expect(stepStatus(state, "webhook")).toBe("pending");
  });
});
