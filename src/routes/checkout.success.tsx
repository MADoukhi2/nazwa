import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Package,
  ClipboardCheck,
  ChefHat,
  Truck,
  MapPin,
  ChevronDown,
  PartyPopper,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CoinBadge } from "@/components/CoinBadge";
import { useStore } from "@/lib/store";
import { playOrderArrived } from "@/lib/sfx";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({ id: z.string().optional() }),
  component: SuccessPage,
});

// How long (ms from order.placedAt) each tracking stage takes to reach,
// so the tracker actually finishes instead of stalling forever, and so
// reopening an order later in Profile shows real, consistent progress.
const STAGE_AT = [0, 4000, 9500, 16000, 26000] as const; // received, accepted, preparing, onWay, arrived
const TOTAL_MS = STAGE_AT[STAGE_AT.length - 1];

function stageForElapsed(elapsed: number) {
  let stage = 0;
  for (let i = STAGE_AT.length - 1; i >= 0; i--) {
    if (elapsed >= STAGE_AT[i]) {
      stage = i;
      break;
    }
  }
  return stage;
}

const STEPS = [
  { key: "trackReceived", icon: ClipboardCheck },
  { key: "trackAccepted", icon: Package },
  { key: "trackPreparing", icon: ChefHat },
  { key: "trackOnWay", icon: Truck },
  { key: "trackArrived", icon: MapPin },
] as const;

function SuccessPage() {
  const { t } = useTranslation();
  const { id } = Route.useSearch();
  const orders = useStore((s) => s.orders);
  const order = orders.find((o) => o.id === id) ?? orders[0];

  const elapsedAtMount = order ? Date.now() - order.placedAt : 0;
  // If we land here more than a few seconds after the order was placed
  // (e.g. reopened from Profile > Recent orders), skip the payment-tick
  // moment and the cart-clear flash, and go straight to the live tracker.
  const isFreshPayment = elapsedAtMount < 4000;

  const [tickShown, setTickShown] = useState(isFreshPayment);
  const [showTracker, setShowTracker] = useState(!isFreshPayment);
  const [stage, setStage] = useState(() => stageForElapsed(Math.max(elapsedAtMount, 0)));
  const trackerRef = useRef<HTMLDivElement>(null);
  const arrivedSoundPlayed = useRef(stage >= 4);

  // Fire confetti once, right at the payment-confirmed moment.
  useEffect(() => {
    if (!isFreshPayment) return;
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.35 }, colors: ["#F25C2A", "#E8B341", "#16A34A", "#fff"] });
  }, [isFreshPayment]);

  // Auto-reveal the tracker a beat after the tick, in case the user doesn't tap the button.
  useEffect(() => {
    if (!isFreshPayment || showTracker) return;
    const tmr = setTimeout(() => revealTracker(), 1900);
    return () => clearTimeout(tmr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFreshPayment, showTracker]);

  // Advance the real-time stage while the tracker is visible and not yet arrived.
  useEffect(() => {
    if (!showTracker || !order || stage >= 4) return;
    const iv = setInterval(() => {
      const elapsed = Date.now() - order.placedAt;
      setStage(stageForElapsed(elapsed));
    }, 400);
    return () => clearInterval(iv);
  }, [showTracker, order, stage]);

  useEffect(() => {
    if (stage >= 4 && !arrivedSoundPlayed.current) {
      arrivedSoundPlayed.current = true;
      playOrderArrived();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.45 }, colors: ["#16A34A", "#E8B341", "#fff"] });
    }
  }, [stage]);

  const revealTracker = () => {
    setShowTracker(true);
    requestAnimationFrame(() => {
      trackerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const elapsedNow = order ? Date.now() - order.placedAt : 0;
  const truckProgress = useMemo(() => Math.min(Math.max(elapsedNow, 0) / TOTAL_MS, 1), [elapsedNow, stage]);
  const arrived = stage >= 4;

  return (
    <div className="px-5 pt-8 pb-32 max-w-md mx-auto">
      {/* Payment confirmed hero — shown first, on its own */}
      {tickShown && (
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
            {showTracker ? t("checkout.orderOnWay") : t("checkout.gettingReady")}
          </motion.p>

          {!showTracker && (
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              whileTap={{ scale: 0.97 }}
              onClick={revealTracker}
              className="mt-5 inline-flex items-center gap-1.5 h-11 px-5 rounded-full text-sm font-semibold text-white shadow-lg active:scale-[0.98] transition"
              style={{ backgroundColor: "#F25C2A" }}
            >
              <Truck size={16} />
              {t("checkout.trackButton")}
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <ChevronDown size={15} />
              </motion.span>
            </motion.button>
          )}
        </div>
      )}

      {/* Order meta */}
      <div className="rounded-2xl bg-card border border-border p-4 mb-5 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {t("checkout.orderNumber", { n: order?.id ?? "------" })}
          </div>
          <div className="text-sm mt-0.5">
            {arrived ? t("checkout.trackArrived") : t("checkout.etaShort")}
          </div>
        </div>
        <CoinBadge amount={50} size="sm" />
      </div>

      {/* Tracker — revealed after the tick, or immediately for older orders */}
      <AnimatePresence>
        {showTracker && (
          <motion.div
            ref={trackerRef}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-2xl bg-card border border-border p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm">{t("checkout.tracking")}</h2>
              {arrived ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                  <PartyPopper size={13} /> {t("checkout.trackArrived")}
                </span>
              ) : (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
              )}
            </div>

            {/* Truck track */}
            <div className="relative h-12 mb-5">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  animate={{ width: `${truckProgress * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
                />
              </div>
              <motion.div
                animate={{
                  left: `${truckProgress * 100}%`,
                  x: !arrived ? [-4, 4, -4] : 0,
                }}
                transition={{
                  left: { duration: 0.5, ease: "easeOut" },
                  x: { duration: 1.4, repeat: arrived ? 0 : Infinity, ease: "easeInOut" },
                }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              >
                <div
                  className={`h-9 w-9 rounded-full text-white grid place-items-center shadow-lg ${
                    arrived ? "bg-success shadow-success/40" : "bg-orange-500 shadow-orange-500/40"
                  }`}
                >
                  {arrived ? <CheckCircle2 size={18} /> : <Truck size={18} />}
                </div>
              </motion.div>
              <div className="absolute end-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                <div
                  className={`h-7 w-7 rounded-full grid place-items-center transition-colors ${
                    arrived ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <MapPin size={14} />
                </div>
              </div>
            </div>

            {/* Step list */}
            <ol className="space-y-3">
              {STEPS.map((s, i) => {
                const reached = i <= stage;
                const active = i === stage && !arrived;
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
                    {i === 4 && reached && (
                      <CheckCircle2 size={14} className="ms-auto text-success" />
                    )}
                  </li>
                );
              })}
            </ol>

            {arrived && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl bg-success/10 text-success text-sm font-medium px-3 py-2.5 text-center"
              >
                {t("checkout.arrivedTitle")} — {t("checkout.arrivedSub")}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Button asChild className="w-full h-12">
        <Link to="/">{t("checkout.continue")}</Link>
      </Button>
    </div>
  );
}
