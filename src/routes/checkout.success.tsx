import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CoinBadge } from "@/components/CoinBadge";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({ id: z.string().optional() }),
  component: SuccessPage,
});

function SuccessPage() {
  const { t } = useTranslation();
  const { id } = Route.useSearch();
  const orders = useStore((s) => s.orders);
  const order = orders.find((o) => o.id === id) ?? orders[0];

  useEffect(() => {
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 }, colors: ["#F25C2A", "#E8B341", "#16A34A", "#fff"] });
  }, []);

  const eta = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toLocaleDateString();

  return (
    <div className="px-6 pt-10 pb-32 text-center max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="mx-auto h-20 w-20 rounded-full bg-success/15 text-success grid place-items-center mb-5"
      >
        <CheckCircle2 size={48} strokeWidth={2.2} />
      </motion.div>
      <h1 className="font-display text-2xl font-bold mb-2">{t("checkout.successTitle")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("checkout.successSub")}</p>

      <div className="rounded-2xl bg-card border border-border p-4 text-start space-y-2 mb-4">
        <div className="text-xs text-muted-foreground">{t("checkout.orderNumber", { n: order?.id ?? "------" })}</div>
        <div className="text-sm">{t("checkout.eta", { date: eta })}</div>
      </div>

      <div className="mb-8">
        <CoinBadge amount={50} size="lg" />
        <p className="text-xs text-muted-foreground mt-2">{t("checkout.coinsEarned", { n: 50 })}</p>
      </div>

      <Button asChild className="w-full h-12">
        <Link to="/">{t("checkout.continue")}</Link>
      </Button>
    </div>
  );
}
