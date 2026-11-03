/**
 * Intérprete de la terminal del hero. Módulo puro (sin React ni Next): recibe la línea escrita y
 * devuelve las líneas de salida y, si aplica, una acción que ejecuta el componente (navegar,
 * cambiar tema o idioma, abrir un enlace, limpiar). Se carga de forma diferida al enfocar el input.
 */

export type Locale = "es" | "en";

export interface TerminalData {
  locale: Locale;
  name: string;
  role: string;
  location: string;
  summary: string;
  experience: { period: string; role: string; company: string }[];
  stack: string[];
  areas: { slug: string; title: string }[];
  projects: { slug: string; title: string }[];
  contacts: { id: string; label: string; href: string }[];
}

/** Textos de `messages/*.json → Terminal`, sin formatear: los `{placeholders}` se rellenan aquí. */
export interface TerminalStrings {
  help: {
    title: string;
    commands: Record<string, string>;
    eggsTitle: string;
    /** Easter eggs: comando → descripción. Se listan tal cual, para que se descubran. */
    eggs: Record<string, string>;
  };
  notFound: string;
  noSuchPath: string;
  navigating: string;
  opening: string;
  unknownChannel: string;
  contactTitle: string;
  themeSet: string;
  themeUsage: string;
  langSet: string;
  langUsage: string;
  sudo: string[];
  sudoDenied: string;
  rm: string;
  exit: string;
  lsUsage: string;
}

export type NavTarget =
  | { kind: "home" }
  | { kind: "experience" }
  | { kind: "projects" }
  | { kind: "project"; slug: string }
  | { kind: "areas" }
  | { kind: "area"; slug: string }
  | { kind: "contact" };

export type TerminalAction =
  | { type: "navigate"; to: NavTarget }
  | { type: "theme"; value: "dark" | "light" | "toggle" }
  | { type: "locale"; value: Locale }
  | { type: "open"; href: string }
  | { type: "clear" };

export interface OutputLine {
  text: string;
  tone?: "muted" | "accent" | "error";
  href?: string;
}

export interface CommandResult {
  lines: OutputLine[];
  action?: TerminalAction;
}

interface Context {
  data: TerminalData;
  strings: TerminalStrings;
}

export const COMMANDS = [
  "help",
  "whoami",
  "experience",
  "skills",
  "ls",
  "cd",
  "contact",
  "theme",
  "lang",
  "pwd",
  "echo",
  "date",
  "clear",
] as const;

/** Alias en español y atajos habituales de shell. */
const ALIASES: Record<string, string> = {
  ayuda: "help",
  "?": "help",
  experiencia: "experience",
  stack: "skills",
  habilidades: "skills",
  contacto: "contact",
  open: "contact",
  tema: "theme",
  idioma: "lang",
  limpiar: "clear",
  cls: "clear",
};

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);

/** Nombres de carpeta públicos por idioma (coinciden con las rutas localizadas). */
function dirs(locale: Locale) {
  return locale === "es"
    ? { projects: "proyectos", experience: "experiencia", contact: "contacto" }
    : { projects: "projects", experience: "experience", contact: "contact" };
}

/** Resuelve un path de `cd` a un destino del sitio. */
export function resolvePath(raw: string, data: TerminalData): NavTarget | null {
  const path = raw
    .trim()
    .replace(/^~\/?|^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
  if (path === "" || path === "~" || path === ".." || path === ".") return { kind: "home" };
  const [head, slug, ...extra] = path.split("/");
  if (extra.length) return null;
  if (head === "experiencia" || head === "experience") return slug ? null : { kind: "experience" };
  if (head === "proyectos" || head === "projects") {
    if (!slug) return { kind: "projects" };
    return data.projects.some((p) => p.slug === slug) ? { kind: "project", slug } : null;
  }
  if (head === "areas") {
    if (!slug) return { kind: "areas" };
    return data.areas.some((a) => a.slug === slug) ? { kind: "area", slug } : null;
  }
  if (head === "contacto" || head === "contact") return slug ? null : { kind: "contact" };
  return null;
}

function list(items: string[]): OutputLine[] {
  return [{ text: items.join("  ") }];
}

function ls(arg: string, { data, strings }: Context): CommandResult {
  const d = dirs(data.locale);
  const target = arg.replace(/\/+$/, "").toLowerCase();
  if (!target) return { lines: list(["areas/", `${d.projects}/`, d.experience, d.contact]) };
  if (target === "areas") return { lines: list(data.areas.map((a) => a.slug)) };
  if (target === "proyectos" || target === "projects") {
    return { lines: list(data.projects.map((p) => p.slug)) };
  }
  return { lines: [{ text: strings.lsUsage, tone: "error" }] };
}

function contact(arg: string, { data, strings }: Context): CommandResult {
  const id = arg.replace(/^--?/, "").toLowerCase();
  if (!id || id === "list") {
    return {
      lines: [
        { text: strings.contactTitle, tone: "muted" },
        ...data.contacts.map((c) => ({ text: `${c.id.padEnd(9)} ${c.label}`, href: c.href })),
      ],
    };
  }
  const channel = data.contacts.find((c) => c.id === id || c.label.toLowerCase() === id);
  if (!channel) {
    return {
      lines: [
        {
          text: fill(strings.unknownChannel, {
            id,
            list: data.contacts.map((c) => c.id).join(", "),
          }),
          tone: "error",
        },
      ],
    };
  }
  return {
    lines: [{ text: fill(strings.opening, { label: channel.label }), tone: "accent" }],
    action: { type: "open", href: channel.href },
  };
}

/** Ejecuta una línea. Nunca lanza: lo desconocido responde con un mensaje. */
export function run(input: string, ctx: Context): CommandResult {
  const { data, strings } = ctx;
  const line = input.trim();
  if (!line) return { lines: [] };

  // Easter eggs (antes de separar argumentos: dependen de la línea completa).
  if (/^sudo\b/i.test(line)) {
    return /^sudo\s+(hire|contrata(r)?)\b/i.test(line)
      ? {
          lines: [
            ...strings.sudo.map((text, i) => ({
              text,
              tone: i === 0 ? ("muted" as const) : ("accent" as const),
            })),
            // Todos los canales, con Gmail (primario) primero.
            ...data.contacts.map((c) => ({ text: c.label, href: c.href })),
          ],
        }
      : { lines: [{ text: strings.sudoDenied, tone: "error" }] };
  }
  if (/^rm\s+-[a-z]*r[a-z]*f?\b|^rm\s+-[a-z]*f[a-z]*r/i.test(line)) {
    return { lines: [{ text: strings.rm, tone: "error" }] };
  }

  const [rawCommand, ...rest] = line.split(/\s+/);
  const arg = rest.join(" ");
  const command = ALIASES[rawCommand.toLowerCase()] ?? rawCommand.toLowerCase();

  switch (command) {
    case "help":
      return {
        lines: [
          { text: strings.help.title, tone: "muted" },
          ...COMMANDS.map((c) => ({ text: `${c.padEnd(15)} ${strings.help.commands[c] ?? ""}` })),
          { text: strings.help.eggsTitle, tone: "muted" },
          ...Object.entries(strings.help.eggs).map(([command, description]) => ({
            text: `${command.padEnd(15)} ${description}`,
            tone: "accent" as const,
          })),
        ],
      };
    case "whoami":
      return {
        lines: [
          { text: `${data.name} — ${data.role}`, tone: "accent" },
          { text: data.location, tone: "muted" },
          { text: data.summary },
        ],
      };
    case "experience":
      return {
        lines: data.experience.map((e) => ({
          text: `${e.period.padEnd(19)} ${e.role} @ ${e.company}`,
        })),
      };
    case "skills":
      return { lines: list(data.stack) };
    case "ls":
      return ls(arg, ctx);
    case "cd": {
      const to = resolvePath(arg, data);
      if (!to) return { lines: [{ text: fill(strings.noSuchPath, { path: arg }), tone: "error" }] };
      return {
        lines: [{ text: fill(strings.navigating, { path: arg || "~" }), tone: "accent" }],
        action: { type: "navigate", to },
      };
    }
    case "contact":
      return contact(arg, ctx);
    case "theme": {
      const value = arg.toLowerCase();
      if (value && value !== "dark" && value !== "light") {
        return { lines: [{ text: strings.themeUsage, tone: "error" }] };
      }
      return {
        lines: [{ text: fill(strings.themeSet, { value: value || "toggle" }), tone: "accent" }],
        action: { type: "theme", value: (value || "toggle") as "dark" | "light" | "toggle" },
      };
    }
    case "lang": {
      const value = arg.toLowerCase();
      if (value !== "es" && value !== "en") {
        return { lines: [{ text: strings.langUsage, tone: "error" }] };
      }
      return {
        lines: [{ text: fill(strings.langSet, { value }), tone: "accent" }],
        action: { type: "locale", value },
      };
    }
    case "clear":
      return { lines: [], action: { type: "clear" } };
    case "pwd":
      return { lines: [{ text: "~/josejmv" }] };
    case "echo":
      return { lines: [{ text: arg }] };
    case "date":
      return { lines: [{ text: new Date().toLocaleString(data.locale) }] };
    case "exit":
    case "logout":
      return { lines: [{ text: strings.exit, tone: "muted" }] };
    default:
      return {
        lines: [{ text: fill(strings.notFound, { cmd: rawCommand }), tone: "error" }],
      };
  }
}

/** Autocompletado con Tab: comandos y, tras `cd`/`ls`/`contact`, sus argumentos. */
export function complete(input: string, data: TerminalData): string {
  const match = /^(\S*)(\s+(.*))?$/.exec(input);
  if (!match) return input;
  const [, head, , tail] = match;
  if (tail === undefined) {
    const options = COMMANDS.filter((c) => c.startsWith(head.toLowerCase()));
    return options.length === 1 ? `${options[0]} ` : input;
  }
  const d = dirs(data.locale);
  const candidates =
    head === "contact"
      ? data.contacts.map((c) => c.id)
      : head === "cd" || head === "ls"
        ? [
            "areas/",
            `${d.projects}/`,
            d.experience,
            d.contact,
            ...data.areas.map((a) => `areas/${a.slug}`),
            ...data.projects.map((p) => `${d.projects}/${p.slug}`),
          ]
        : [];
  const options = candidates.filter((c) => c.startsWith(tail.toLowerCase()));
  if (options.length === 0) return input;
  if (options.length === 1) return `${head} ${options[0]}`;
  // Prefijo común de las opciones.
  let prefix = options[0];
  for (const option of options) {
    while (!option.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return `${head} ${prefix.length > tail.length ? prefix : tail}`;
}
