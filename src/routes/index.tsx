import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { fetchAllProducts, categoryLabel } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { CategoryChip } from "@/components/CategoryChip";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { GridSkeleton, RailSkeleton } from "@/components/Skeletons";
import { ErrorState } from "@/components/EmptyState";
import { WORLDS, worldForCategory } from "@/lib/categories";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SimuMart — Home" },
      { name: "description", content: "Trending products, daily rewards, and unlockable worlds." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ar";
  const unlocks = useStore((s) => s.unlocks);
  const [q, setQ] = useState("");

  const query = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchAllProducts(),
    staleTime: 5 * 60_000,
  });

  const products = query.data ?? [];
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [q, products]);

  const trending = [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 12);
  const featured = [...filtered].sort(() => Math.random() - 0.5).slice(0, 8);

  const categories = useMemo(() => {
    const set = new Map<string, number>();
    products.forEach((p) => set.set(p.category, (set.get(p.category) ?? 0) + 1));
    return Array.from(set.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([slug]) => slug);
  }, [products]);

  return (
    <div className="px-4 pt-3 space-y-5">
      {/* Hero */}
      <section className="rounded-3xl p-5 bg-gradient-to-br from-foreground to-foreground/85 text-background relative overflow-hidden">
        <div className="absolute -right-8 -top-8 text-9xl opacity-10">🛒</div>
        <h1 className="font-display text-2xl font-bold leading-tight">{t("home.heroTitle")}</h1>
        <p className="text-sm opacity-80 mt-1.5 max-w-[80%]">{t("home.heroSub")}</p>
      </section>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground pointer-events-none" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("home.searchPlaceholder")}
          className="w-full h-12 rounded-2xl bg-card border border-border ps-10 pe-4 text-sm outline-none focus:border-foreground/40 transition"
        />
      </div>

      {/* Check-in */}
      <DailyCheckIn />

      {/* Worlds */}
      <section>
        <h2 className="font-display font-semibold mb-3">{t("home.categories")}</h2>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
          {WORLDS.map((w) => {
            const open = unlocks[w.id];
            const slug = w.categories[0] ?? "all";
            return (
              <Link
                key={w.id}
                to={open ? "/category/$slug" : "/unlock/$slug"}
                params={{ slug: open ? slug : w.id }}
                className="shrink-0 w-36 rounded-2xl border border-border bg-card p-3 active:scale-[0.98] transition"
              >
                <div className="text-3xl mb-1">{w.emoji}</div>
                <div className="font-semibold text-sm">
                  {lang === "ar" ? w.labelAr : w.labelEn}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {open ? t("home.open") : t("home.locked")}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 mt-3">
            {categories.slice(0, 12).map((slug) => {
              const w = worldForCategory(slug);
              const locked = !unlocks[w];
              return (
                <CategoryChip
                  key={slug}
                  slug={locked ? w : slug}
                  href={locked ? "/unlock/$slug" : "/category/$slug"}
                  label={categoryLabel(slug)}
                  locked={locked}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Featured rail */}
      <section>
        <h2 className="font-display font-semibold mb-3">{t("home.featured")}</h2>
        {query.isLoading ? (
          <RailSkeleton />
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : (
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1 snap-x">
            {featured.map((p) => (
              <div key={p.id} className="w-40 shrink-0 snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trending grid */}
      <section>
        <h2 className="font-display font-semibold mb-3">{t("home.trending")}</h2>
        {query.isLoading ? (
          <GridSkeleton />
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
