import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ChevronLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { getWorld, type WorldId } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { CoinBadge } from "@/components/CoinBadge";
import { UnlockModal } from "@/components/UnlockModal";
import { toast } from "sonner";

export const Route = createFileRoute("/unlock/$slug")({
  component: UnlockPage,
});

function UnlockPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ar";
  const { wallet, streak, unlocks, unlockWorld, spendCoins } = useStore();

  const worldId = (["general", "perfume", "food"].includes(slug) ? slug : "perfume") as WorldId;
  const world = getWorld(worldId);
  const isUnlocked = unlocks[worldId];

  const [showAnim, setShowAnim] = useState(false);

  const canByStreak = streak.current >= (world.streakDays ?? 0);
  const canByCoins = wallet.coins >= (world.coinCost ?? 0);

  const handleUnlock = (mode: "coins" | "streak") => {
    if (mode === "coins") {
      const ok = spendCoins(world.coinCost ?? 0);
      if (!ok) {
        toast.error(t("unlock.notEnough"));
        return;
      }
    }
    unlockWorld(worldId);
    setShowAnim(true);
  };

  const closeAnim = () => {
    setShowAnim(false);
    navigate({ to: "/category/$slug", params: { slug: world.categories[0] ?? "all" } });
  };

  return (
    <div className="px-4 pt-4 pb-20 space-y-5">
      <button
        onClick={() => navigate({ to: "/" })}
        className="h-9 w-9 rounded-full bg-card border border-border grid place-items-center"
      >
        <ChevronLeft size={18} />
      </button>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-3xl p-8 bg-gradient-to-br from-card to-muted text-center border border-border"
      >
        <div className="relative inline-block mb-4">
          <div className="text-7xl">{world.emoji}</div>
          {!isUnlocked && (
            <div className="absolute -bottom-1 -end-1 h-10 w-10 rounded-full bg-foreground text-background grid place-items-center">
              <Lock size={18} />
            </div>
          )}
        </div>
        <h1 className="font-display text-2xl font-bold mb-1">
          {lang === "ar" ? world.labelAr : world.labelEn}
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {lang === "ar" ? world.blurb.ar : world.blurb.en}
        </p>
      </motion.div>

      {!isUnlocked ? (
        <div className="space-y-3">
          {/* Coin unlock */}
          <div className="rounded-2xl bg-card border border-border p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">{t("unlock.unlockWith", { coins: world.coinCost })}</div>
              <CoinBadge amount={world.coinCost ?? 0} className="mt-1" />
            </div>
            <Button onClick={() => handleUnlock("coins")} disabled={!canByCoins}>
              {t("unlock.unlock")}
            </Button>
          </div>

          {/* Streak unlock */}
          <div className="rounded-2xl bg-card border border-border p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">
                {t("unlock.orStreak", { days: world.streakDays })}
              </div>
              <div className="text-sm font-semibold mt-1">
                {streak.current}/{world.streakDays} {t("profile.days")}
              </div>
            </div>
            <Button onClick={() => handleUnlock("streak")} disabled={!canByStreak} variant="outline">
              {t("unlock.unlock")}
            </Button>
          </div>

          <div className="rounded-2xl bg-muted/60 p-3 text-xs text-muted-foreground text-center">
            You have <CoinBadge amount={wallet.coins} size="sm" className="mx-1" /> right now.
          </div>
        </div>
      ) : (
        <Button
          className="w-full h-12"
          onClick={() => navigate({ to: "/category/$slug", params: { slug: world.categories[0] ?? "all" } })}
        >
          {t("unlock.unlocked")} →
        </Button>
      )}

      <UnlockModal world={world} open={showAnim} onClose={closeAnim} />
    </div>
  );
}
