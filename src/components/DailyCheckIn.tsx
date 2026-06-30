import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/store";
import { CoinBadge } from "./CoinBadge";
import { StreakFlame } from "./StreakFlame";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export function DailyCheckIn() {
  const { t } = useTranslation();
  const { streak, canCheckInToday, checkIn } = useStore();
  const can = canCheckInToday();
  const nextDay = streak.current + (can ? 1 : 0);
  const previewAward = 20 + Math.min(nextDay * 10, 100);

  const handle = () => {
    const r = checkIn();
    if (r) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#E8B341", "#F25C2A"],
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4"
    >
      <div className="h-12 w-12 rounded-2xl coin-gradient grid place-items-center text-2xl shrink-0">
        🎁
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm truncate">{t("home.checkInTitle")}</h3>
          <StreakFlame days={streak.current} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("home.checkInSub", { day: nextDay, coins: previewAward })}
        </p>
      </div>
      <Button size="sm" disabled={!can} onClick={handle} className="shrink-0">
        {can ? t("home.claim") : t("home.claimed")}
      </Button>
    </motion.div>
  );
}
