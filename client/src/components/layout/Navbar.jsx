import { useEffect, useRef } from "react";
import { ArrowRight, Atom, Menu as MenuIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/layout/ThemeToggle";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/keyframery/menu";

const links = [
  ["Habit", "#habits"],
  ["Task", "#ai-tasks"],
  ["How It Works", "#how-it-works"],
  ["Pricing", "#pricing"],
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const sectionHref = (href) => (pathname === "/" ? href : `/${href}`);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav?.parentElement) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateWidth = () => {
      const parent = nav.parentElement;
      const parentStyle = window.getComputedStyle(parent);
      const availableWidth =
        parent.clientWidth -
        Number.parseFloat(parentStyle.paddingLeft) -
        Number.parseFloat(parentStyle.paddingRight);
      const rootFontSize = Number.parseFloat(
        window.getComputedStyle(document.documentElement).fontSize,
      );
      const fullWidth = Math.min(availableWidth, 68 * rootFontSize);
      const minWidth = fullWidth * 0.92;
      const maxScrollY = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScrollY));
      const progress = reducedMotion.matches ? 0 : scrollProgress;
      const width = fullWidth - progress * (fullWidth - minWidth);
      nav.style.setProperty("--nav-width", `${width}px`);
      nav.style.setProperty("--nav-min-width", `${minWidth}px`);
    };

    updateWidth();
    window.addEventListener("scroll", updateWidth, { passive: true });
    window.addEventListener("resize", updateWidth);
    reducedMotion.addEventListener("change", updateWidth);
    return () => {
      window.removeEventListener("scroll", updateWidth);
      window.removeEventListener("resize", updateWidth);
      reducedMotion.removeEventListener("change", updateWidth);
    };
  }, []);

  return (
    <header className="ref-header">
      <nav
        aria-label="Primary navigation"
        className="ref-nav transition-[width] duration-[calc(280ms*var(--kf-speed,1))] ease-spring motion-reduce:transition-none!"
        ref={navRef}
      >
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
          <Menu>
            <MenuTrigger aria-label="Open navigation menu" className="ref-menu-toggle">
              <MenuIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuContent align="end" className="w-56" side="bottom">
              {links.map(([label, href]) => (
                <MenuItem
                  key={href}
                  onSelect={() => {
                    if (pathname === "/") {
                      window.location.hash = href;
                    } else {
                      navigate(sectionHref(href));
                    }
                  }}
                  value={label}
                >
                  {label}
                </MenuItem>
              ))}
              <MenuItem onSelect={() => navigate("/login")} value="login">
                Log in
              </MenuItem>
              <MenuItem onSelect={() => navigate("/register")} value="register">
                Get started free
              </MenuItem>
            </MenuContent>
          </Menu>
        </div>
      </nav>
    </header>
  );
}
