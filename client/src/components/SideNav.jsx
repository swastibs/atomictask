import { useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LogOut,
  Settings2,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";

const itemClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-[var(--accent-atomic)]/20 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;

export default function SideNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const signOut = async () => {
    await logout();
    navigate("/login");
  };
  const closeMobile = () => setMobileOpen(false);
  const links = [
    ["All tasks", "/dashboard", CheckSquare2],
    ["Today", `/dashboard?dueDate=${today}`, CalendarDays],
    ["Statistics", "/stats", BarChart3],
    ["Trash", "/tasks/trash", Trash2],
  ];
  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 grid size-10 place-items-center rounded-xl border bg-background shadow-sm lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <ChevronRight className="size-5" />
      </button>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={closeMobile}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-[var(--sidebar)] p-4 transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "lg:w-[76px]" : ""}`}
      >
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
        >
          <NavLink
            to="/dashboard"
            onClick={closeMobile}
            className="flex items-center gap-2 font-heading text-lg font-semibold"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent-atomic)] text-[var(--accent-atomic-foreground)]">
              <Sparkles className="size-5" />
            </span>
            {!collapsed && <span>AtomicTask</span>}
          </NavLink>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:block"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>
        <div className="mt-8 space-y-1">
          <p
            className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ${collapsed ? "lg:hidden" : ""}`}
          >
            Workspace
          </p>
          {links.map(([name, href, Icon]) => (
            <NavLink
              key={name}
              to={href}
              end={name === "All tasks"}
              onClick={closeMobile}
              className={itemClass}
              title={collapsed ? name : undefined}
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && <span>{name}</span>}
              {name === "Today" && !collapsed}
            </NavLink>
          ))}
        </div>
        <div className="mt-8 space-y-1">
          <p
            className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ${collapsed ? "lg:hidden" : ""}`}
          >
            Focus
          </p>
          <NavLink
            to="/habits"
            onClick={closeMobile}
            className={itemClass}
            title={collapsed ? "Habits" : undefined}
          >
            <CheckSquare2 className="size-[18px] shrink-0" />
            {!collapsed && <span>Habits</span>}
          </NavLink>
          <NavLink
            to="/pomodoro"
            onClick={closeMobile}
            className={itemClass}
            title={collapsed ? "Pomodoro" : undefined}
          >
            <Clock3 className="size-[18px] shrink-0" />
            {!collapsed && <span>Pomodoro</span>}
          </NavLink>
        </div>
        <div className="mt-auto space-y-1">
          <div
            className={`mb-3 flex items-center gap-3 rounded-xl bg-background/60 p-3 ${collapsed ? "lg:justify-center lg:p-2" : ""}`}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--accent-atomic)]/30 text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {user?.name || "Account"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          <NavLink
            to="/profile"
            onClick={closeMobile}
            className={itemClass}
            title={collapsed ? "Account" : undefined}
          >
            <UserRound className="size-[18px] shrink-0" />
            {!collapsed && <span>Account</span>}
          </NavLink>

          {/* FIX: Make the entire row clickable */}
          <div
            className={`flex items-center rounded-xl text-muted-foreground hover:bg-muted cursor-pointer ${collapsed ? "lg:justify-center" : "justify-between px-3 py-2"}`}
            onClick={() => {
              // Find and click the ThemeToggle button inside
              const toggleBtn = document.querySelector(
                '.theme-toggle-button, [aria-label*="theme"], button[aria-pressed]',
              );
              if (toggleBtn) {
                toggleBtn.click();
              }
            }}
          >
            <div className="flex items-center gap-3 pointer-events-none">
              <Settings2 className="size-[18px] shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Theme</span>}
            </div>
            <ThemeToggle onThemeChange={() => {}} />
          </div>

          <button
            type="button"
            onClick={signOut}
            className={`${itemClass({ isActive: false })} w-full`}
            title={collapsed ? "Log out" : undefined}
          >
            <LogOut className="size-[18px] shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
