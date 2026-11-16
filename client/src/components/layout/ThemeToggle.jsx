import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle({ className = "" }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      className={`grid size-10 place-items-center rounded-xl text-muted transition hover:bg-white/[.06] hover:text-white ${className}`}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      type="button"
    >
      {resolvedTheme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
