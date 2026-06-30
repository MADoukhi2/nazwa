import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Package, ClipboardCheck, ChefHat, Truck, MapPin } from "lucide-react";
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

  // Tracker progresses through 4 stages but NEVER reaches stage 5 (arrived).
  // Stages: 0=received, 1=accepted, 2=preparing, 3=on the way (stuck here forever)
  const [stage, setStage] = useState(0);

  useEffect(() => {
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.4 }, colors: ["#F25C2A", "#E8B341", "#16A34A", "#fff"] });
    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setStage(2), 2800);
    const t3 = setTimeout(() => setStage(3), 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const steps = [
    { key: "trackReceived", icon: ClipboardCheck },
    { key: "trackAccepted", icon: Package },
    { key: "trackPreparing", icon: ChefHat },
    { key: "trackOnWay", icon: Truck },
    { key: "trackArrived", icon: MapPin },
  ] as const;

  // Truck position oscillates between 60% and 85% — never reaches 100%
  const truckProgress = stage === 3 ? 0.78 : (stage + 1) * 0.18;

  return (
    <div className="px-5 pt-8 pb-32 max-w-md mx-auto">
      {/* Payment confirmed hero */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mx-auto h-20 w-20 rounded-full bg-success/15 text-success grid place-items-center mb-4"
        >
          <CheckCircle2 size={48} strokeWidth={2.2} />
        </motion.div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-display text-2xl font-bold"
        >
          {t("checkout.paymentConfirmed")}
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-sm text-muted-foreground mt-1"
        >
          {t("checkout.orderOnWay")}
        </motion.p>
      </div>

      {/* Order meta */}
      <div className="rounded-2xl bg-card border border-border p-4 mb-5 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {t("checkout.orderNumber", { n: order?.id ?? "------" })}
          </div>
          <div className="text-sm mt-0.5">{t("checkout.etaShort")}</div>
        </div>
        <CoinBadge amount={50} size="sm" />
      </div>

      {/* Tracker */}
      <div className="rounded-2xl bg-card border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">{t("checkout.tracking")}</h2>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
        </div>

        {/* Truck track */}
        <div className="relative h-12 mb-5">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              animate={{ width: `${truckProgress * 100}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
            />
          </div>
          <motion.div
            animate={{
              left: `${truckProgress * 100}%`,
              x: stage === 3 ? [-4, 4, -4] : 0,
            }}
            transition={{
              left: { duration: 0.9, ease: "easeOut" },
              x: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          >
            <div className="h-9 w-9 rounded-full bg-orange-500 text-white grid place-items-center shadow-lg shadow-orange-500/40">
              <Truck size={18} />
            </div>
          </motion.div>
          <div className="absolute end-0 top-1/2 -translate-y-1/2 translate-x-1/2">
            <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground grid place-items-center">
              <MapPin size={14} />
            </div>
          </div>
        </div>

        {/* Step list */}
        <ol className="space-y-3">
          {steps.map((s, i) => {
            const reached = i <= stage;
            const active = i === stage;
            const Icon = s.icon;
            return (
              <li key={s.key} className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: active ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
                  className={`h-8 w-8 rounded-full grid place-items-center shrink-0 ${
                    reached ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon size={15} />
                </motion.div>
                <span
                  className={`text-sm ${
                    reached ? "font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t(`checkout.${s.key}`)}
                </span>
                {active && (
                  <span className="ms-auto text-[10px] font-semibold text-success">●</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <Button asChild className="w-full h-12">
        <Link to="/">{t("checkout.continue")}</Link>
      </Button>
    </div>
  );
}
