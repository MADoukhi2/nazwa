import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-1 text-amber-500", className)} dir="ltr">
      <Star size={size} fill="currentColor" strokeWidth={0} />
      <span className="text-foreground/80 text-xs font-medium tabular-nums">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
