import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { WorldConfig } from "@/lib/categories";
import { Button } from "@/components/ui/button";

export function UnlockModal({
  world,
  open,
  onClose,
}: {
  world: WorldConfig | null;
  open: boolean;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ar";

  useEffect(() => {
    if (open) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#E8B341", "#F25C2A", "#FFFFFF", "#16A34A"],
      });
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && world && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="bg-card border border-border rounded-3xl p-8 text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">{world.emoji}</div>
            <h2 className="font-display text-2xl font-bold mb-2">
              {lang === "ar" ? world.labelAr : world.labelEn}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">{t("unlock.unlocked")}</p>
            <p className="text-sm text-muted-foreground mb-6">
              {lang === "ar" ? world.blurb.ar : world.blurb.en}
            </p>
            <Button onClick={onClose} className="w-full">
              ✨
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
