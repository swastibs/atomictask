import { ArrowRight, Atom, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/layout/ThemeToggle";

const links = [
  ["Habit", "#habits"],
  ["Task", "#ai-tasks"],
  ["How It Works", "#how-it-works"],
  ["Pricing", "#pricing"],
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = () => setMenuOpen(false);
  const sectionHref = (href) =>
    pathname === "/" ? href : `/${href}`;

  return (
    <header className="ref-header">
      <nav aria-label="Primary navigation" className="ref-nav">
        <Link aria-label="AtomicTasks home" className="ref-brand" to="/">
          <Atom aria-hidden="true" className="ref-brand-mark" />
          <span>AtomicTasks</span>
        </Link>

        <div className="ref-nav-links">
          {links.map(([label, href]) => (
            <a href={sectionHref(href)} key={href}>
              {label}
            </a>
          ))}
        </div>

        <div className="ref-nav-actions">
          <ThemeToggle className="ref-theme-toggle" />
          <Link className="ref-login-link" to="/login">
            Log in
          </Link>
          <Button
            as={Link}
            className="ref-start-button"
            size="sm"
            to="/register"
          >
            Get started <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="ref-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="ref-mobile-menu">
          {links.map(([label, href]) => (
            <a href={sectionHref(href)} key={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
          <Link onClick={closeMenu} to="/login">
            Log in
          </Link>
          <Link className="ref-mobile-cta" onClick={closeMenu} to="/register">
            Get started <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </nav>
      )}
    </header>
  );
}
