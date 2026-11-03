import { describe, expect, it } from "vitest";

import { AREA_SLUGS, contactFormSchema, LOCALES } from "../../content/schema";
import { neighbors } from "@/lib/constellation";
import { getConstellation, getContact, getProfile } from "@/lib/content";

describe("getContact", () => {
  it.each(LOCALES)("reúne enlaces del perfil y textos de contacto (%s)", (locale) => {
    const contact = getContact(locale);
    expect(contact.email).toBe("josejmvasquez@gmail.com");
    expect(contact.channels.map((c) => c.id)).toEqual(["gmail", "linkedin", "github", "whatsapp"]);
    expect(contact.channels.filter((c) => c.primary).map((c) => c.id)).toEqual(["gmail"]);
    for (const channel of contact.channels) {
      expect(channel.href).toBe(
        getProfile(locale).contactLinks.find((l) => l.id === channel.id)!.href,
      );
      expect(channel.handle).toBeTruthy();
      expect(channel.description).toBeTruthy();
    }
    expect(contact.opportunityTypes.map((t) => t.value)).toEqual([
      "empleo",
      "contrato",
      "consultoria",
      "otro",
    ]);
  });

  it("la ubicación sale de HOME_* y los idiomas del perfil", () => {
    const rows = getContact("es").availability.rows;
    expect(rows.find((r) => r.key === "location")!.value).toBe(getProfile("es").location);
    expect(rows.find((r) => r.key === "languages")!.value).toBe("Español nativo · Inglés B2");
    expect(getContact("en").availability.rows.find((r) => r.key === "languages")!.value).toBe(
      "Spanish native · English B2",
    );
  });
});

describe("contactFormSchema", () => {
  const valid = {
    name: "Ana",
    email: "ana@example.com",
    company: "",
    type: "empleo",
    message: "Hola, quiero hablar de un rol.",
  };

  it("acepta un envío válido y recorta espacios", () => {
    const result = contactFormSchema.parse({ ...valid, name: "  Ana  " });
    expect(result.name).toBe("Ana");
  });

  it.each([
    ["name", { name: "A" }],
    ["name", { name: "x".repeat(81) }],
    ["email", { email: "ana@" }],
    ["company", { company: "x".repeat(81) }],
    ["message", { message: "corto" }],
    ["message", { message: "x".repeat(2001) }],
  ])("marca el campo %s", (field, patch) => {
    const result = contactFormSchema.safeParse({ ...valid, ...patch });
    expect(result.success).toBe(false);
    expect(result.error!.issues.map((i) => i.path[0])).toEqual([field]);
    expect(result.error!.issues[0].message).toBe(field);
  });
});

describe("constelación", () => {
  const graph = getConstellation("es");

  it("tiene un nodo por área y empieza en Backend & Pagos", () => {
    expect(graph.nodes.map((n) => n.id).sort()).toEqual([...AREA_SLUGS].sort());
    expect(graph.defaultSelected).toBe("backend-pagos");
    expect(graph.edges).toHaveLength(7);
  });

  it("neighbors devuelve los vecinos de cada nodo con la etiqueta de la conexión", () => {
    expect(neighbors(graph.edges, "backend-pagos")).toEqual([
      { id: "frontend", label: "Sitio de pagos (Next.js)" },
      { id: "devops", label: "Gate de CI" },
      { id: "compliance", label: "Motor KYC (FastAPI)" },
    ]);
    expect(neighbors(graph.edges, "leadership").map((n) => n.id)).toEqual([
      "ai-engineering",
      "frontend",
    ]);
    // Toda área tiene al menos una conexión.
    for (const node of graph.nodes) expect(node.neighbors.length).toBeGreaterThan(0);
  });

  it("los nodos traen título, stack (3-4) y métrica del área", () => {
    const compliance = graph.nodes.find((n) => n.id === "compliance")!;
    expect(compliance.tagline).toBe("AML/KYC automatizado (art. 492)");
    expect(compliance.metric.value).toBe("224");
    expect(compliance.tech.length).toBeGreaterThanOrEqual(3);
    expect(compliance.tech.length).toBeLessThanOrEqual(4);
    expect(compliance.neighbors[0]).toEqual({
      id: "backend-pagos",
      title: "Backend & Pagos",
      label: "Motor KYC (FastAPI)",
    });
  });
});
