import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CoinBadge } from "./CoinBadge";
import { useStore } from "@/lib/store";
import logo from "@/assets/nazwa-logo.png.asset.json";

export function TopBar({ title, back: _back }: { title?: string; back?: boolean }) {
  const { t } = useTranslation();
  const coins = useStore((s) => s.wallet.coins);
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 leading-tight">
          <img src={logo.url} alt="" className="h-8 w-8 object-contain" />
          <span className="font-display text-lg font-bold tracking-tight">
            {title ?? t("app.name")}
          </span>
        </Link>
        <Link to="/profile" aria-label="wallet">
          <CoinBadge amount={coins} size="sm" />
        </Link>
      </div>
    </header>
  );
}
