import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  label: string;
  emoji?: string;
  locked?: boolean;
  active?: boolean;
  href?: string;
}

export function CategoryChip({ slug, label, emoji, locked, active, href }: Props) {
  const cls = cn(
    "shrink-0 inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full border text-sm font-medium transition-colors whitespace-nowrap",
    active
      ? "bg-foreground text-background border-foreground"
      : "bg-card border-border text-foreground/80 hover:bg-muted"
  );
  return (
    <Link to={href ?? "/category/$slug"} params={{ slug }} className={cls}>
      {emoji && <span className="text-base">{emoji}</span>}
      <span>{label}</span>
      {locked && <Lock size={12} className="opacity-60" />}
    </Link>
  );
}
