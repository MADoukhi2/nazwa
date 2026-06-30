import { useTranslation } from "react-i18next";

export function DisclaimerBar() {
  const { t } = useTranslation();
  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-[11px] py-1.5 px-3 text-center border-b border-amber-200/50 dark:border-amber-800/40">
      {t("app.tagline")}
    </div>
  );
}
