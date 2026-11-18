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
  const sectionHref = (href) => (pathname === "/" ? href : `/${href}`);

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
