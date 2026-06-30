import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, ChevronRight } from "lucide-react";
import { PriceTag } from "./PriceTag";

interface Props {
  open: boolean;
  amount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function OrangePaySheet({ open, amount, onClose, onConfirm }: Props) {
  const { t } = useTranslation();
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!open) setPaying(false);
  }, [open]);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => onConfirm(), 900);
  };

  const due = amount / 4;

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
            <div className="flex items-center justify-between mb-5">
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

            <button className="w-full flex items-center justify-between rounded-2xl bg-zinc-50 border border-zinc-200 p-3 mb-2.5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-14 rounded-md bg-gradient-to-br from-pink-300 to-pink-200 grid place-items-center text-[10px] font-bold text-pink-900">
                  Nazwa
                </div>
                <div className="text-start">
                  <div className="font-semibold text-sm">Nazwa Card</div>
                  <div className="inline-block mt-0.5 text-[10px] font-medium bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded">
                    {t("checkout.payLater")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-zinc-500 text-sm">
                <span className="font-mono">···· 1234</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button className="w-full flex items-center justify-between rounded-2xl bg-zinc-50 border border-zinc-200 p-3 mb-2.5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-900 text-white grid place-items-center">
                  <Clock size={18} />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-sm">{t("checkout.fourPayments")}</div>
                  <div className="text-[11px] text-zinc-500">
                    {t("checkout.everyTwoWeeks", { amount: `${due.toFixed(2)}⃁` })}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>

            <button className="w-full flex items-center justify-between rounded-2xl bg-zinc-50 border border-zinc-200 p-3 mb-4 text-sm font-semibold">
              {t("checkout.otherCards")}
              <ChevronRight size={16} className="text-zinc-400" />
            </button>

            <div className="flex items-end justify-between border-t border-zinc-200 pt-3 mb-5">
              <div className="text-xs text-zinc-500">{t("checkout.dueToday")}</div>
              <div className="text-2xl font-bold">
                <PriceTag amount={due} size="lg" className="text-zinc-900" />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePay}
              disabled={paying}
              className="w-full h-14 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-80"
              style={{ backgroundColor: "#0A84FF" }}
            >
              {paying ? (
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
