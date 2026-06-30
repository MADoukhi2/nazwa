import { Flame } from "lucide-react";

export function StreakFlame({ days }: { days: number }) {
  const active = days > 0;
  return (
    <div className="inline-flex items-center gap-1.5">
      <Flame
        size={18}
        className={active ? "text-accent" : "text-muted-foreground"}
        fill={active ? "currentColor" : "none"}
      />
      <span className="font-semibold tabular-nums">{days}</span>
    </div>
  );
}
