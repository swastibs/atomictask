import { useEffect, useState } from "react";
import { Moon, Sun, Eye } from "lucide-react";

const STORAGE_KEY = "atomictask-theme";

const sarcasticMessages = [
  "👀 Dark mode exists, you know.",
  "Your eyes are crying. Just sayin'. 🌞",
  "I can see you squinting. 😎",
  "This is light mode. You're on your own. 🌞",
  "Dark mode is literally one click away. 👆",
  "Who hurt you? Dark mode is right there.",
  "You're still in light mode? Bold choice. 🤡",
  "Real pirates use dark mode. 🏴‍☠️",
  "Your eyes called. They want dark mode.",
  "I'm not saying you need dark mode... but I'm not NOT saying it. 👀",
  "The moon is jealous right now. 🌙",
  "Dark mode is free. Just saying. 💸",
  "Your battery is crying in light mode. 🔋",
  "I bet you stare at the sun too. ☀️",
  "Dark mode: exists. You: ignore. 🤷",
];

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function ThemeToggle({ className = "", onThemeChange }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  // Sarcastic message state
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Theme change effect
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    onThemeChange?.(theme);
  }, [theme, onThemeChange]);

  // Pick a random sarcastic message when light mode is active
  useEffect(() => {
    if (!isDark) {
      const randomIndex = Math.floor(Math.random() * sarcasticMessages.length);
      setMessage(sarcasticMessages[randomIndex]);
      const timer = setTimeout(() => setShowMessage(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowMessage(false);
    }
  }, [isDark]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Toggle button */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={isDark}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className={`relative inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${className}`}
      >
        <Sun
          className={`absolute size-4 transition-all duration-300 ${
            isDark
              ? "-rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute size-4 transition-all duration-300 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
      </button>

      {/* Sarcastic message – only shows in light mode */}
      {!isDark && showMessage && (
        <div
          className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground/70 animate-in fade-in slide-in-from-left-1 duration-500 cursor-default group"
          title="Click the moon icon to save your eyes"
        >
          <Eye className="size-3 text-primary/40 animate-pulse" />
          <span className="font-medium italic max-w-[180px] truncate">
            {message}
          </span>
          <span className="text-[10px] text-primary/30 group-hover:text-primary/60 transition-colors">
            (click the moon)
          </span>
        </div>
      )}
    </div>
  );
}
