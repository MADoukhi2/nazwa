import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore, cartCount } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { t } = useTranslation();
  const loc = useLocation();
  const cart = useStore((s) => s.cart);
  const count = cartCount(cart);

  const items = [
    { to: "/", icon: Home, label: t("nav.home"), match: (p: string) => p === "/" },
    { to: "/category/all", icon: Search, label: t("nav.search"), match: (p: string) => p.startsWith("/category") },
    { to: "/cart", icon: ShoppingBag, label: t("nav.cart"), match: (p: string) => p === "/cart", badge: count },
    { to: "/profile", icon: User, label: t("nav.profile"), match: (p: string) => p === "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto grid grid-cols-4">
        {items.map((it) => {
          const active = it.match(loc.pathname);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 h-16 text-[11px] transition-colors relative",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                {it.badge && it.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center">
                    {it.badge > 99 ? "99+" : it.badge}
                  </span>
                ) : null}
              </div>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
