import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center bg-muted rounded-full p-1 gap-1" dir="ltr">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-8 w-8 rounded-full bg-card border border-border grid place-items-center active:scale-95 transition"
        aria-label="decrease"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="h-8 w-8 rounded-full bg-card border border-border grid place-items-center active:scale-95 transition"
        aria-label="increase"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
