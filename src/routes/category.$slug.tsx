import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchAllProducts, categoryLabel } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { CategoryChip } from "@/components/CategoryChip";
import { GridSkeleton } from "@/components/Skeletons";
import { ErrorState, EmptyState } from "@/components/EmptyState";
import { worldForCategory } from "@/lib/categories";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const unlocks = useStore((s) => s.unlocks);

  const query = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchAllProducts(),
    staleTime: 5 * 60_000,
  });

  const products = query.data ?? [];

  // Redirect if locked
  useEffect(() => {
    if (slug === "all") return;
    const w = worldForCategory(slug);
    if (!unlocks[w]) {
      navigate({ to: "/unlock/$slug", params: { slug: w }, replace: true });
    }
  }, [slug, unlocks, navigate]);

  const items = useMemo(() => {
    if (slug === "all") return products;
    return products.filter((p) => p.category === slug);
  }, [slug, products]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const w = worldForCategory(p.category);
      if (unlocks[w]) set.add(p.category);
    });
    return Array.from(set);
  }, [products, unlocks]);

  return (
    <div className="px-4 pt-3 space-y-4">
      <h1 className="font-display text-2xl font-bold">
        {slug === "all" ? t("category.allProducts") : categoryLabel(slug)}
      </h1>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
        <CategoryChip slug="all" label={t("category.all")} active={slug === "all"} />
        {categories.map((c) => (
          <CategoryChip key={c} slug={c} label={categoryLabel(c)} active={slug === c} />
        ))}
      </div>

      {query.isLoading ? (
        <GridSkeleton n={8} />
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title={t("category.noneTitle")}
          subtitle={t("category.noneSub")}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
