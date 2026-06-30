import { Moon, Sun, Languages } from "lucide-react";
import { useStore } from "@/lib/store";
import { setLanguage } from "@/lib/i18n";
import { useEffect } from "react";

export function LangThemeToggle() {
  const { prefs, setTheme, setLang } = useStore();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", prefs.theme === "dark");
    document.documentElement.lang = prefs.lang;
    document.documentElement.dir = prefs.lang === "ar" ? "rtl" : "ltr";
    setLanguage(prefs.lang);
  }, [prefs.theme, prefs.lang]);

  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => setTheme(prefs.theme === "dark" ? "light" : "dark")}
        className="h-10 w-10 grid place-items-center rounded-full border border-border bg-card active:scale-95 transition"
        aria-label="toggle theme"
      >
        {prefs.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button
        type="button"
        onClick={() => setLang(prefs.lang === "en" ? "ar" : "en")}
        className="h-10 px-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card active:scale-95 transition text-sm font-medium"
        aria-label="toggle language"
      >
        <Languages size={16} />
        {prefs.lang === "en" ? "AR" : "EN"}
      </button>
    </div>
  );
}
