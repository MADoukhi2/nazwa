import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, MapPin, ClipboardCheck, ChevronLeft } from "lucide-react";
import { useStore, calcTotals } from "@/lib/store";
import { PriceTag } from "@/components/PriceTag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, placeOrder } = useStore();
  const totals = calcTotals(cart);

  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({ fullName: "", phone: "", address: "", city: "Riyadh", country: "Saudi Arabia" });
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    navigate({ to: "/cart", replace: true });
    return null;
  }

  const steps = [t("checkout.step1"), t("checkout.step2"), t("checkout.step3")];

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => (step === 0 ? navigate({ to: "/cart" }) : setStep((s) => s - 1));

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handlePlace = () => {
    setSubmitting(true);
    // Pure UI simulation — no network request
    setTimeout(() => {
      const order = placeOrder();
      navigate({ to: "/checkout/success", search: { id: order.id } });
    }, 900);
  };

  return (
    <div className="px-4 pt-4 pb-32 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={back} className="h-9 w-9 grid place-items-center rounded-full bg-card border border-border">
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-display text-xl font-bold">{t("checkout.title")}</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2" dir="ltr">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 flex items-center gap-2">
            <div
              className={`h-7 w-7 rounded-full grid place-items-center text-xs font-bold ${
                i <= step ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < 2 && <div className={`flex-1 h-px ${i < step ? "bg-foreground" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 0 && (
        <section className="space-y-3">
          <SectionHeader icon={<MapPin size={16} />} title={t("checkout.step1")} />
          <Field label={t("checkout.fullName")}>
            <Input value={addr.fullName} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} />
          </Field>
          <Field label={t("checkout.phone")}>
            <Input inputMode="tel" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
          </Field>
          <Field label={t("checkout.address")}>
            <Input value={addr.address} onChange={(e) => setAddr({ ...addr, address: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("checkout.city")}>
              <Input value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
            </Field>
            <Field label={t("checkout.country")}>
              <Input value={addr.country} onChange={(e) => setAddr({ ...addr, country: e.target.value })} />
            </Field>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-3">
          <SectionHeader icon={<CreditCard size={16} />} title={t("checkout.step2")} />
          {/* Fake card preview */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-foreground to-foreground/80 text-background min-h-[170px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs opacity-70 uppercase tracking-widest">Simulation</span>
              <span className="text-sm font-bold">VIRTUAL</span>
            </div>
            <div className="font-mono text-lg tracking-widest">
              {card.number || "•••• •••• •••• ••••"}
            </div>
            <div className="flex justify-between text-xs opacity-80">
              <span>{card.name || t("checkout.cardName").toUpperCase()}</span>
              <span>{card.expiry || "MM/YY"}</span>
            </div>
          </div>

          <Field label={t("checkout.cardNumber")}>
            <Input
              inputMode="numeric"
              value={card.number}
              onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
              placeholder="4242 4242 4242 4242"
            />
          </Field>
          <Field label={t("checkout.cardName")}>
            <Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("checkout.expiry")}>
              <Input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExp(e.target.value) })} placeholder="12/29" />
            </Field>
            <Field label={t("checkout.cvv")}>
              <Input inputMode="numeric" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })} />
            </Field>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <SectionHeader icon={<ClipboardCheck size={16} />} title={t("checkout.step3")} />
          <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
            <div className="text-sm">
              <div className="text-muted-foreground text-xs mb-0.5">Ship to</div>
              <div className="font-medium">{addr.fullName || "—"}</div>
              <div className="text-muted-foreground">{addr.address}, {addr.city}, {addr.country}</div>
            </div>
            <div className="h-px bg-border" />
            <div className="text-sm">
              <div className="text-muted-foreground text-xs mb-0.5">Paying with</div>
              <div className="font-mono">•••• {card.number.replace(/\s/g, "").slice(-4) || "0000"}</div>
            </div>
          </div>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            {cart.map((i) => (
              <div key={i.productId} className="p-3 flex gap-3 items-center">
                <img src={i.thumbnail} alt="" className="h-12 w-12 rounded-lg object-cover bg-muted" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-1">{i.title}</div>
                  <div className="text-xs text-muted-foreground">× {i.qty}</div>
                </div>
                <PriceTag amount={i.price * i.qty} size="sm" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-card border border-border p-4 text-sm space-y-2">
            <Row label={t("cart.subtotal")} value={<PriceTag amount={totals.subtotal} size="sm" />} />
            <Row label={t("cart.shipping")} value={<PriceTag amount={totals.shipping} size="sm" />} />
            <Row label={t("cart.vat")} value={<PriceTag amount={totals.vat} size="sm" />} />
            <div className="h-px bg-border my-1" />
            <Row label={<span className="font-semibold">{t("cart.total")}</span>} value={<PriceTag amount={totals.total} size="lg" />} />
          </div>
        </section>
      )}

      <div className="fixed bottom-16 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto flex gap-2">
          {step > 0 && (
            <Button variant="outline" className="h-12 flex-1" onClick={back}>
              {t("checkout.back")}
            </Button>
          )}
          {step < 2 ? (
            <Button className="h-12 flex-[2]" onClick={next}>
              {t("checkout.next")}
            </Button>
          ) : (
            <Button className="h-12 flex-[2]" onClick={handlePlace} disabled={submitting}>
              {submitting ? "..." : `${t("checkout.place")} · `}
              {!submitting && <PriceTag amount={totals.total} className="ms-1" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-muted grid place-items-center">{icon}</div>
      <h2 className="font-semibold">{title}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
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
