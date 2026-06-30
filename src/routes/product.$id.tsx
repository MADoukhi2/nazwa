import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Zap, ChevronLeft } from "lucide-react";

import { fetchAllProducts, categoryLabel } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { PriceTag } from "@/components/PriceTag";
import { RatingStars } from "@/components/RatingStars";
import { QtyStepper } from "@/components/QtyStepper";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { SEED_REVIEWS } from "@/lib/seed";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addToCart = useStore((s) => s.addToCart);
  const cart = useStore((s) => s.cart);

  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const query = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchAllProducts(),
    staleTime: 5 * 60_000,
  });

  const product = useMemo(
    () => query.data?.find((p) => p.id === id),
    [query.data, id]
  );

  const related = useMemo(() => {
    if (!product || !query.data) return [];
    return query.data
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 6);
  }, [product, query.data]);

  if (query.isLoading) {
    return <div className="p-4 space-y-3"><div className="aspect-square skeleton-shimmer rounded-2xl" /></div>;
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground mb-4">{t("product.notFound")}</p>
        <Link to="/" className="text-accent underline">{t("product.backHome")}</Link>
      </div>
    );
  }

  const inCart = cart.find((c) => c.productId === product.id);

  const handleAdd = () => {
    addToCart(product, qty);
    toast.success(t("product.addedToCart", { title: product.title }));
  };
  const handleBuy = () => {
    addToCart(product, qty);
    navigate({ to: "/checkout" });
  };

  return (
    <div className="pb-32">
      {/* Gallery */}
      <div className="relative bg-muted/40">
        <button
          onClick={() => navigate({ to: "/" })}
          className="absolute top-3 start-3 z-10 h-9 w-9 rounded-full bg-background/90 backdrop-blur grid place-items-center shadow-sm"
          aria-label="back"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[imgIdx] ?? product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar p-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 ${i === imgIdx ? "border-foreground" : "border-transparent opacity-70"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-4 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {categoryLabel(product.category)}
            </span>
            <RatingStars value={product.rating} />
          </div>
          <h1 className="font-display text-xl font-bold leading-tight mb-2">{product.title}</h1>
          <PriceTag amount={product.price} size="lg" />
        </div>

        {/* Qty */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("product.quantity")}</span>
          <QtyStepper value={qty} onChange={setQty} />
        </div>

        {/* Description */}
        <section>
          <h2 className="font-semibold text-sm mb-2">{t("product.description")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description || t("product.noDescription")}
          </p>
        </section>

        {/* Reviews */}
        <section>
          <h2 className="font-semibold text-sm mb-3">{t("product.reviews")}</h2>
          <div className="space-y-3">
            {SEED_REVIEWS.slice(0, 3).map((r, i) => (
              <div key={i} className="rounded-xl bg-card border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{r.name}</span>
                  <RatingStars value={r.rating} />
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="font-semibold text-sm mb-3">{t("product.related")}</h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4">
              {related.map((p) => (
                <div key={p.id} className="w-36 shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-16 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto flex gap-2">
          <Button variant="outline" className="flex-1 h-12" onClick={handleAdd}>
            <ShoppingBag size={16} className="me-1.5" />
            {inCart ? `${t("product.inCart")} · ${inCart.qty}` : t("product.addToCart")}
          </Button>
          <Button className="flex-1 h-12" onClick={handleBuy}>
            <Zap size={16} className="me-1.5" />
            {t("product.buyNow")}
          </Button>
        </div>
      </div>
    </div>
  );
}
