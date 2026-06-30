import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface Props {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceTag({ amount, className, size = "md" }: Props) {
  const sizes = {
    sm: "text-sm",
    md: "text-base font-semibold",
    lg: "text-2xl font-bold tracking-tight",
  };
  return (
    <span dir="ltr" className={cn(sizes[size], "tabular-nums", className)}>
      {formatPrice(amount)}
    </span>
  );
}
