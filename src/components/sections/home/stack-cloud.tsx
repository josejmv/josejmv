import type { StackItem } from "@content/schema";

import { Chip } from "@/components/ui/chip";

interface StackCloudProps {
  title: string;
  items: StackItem[];
}

/** Stack (Fusion): nube de tecnologías sobre una tarjeta con borde champagne. */
export function StackCloud({ title, items }: StackCloudProps) {
  return (
    <section
      aria-labelledby="stack-title"
      className="flex flex-col gap-4 rounded-card border border-accent-text/20 bg-linear-135 from-chip/60 to-surface to-60% p-7"
    >
      <h2 id="stack-title" className="font-mono text-xs font-normal text-muted">
        {title}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <Chip>{item.label}</Chip>
          </li>
        ))}
      </ul>
    </section>
  );
}
