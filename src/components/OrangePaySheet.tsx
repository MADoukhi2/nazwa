import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { PriceTag } from "./PriceTag";
import { playPaySuccess } from "@/lib/sfx";

interface Props {
  open: boolean;
  amount: number;
  onClose: () => void;
  onConfirm: () => void;
}

type Mode = "full" | "installments";

interface Card {
  id: string;
  name: string;
  last4: string;
  gradient: string;
  badgeText: string;
  badgeBg: string;
  badgeFg: string;
}

const CARDS: Card[] = [
  {
    id: "nazwa",
    name: "Nazwa Card",
    last4: "1234",
    gradient: "linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)",
    badgeText: "Nazwa",
    badgeBg: "#831843",
    badgeFg: "#fce7f3",
  },
  {
    id: "visa",
    name: "Visa Platinum",
    last4: "4821",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)",
    badgeText: "VISA",
    badgeBg: "#fde047",
    badgeFg: "#1e3a8a",
  },
  {
    id: "mc",
    name: "Mastercard Black",
    last4: "9907",
    gradient: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)",
    badgeText: "MC",
    badgeBg: "#f97316",
    badgeFg: "#0a0a0a",
  },
  {
    id: "mada",
    name: "Mada Green",
    last4: "5512",
    gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
    badgeText: "mada",
    badgeBg: "#ecfeff",
    badgeFg: "#064e3b",
  },
];

export function OrangePaySheet({ open, amount, onClose, onConfirm }: Props) {
  const { t } = useTranslation();
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<Mode>("full");
  const [selected, setSelected] = useState(CARDS[0].id);

  useEffect(() => {
    if (!open) {
      setPaying(false);
      setDone(false);
    }
  }, [open]);

  const handlePay = () => {
    setPaying(true);
    playPaySuccess();
    setTimeout(() => setDone(true), 350);
    setTimeout(() => onConfirm(), 1300);
  };

  const due = mode === "full" ? amount : amount / 4;
  const card = CARDS.find((c) => c.id === selected)!;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-0 inset-x-0 z-50 mx-auto max-w-md rounded-t-3xl bg-white text-zinc-900 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl"
            dir="ltr"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight" style={{ color: "#F25C2A" }}>
                  ◐
                </span>
                <span className="text-2xl font-bold tracking-tight">{t("checkout.orangePay")}</span>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 grid place-items-center rounded-full bg-zinc-100 text-zinc-600"
                aria-label="close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode toggle */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-zinc-100 mb-3">
              {(["full", "installments"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`h-9 rounded-lg text-xs font-semibold transition ${
                    mode === m ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
                  }`}
                >
                  {m === "full" ? t("checkout.fullPayment") : t("checkout.installments")}
                </button>
              ))}
            </div>

            {/* Card list */}
            <div className="space-y-2 mb-4 max-h-[230px] overflow-y-auto pr-1">
              {CARDS.map((c) => {
                const active = c.id === selected;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className={`w-full flex items-center justify-between rounded-2xl p-3 border transition ${
                      active
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-14 rounded-md grid place-items-center text-[10px] font-bold shadow-inner"
                        style={{ background: c.gradient }}
                      >
                        <span
                          className="px-1 py-0.5 rounded"
                          style={{ background: c.badgeBg, color: c.badgeFg }}
                        >
                          {c.badgeText}
                        </span>
                      </div>
                      <div className="text-start">
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="font-mono text-[11px] text-zinc-500">···· {c.last4}</div>
                      </div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full grid place-items-center border ${
                        active ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-300"
                      }`}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Amount summary */}
            <div className="flex items-end justify-between border-t border-zinc-200 pt-3 mb-4">
              <div>
                <div className="text-xs text-zinc-500">
                  {mode === "full"
                    ? t("checkout.dueToday")
                    : t("checkout.everyTwoWeeks", { amount: `${(amount / 4).toFixed(2)}⃁` })}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{card.name}</div>
              </div>
              <div className="text-2xl font-bold">
                <PriceTag amount={due} size="lg" className="text-zinc-900" />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePay}
              disabled={paying}
              className="w-full h-14 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-90"
              style={{ backgroundColor: done ? "#16a34a" : "#0A84FF" }}
            >
              {done ? (
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Check size={20} strokeWidth={3} /> Done
                </motion.span>
              ) : paying ? (
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  …
                </motion.span>
              ) : (
                t("checkout.confirmPay")
              )}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
