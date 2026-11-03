import { cn } from "@/lib/cn";

import { AnimatedCounter } from "./animated-counter";

interface StatCardProps {
  value: number;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div className={cn("rounded-[18px] border border-border bg-surface p-5", className)}>
      <AnimatedCounter
        value={value}
        className="block font-display text-[34px] leading-tight font-semibold text-accent-text"
      />
      <p className="text-[13px] text-muted">{label}</p>
    </div>
  );
}
