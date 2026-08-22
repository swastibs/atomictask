import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Atom, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";

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

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const stored = window.localStorage.getItem("atomictask-theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const isHome = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Show landing links on both home and auth pages.
  const showLandingLinks = isHome || isAuthPage;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isDark) {
      const timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * sarcasticMessages.length);
        setMessage(sarcasticMessages[randomIndex]);
        setShowMessage(true);
      }, 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isDark]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const links = showLandingLinks
    ? [
      ["How it works", "#how-it-works"],
      ["Tasks", "#ai-tasks"],
      ["Habits", "#habits"],
    ]
    : [
      ["Dashboard", "/dashboard"],
      ["Trash", "/tasks/trash"],
      ["Stats", "/stats"],
      ["Profile", "/profile"],
    ];

  return (
    <div className="sticky top-4 z-50 flex w-full flex-col items-center px-4 transition-all duration-300">
      <nav
        className={`
          flex w-full items-center justify-between gap-3 rounded-full border border-border/80 bg-background/80 px-5 py-2.5 backdrop-blur-md shadow-sm transition-all duration-300
          ${isScrolled ? "max-w-[760px] py-2" : "max-w-[1000px] py-2.5"}
        `}
        aria-label="Primary navigation"
      >
        {/* Brand */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="group flex shrink-0 items-center gap-2 font-heading text-lg font-semibold tracking-tight text-foreground no-underline transition-opacity hover:opacity-70"
        >
          <Atom className="size-5 text-[var(--accent-atomic)]" />
          <span>AtomicTask</span>
        </Link>

        {/* Center links */}
        {links.length > 0 && (
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 sm:flex">
            {links.map(([label, href]) =>
              href.startsWith("#") ? (
                <a
                  key={label}
                  href={href}
                  className="relative text-sm font-semibold text-muted-foreground no-underline transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent-atomic)] after:transition-transform after:duration-200 hover:after:scale-x-100"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={href}
                  className="relative text-sm font-semibold text-muted-foreground no-underline transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent-atomic)] after:transition-transform after:duration-200 hover:after:scale-x-100"
                >
                  {label}
                </Link>
              ),
            )}
          </div>
        )}

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle onThemeChange={(theme) => setIsDark(theme === "dark")} />

          {user ? (
            <>
              <Link
                to="/profile"
                className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground no-underline transition-colors hover:text-foreground sm:flex"
              >
                <UserRound className="size-4 text-[var(--accent-atomic)]" />
                <span>{user.name || "Profile"}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-destructive sm:px-3"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-semibold text-muted-foreground no-underline transition-colors hover:text-foreground sm:block"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 rounded-full bg-[var(--accent-atomic)] px-4 py-2 text-sm font-extrabold text-[var(--accent-atomic-foreground)] no-underline transition-all duration-200 hover:brightness-105 active:scale-95"
              >
                Get started
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Fixed‑height message container – stable layout */}
      <div className="mt-2 w-full max-w-[760px] pr-4 text-right h-6 overflow-hidden">
        <p
          className={`text-xs text-muted-foreground/60 italic transition-opacity duration-500 hover:text-muted-foreground/90 ${
            !isDark && showMessage ? "opacity-100" : "opacity-0"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
