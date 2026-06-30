import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { useStore, calcTotals } from "@/lib/store";
import { PriceTag } from "@/components/PriceTag";
import { QtyStepper } from "@/components/QtyStepper";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart } = useStore();
  const totals = calcTotals(cart);

  if (cart.length === 0) {
    return (
      <EmptyState
        emoji="🛒"
        title={t("cart.empty")}
        action={t("cart.keepShopping")}
        onAction={() => navigate({ to: "/" })}
      />
    );
  }

  return (
    <div className="px-4 pt-4 pb-40 space-y-4">
      <h1 className="font-display text-2xl font-bold">{t("cart.title")}</h1>

      <div className="space-y-2">
        {cart.map((item) => (
          <div key={item.productId} className="flex gap-3 bg-card border border-border rounded-2xl p-3">
            <Link to="/product/$id" params={{ id: item.productId }} className="shrink-0">
              <img src={item.thumbnail} alt={item.title} className="h-20 w-20 rounded-xl object-cover bg-muted" />
            </Link>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  aria-label="remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <PriceTag amount={item.price * item.qty} />
                <QtyStepper value={item.qty} onChange={(n) => updateQty(item.productId, n)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-card border border-border p-4 space-y-2 text-sm">
        <Row label={t("cart.subtotal")} value={<PriceTag amount={totals.subtotal} size="sm" />} />
        <Row
          label={t("cart.shipping")}
          value={
            totals.shipping === 0 ? (
              <span className="text-success font-semibold">{t("cart.freeShipping")}</span>
            ) : (
              <PriceTag amount={totals.shipping} size="sm" />
            )
          }
        />
        <Row label={t("cart.vat")} value={<PriceTag amount={totals.vat} size="sm" />} />
        <div className="h-px bg-border my-2" />
        <Row
          label={<span className="font-semibold text-base">{t("cart.total")}</span>}
          value={<PriceTag amount={totals.total} size="lg" />}
        />
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-16 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto">
          <Button className="w-full h-12" onClick={() => navigate({ to: "/checkout" })}>
            {t("cart.checkout")} · <PriceTag amount={totals.total} className="ms-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
