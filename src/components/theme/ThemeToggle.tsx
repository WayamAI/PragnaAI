import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const toDark = theme === "light";
  const Icon = toDark ? Moon : Sun;
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={toDark ? "Switch to dark theme" : "Switch to light theme"}
      className={className}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{toDark ? "Dark theme" : "Light theme"}</span>
    </button>
  );
}
