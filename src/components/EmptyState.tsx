import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function EmptyState({
  title,
  subtitle,
  action,
  onAction,
  emoji = "🛒",
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
  emoji?: string;
}) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="font-display text-xl font-semibold mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}
      {action && onAction && <Button onClick={onAction}>{action}</Button>}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="text-center py-12">
      <p className="text-sm text-muted-foreground mb-4">{t("common.loadFail")}</p>
      <Button variant="outline" onClick={onRetry}>
        {t("common.retry")}
      </Button>
    </div>
  );
}
