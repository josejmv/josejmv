"use client";

import { type ContactFormField, contactFormSchema, type OpportunityType } from "@content/contact-form";
import { useTranslations } from "next-intl";
import { type FormEvent, type ReactNode, useId, useRef, useState } from "react";

import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";

import { buildMailto } from "./build-mailto";
import { openMailto } from "./open-mailto";

interface ContactFormProps {
  email: string;
  opportunityTypes: { value: OpportunityType; label: string }[];
}

type Values = Record<ContactFormField, string>;

const EMPTY: Values = { name: "", email: "", company: "", type: "empleo", message: "" };
/** Orden visual de los campos: el foco va al primero con error. */
const FIELD_ORDER: ContactFormField[] = ["name", "email", "company", "type", "message"];

const inputClasses = cn(
  "w-full rounded-xl border border-text/12 bg-surface-2 px-4 text-[15px] text-text transition-colors",
  "placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
  "aria-invalid:border-danger-text aria-invalid:bg-danger-bg",
);

/**
 * Formulario de Contacto sin terceros (ADR 0005). Valida con Zod y, si todo está bien, abre la app
 * de correo del visitante con un `mailto:` ya redactado. No hace `fetch` ni guarda nada.
 */
export function ContactForm({ email, opportunityTypes }: ContactFormProps) {
  const t = useTranslations("ContactPage.form");
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ContactFormField, true>>>({});
  const [sent, setSent] = useState<{ name: string; url: string } | null>(null);

  const fieldId = (field: ContactFormField) => `${id}-${field}`;
  const errorId = (field: ContactFormField) => `${id}-${field}-error`;

  function update(field: ContactFormField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // El error de un campo desaparece en cuanto se corrige.
    if (errors[field] && contactFormSchema.shape[field].safeParse(value).success) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = contactFormSchema.safeParse(values);
    if (!result.success) {
      const invalid = new Set(
        result.error.issues.map((issue) => issue.path[0] as ContactFormField),
      );
      setErrors(Object.fromEntries([...invalid].map((field) => [field, true])));
      const first = FIELD_ORDER.find((field) => invalid.has(field))!;
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`)?.focus();
      return;
    }
    const data = result.data;
    const url = buildMailto(data, {
      to: email,
      subjectPrefix: t("subjectPrefix"),
      typeLabel: opportunityTypes.find((type) => type.value === data.type)!.label,
    });
    openMailto(url);
    setErrors({});
    setSent({ name: data.name, url });
    requestAnimationFrame(() => sentRef.current?.focus());
  }

  function reset() {
    setValues(EMPTY);
    setSent(null);
    requestAnimationFrame(() =>
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId("name"))}`)?.focus(),
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  /** `grow`: el campo ocupa el alto sobrante (el mensaje, para que la tarjeta no deje huecos). */
  function field(name: ContactFormField, label: string, input: ReactNode, grow = false) {
    return (
      <div className={cn("flex flex-col gap-2", grow && "flex-1")}>
        <label htmlFor={fieldId(name)} className="text-sm text-text-2">
          {label}
        </label>
        {input}
        {errors[name] && (
          <p id={errorId(name)} className="text-[13px] text-danger-text">
            {t(`errors.${name as "name" | "email" | "company" | "message"}`)}
          </p>
        )}
      </div>
    );
  }

  const a11y = (name: ContactFormField) => ({
    id: fieldId(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? errorId(name) : undefined,
  });

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-[999_1_560px] flex-col rounded-card border border-border bg-surface p-6 sm:p-8"
    >
      {sent ? (
        <div role="status" className="flex flex-col items-start gap-4 py-6">
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-full bg-success/15 text-success"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
            >
              <path d="m5 12 5 5 9-10" />
            </svg>
          </span>
          <h2
            id={`${id}-title`}
            ref={sentRef}
            tabIndex={-1}
            className="font-display text-2xl font-semibold outline-none"
          >
            {t("sentTitle", { name: sent.name })}
          </h2>
          <p className="max-w-[560px] text-[15px] leading-relaxed text-text-2">
            {t.rich("sentBody", {
              email,
              link: (chunks) => (
                <a
                  href={sent.url}
                  className="text-accent-text underline underline-offset-4 hover:no-underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <button
            type="button"
            onClick={reset}
            className={buttonClasses({ variant: "secondary", size: "lg", shape: "pill" })}
          >
            {t("again")}
          </button>
        </div>
      ) : (
        <>
          <h2 id={`${id}-title`} className="font-display text-2xl font-semibold">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-muted">{t("intro", { email })}</p>

          {hasErrors && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text"
            >
              {t("error")}
            </p>
          )}

          <form
            ref={formRef}
            noValidate
            onSubmit={submit}
            className="mt-6 flex flex-1 flex-col gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {field(
                "name",
                t("name"),
                <input
                  {...a11y("name")}
                  type="text"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={cn(inputClasses, "h-[46px]")}
                />,
              )}
              {field(
                "email",
                t("email"),
                <input
                  {...a11y("email")}
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={cn(inputClasses, "h-[46px]")}
                />,
              )}
              {field(
                "company",
                t("company"),
                <input
                  {...a11y("company")}
                  type="text"
                  autoComplete="organization"
                  value={values.company}
                  onChange={(e) => update("company", e.target.value)}
                  className={cn(inputClasses, "h-[46px]")}
                />,
              )}
              {field(
                "type",
                t("type"),
                <select
                  {...a11y("type")}
                  value={values.type}
                  onChange={(e) => update("type", e.target.value)}
                  className={cn(inputClasses, "h-[46px]")}
                >
                  {opportunityTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>,
              )}
            </div>
            {field(
              "message",
              t("message"),
              <textarea
                {...a11y("message")}
                rows={6}
                required
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                className={cn(inputClasses, "min-h-40 flex-1 resize-y py-3")}
              />,
              true,
            )}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-[11px] text-subtle">{t("note")}</p>
              <button
                type="submit"
                className={buttonClasses({ size: "lg", shape: "pill", className: "text-[15px]" })}
              >
                {t("submit")}
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
