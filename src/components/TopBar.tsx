import { Link } from "@tanstack/react-router";
import { CoinBadge } from "./CoinBadge";
import { useStore } from "@/lib/store";

export function TopBar({ title, back }: { title?: string; back?: boolean }) {
  const coins = useStore((s) => s.wallet.coins);
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          {title ?? "SimuMart"}
        </Link>
        <Link to="/profile" aria-label="wallet">
          <CoinBadge amount={coins} size="sm" />
        </Link>
      </div>
    </header>
  );
}
