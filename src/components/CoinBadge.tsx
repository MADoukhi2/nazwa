import { cn } from "@/lib/utils";

export function CoinBadge({ amount, className, size = "md" }: { amount: number; className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-xs px-2 h-6",
    md: "text-sm px-2.5 h-7",
    lg: "text-base px-3 h-9 font-semibold",
  };
  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex items-center gap-1 rounded-full coin-gradient text-coin-foreground font-medium tabular-nums",
        sizes[size],
        className
      )}
    >
      <span aria-hidden>●</span>
      {amount.toLocaleString()}
    </span>
  );
}
