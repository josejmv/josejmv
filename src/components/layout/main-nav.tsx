"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

import { NAV_ITEMS, type NavKey } from "./nav-items";

/** Navegación principal de desktop. Client solo para marcar la sección activa. */
interface MainNavProps {
  labels: Record<NavKey, string>;
  label: string;
  className?: string;
}

export function MainNav({ labels, label, className }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1 lg:gap-2">
        {NAV_ITEMS.map((item) => {
          const active = item.match?.(pathname) ?? false;
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center rounded-pill px-2.5 text-sm transition-colors lg:px-3",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
                  active ? "text-text" : "text-muted hover:text-text",
                )}
              >
                {labels[item.key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
