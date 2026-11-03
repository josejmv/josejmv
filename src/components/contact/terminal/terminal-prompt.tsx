"use client";

import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

import type {
  CommandResult,
  NavTarget,
  OutputLine,
  TerminalAction,
  TerminalData,
  TerminalStrings,
} from "./commands";

type Href = Parameters<ReturnType<typeof useRouter>["push"]>[0];
type CommandsModule = typeof import("./commands");

interface TerminalPromptProps {
  data: TerminalData;
  strings: TerminalStrings;
  labels: { input: string; placeholder: string; output: string };
}

interface Entry {
  id: number;
  command: string;
  lines: OutputLine[];
}

const TONE: Record<NonNullable<OutputLine["tone"]>, string> = {
  muted: "text-subtle",
  accent: "text-accent-text",
  error: "text-text-2",
};

function hrefFor(to: NavTarget): Href {
  switch (to.kind) {
    case "home":
      return "/";
    case "experience":
      return "/experiencia";
    case "projects":
      return "/proyectos";
    case "project":
      return { pathname: "/proyectos/[slug]", params: { slug: to.slug } };
    case "area":
      return { pathname: "/areas/[slug]", params: { slug: to.slug } };
  }
}

/**
 * Prompt real de la terminal del hero. El intérprete (`commands.ts`) se descarga al primer foco,
 * así no suma JS al cargar la página. Historial con ↑↓, autocompletado con Tab y salida anunciada
 * a lectores de pantalla (`role="log"`).
 */
export function TerminalPrompt({ data, strings, labels }: TerminalPromptProps) {
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const nextId = useRef(0);
  const commands = useRef<Promise<CommandsModule> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { resolvedTheme, setTheme } = useTheme();

  const load = () => (commands.current ??= import("./commands"));

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries]);

  function perform(action: TerminalAction) {
    switch (action.type) {
      case "clear":
        setEntries([]);
        return;
      case "theme":
        setTheme(
          action.value === "toggle" ? (resolvedTheme === "light" ? "dark" : "light") : action.value,
        );
        return;
      case "locale": {
        const { locale: _ignored, ...routeParams } = params;
        void _ignored;
        router.replace({ pathname, params: routeParams } as unknown as Href, {
          locale: action.value,
        });
        return;
      }
      case "navigate":
        router.push(hrefFor(action.to));
        return;
      case "open":
        if (action.href.startsWith("mailto:")) window.location.href = action.href;
        else window.open(action.href, "_blank", "noopener,noreferrer");
        return;
    }
  }

  async function submit() {
    const command = value;
    setValue("");
    cursor.current = -1;
    if (command.trim()) history.current.unshift(command);
    const { run } = await load();
    const result: CommandResult = run(command, { data, strings });
    if (result.action?.type !== "clear") {
      setEntries((prev) => [...prev, { id: nextId.current++, command, lines: result.lines }]);
    }
    if (result.action) perform(result.action);
  }

  async function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      await submit();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (!history.current.length) return;
      event.preventDefault();
      const step = event.key === "ArrowUp" ? 1 : -1;
      cursor.current = Math.max(-1, Math.min(history.current.length - 1, cursor.current + step));
      setValue(cursor.current === -1 ? "" : history.current[cursor.current]);
    } else if (event.key === "Tab" && value.trim()) {
      // Solo intercepta Tab si hay algo que completar: con el input vacío, Tab sigue navegando.
      event.preventDefault();
      const { complete } = await load();
      setValue(complete(value, data));
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  }

  return (
    <>
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={labels.output}
        className={cn("max-h-56 overflow-y-auto", entries.length === 0 && "hidden")}
      >
        {entries.map((entry) => (
          <div key={entry.id} className="py-0.5">
            <p>
              <span aria-hidden="true" className="text-accent-text">
                ${" "}
              </span>
              {entry.command}
            </p>
            {entry.lines.map((line, index) => (
              <p
                key={index}
                className={cn("break-words whitespace-pre-wrap", line.tone && TONE[line.tone])}
              >
                {line.href ? (
                  <a
                    href={line.href}
                    target={line.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent-text"
                  >
                    {line.text}
                  </a>
                ) : (
                  line.text
                )}
              </p>
            ))}
          </div>
        ))}
      </div>

      <p className="flex items-center gap-2">
        <span aria-hidden="true" className="text-accent-text">
          $
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          onFocus={load}
          aria-label={labels.input}
          placeholder={labels.placeholder}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          // 16 px en móvil: iOS hace zoom al enfocar inputs con texto más chico.
          className="min-w-0 flex-1 bg-transparent font-mono text-base text-text caret-accent-text outline-none placeholder:text-subtle sm:text-[13px]"
        />
      </p>
    </>
  );
}
