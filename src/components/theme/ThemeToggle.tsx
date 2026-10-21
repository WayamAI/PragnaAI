import { icons } from "@/components/icons/iconMap";
import { useTheme } from "./theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const toDark = theme === "light";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={toDark ? "Switch to dark theme" : "Switch to light theme"}
      className={className}
    >
      <icons.theme size={16} className="shrink-0" />
      <span>{toDark ? "Dark theme" : "Light theme"}</span>
    </button>
  );
}
