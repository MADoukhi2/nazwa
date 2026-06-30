import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import { WORLDS } from "@/lib/categories";
import { CoinBadge } from "@/components/CoinBadge";
import { StreakFlame } from "@/components/StreakFlame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LangThemeToggle } from "@/components/LangThemeToggle";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ar";
  const { profile, wallet, streak, unlocks, setUsername, redeemReferral, orders } = useStore();

  const [name, setName] = useState(profile.username);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleRedeem = () => {
    const ok = redeemReferral(code);
    if (ok) {
      toast.success(`+150 coins`);
      setCode("");
    } else {
      toast.error("Invalid or already redeemed");
    }
  };

  return (
    <div className="px-4 pt-4 pb-32 space-y-5">
      <h1 className="font-display text-2xl font-bold">{t("profile.title")}</h1>

      {/* Wallet card */}
      <div className="rounded-3xl p-5 coin-gradient text-coin-foreground">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-70">
          {t("profile.coins")}
        </div>
        <div className="text-4xl font-bold tabular-nums mt-1">
          {wallet.coins.toLocaleString()}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <StreakFlame days={streak.current} />
            <span className="opacity-70">{t("profile.streak")} · {streak.current} {t("profile.days")}</span>
          </div>
          <div className="text-xs opacity-70">{orders.length} orders</div>
        </div>
      </div>

      {/* Worlds */}
      <section>
        <h2 className="font-semibold mb-3">{t("profile.worlds")}</h2>
        <div className="grid grid-cols-3 gap-2">
          {WORLDS.map((w) => {
            const open = unlocks[w.id];
            return (
              <div
                key={w.id}
                className={`rounded-2xl border p-3 text-center ${
                  open
                    ? "bg-card border-border"
                    : "bg-muted/50 border-dashed border-border opacity-70"
                }`}
              >
                <div className="text-2xl mb-1">{open ? w.emoji : "🔒"}</div>
                <div className="text-xs font-medium leading-tight">
                  {lang === "ar" ? w.labelAr : w.labelEn}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Referral */}
      <section className="space-y-3">
        <h2 className="font-semibold">{t("profile.referral")}</h2>
        <div className="rounded-2xl border border-border bg-card p-3 flex items-center justify-between gap-3">
          <code className="font-mono font-semibold tracking-wider">{profile.referralCode}</code>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={copyCode}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span className="ms-1">{t("profile.copy")}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "SimuMart", text: `Use my code ${profile.referralCode}` });
                }
              }}
            >
              <Share2 size={14} />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">{t("profile.redeem")}</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={t("profile.redeemPlaceholder")}
              disabled={profile.referralRedeemed}
            />
            <Button onClick={handleRedeem} disabled={profile.referralRedeemed || !code}>
              {t("profile.apply")}
            </Button>
          </div>
          {profile.referralRedeemed && (
            <p className="text-xs text-success mt-1.5">✓ Already redeemed</p>
          )}
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-3">
        <h2 className="font-semibold">{t("profile.settings")}</h2>
        <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">{t("profile.username")}</Label>
            <div className="flex gap-2 mt-1.5">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Button
                onClick={() => {
                  setUsername(name.trim() || "Guest");
                  toast.success("Saved");
                }}
              >
                {t("profile.save")}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{t("profile.theme")} / {t("profile.language")}</span>
            <LangThemeToggle />
          </div>
        </div>
      </section>
    </div>
  );
}
