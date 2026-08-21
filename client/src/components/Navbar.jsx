import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Atom, Eye, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import "./Navbar.css";

const sarcasticMessages = [
  "👀 Dark mode exists, you know.",
  "Your eyes are crying. Just sayin'. 🌞",
  "I can see you squinting. 😎",
  "Dark mode is literally one click away. 👆",
  "You're still in light mode? Bold choice. 🤡",
  "Real pirates use dark mode. 🏴‍☠️",
  "Your eyes called. They want dark mode.",
  "The moon is jealous right now. 🌙",
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 24);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [message, setMessage] = useState("");
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (isDark) return;
    setMessage(sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)]);
  }, [isDark]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const links = isHome
    ? [["How it works", "#how-it-works"], ["Tasks", "#ai-tasks"], ["Habits", "#habits"]]
    : [["Dashboard", "/dashboard"], ["Profile", "/profile"]];

  return (
    <header className={`site-nav-shell ${isScrolled ? "is-scrolled" : ""}`}>
      <nav className="site-nav" aria-label="Primary navigation">
        <Link to={user ? "/dashboard" : "/"} className="site-nav-brand">
          <Atom /> <span>AtomicTask</span>
        </Link>
        <div className="site-nav-links">
          {links.map(([label, href]) => href.startsWith("#") ? <a href={href} key={label}>{label}</a> : <Link to={href} key={label}>{label}</Link>)}
        </div>
        <div className="site-nav-actions">
          {!isDark && message && <span className="site-nav-note" title="Click the moon to save your eyes"><Eye /> {message}</span>}
          <ThemeToggle className="site-nav-theme" onThemeChange={(theme) => setIsDark(theme === "dark")} />
          {user ? <><Link to="/profile" className="site-nav-profile"><UserRound /> <span>{user.name || "Profile"}</span></Link><button type="button" className="site-nav-logout" onClick={handleLogout} aria-label="Log out"><LogOut /><span>Log out</span></button></> : <><Link to="/login" className="site-nav-login">Log in</Link><Link to="/signup" className="site-nav-cta">Get started <ArrowRight /></Link></>}
        </div>
      </nav>
    </header>
  );
}
