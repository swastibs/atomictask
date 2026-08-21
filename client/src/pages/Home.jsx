import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCheck,
  Flame,
  GitBranch,
  Menu,
  Target,
  X,
  AlertCircle,
  Zap,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import CursorGrid from "@/components/CursorGrid/CursorGrid";

// ---- Background decorative layer (unchanged) ----
function BackgroundDecor({ viewMode }) {
  const isBefore = viewMode === "before";

  const shapes = [
    { x: 10, y: 15, size: 24, rot: 45 },
    { x: 85, y: 5, size: 18, rot: 120 },
    { x: 45, y: 70, size: 30, rot: 200 },
    { x: 70, y: 40, size: 12, rot: 80 },
    { x: 20, y: 80, size: 36, rot: 310 },
    { x: 55, y: 20, size: 16, rot: 60 },
    { x: 90, y: 75, size: 28, rot: 270 },
    { x: 5, y: 45, size: 14, rot: 150 },
    { x: 35, y: 90, size: 22, rot: 40 },
    { x: 65, y: 60, size: 20, rot: 180 },
    { x: 15, y: 30, size: 26, rot: 95 },
    { x: 80, y: 20, size: 10, rot: 220 },
    { x: 40, y: 10, size: 32, rot: 135 },
    { x: 95, y: 55, size: 16, rot: 75 },
    { x: 25, y: 65, size: 20, rot: 290 },
    { x: 60, y: 85, size: 14, rot: 110 },
    { x: 50, y: 45, size: 28, rot: 25 },
    { x: 75, y: 10, size: 18, rot: 200 },
    { x: 30, y: 55, size: 22, rot: 340 },
    { x: 10, y: 90, size: 16, rot: 160 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div className="absolute inset-0 transition-all duration-1000">
        {shapes.map((s, i) => {
          const size = isBefore ? s.size : s.size * 0.4;
          const opacity = isBefore ? 0.6 + Math.random() * 0.4 : 0.15;
          const blur = isBefore ? "0px" : "2px";
          const color = isBefore
            ? `hsl(${i * 18 + 20}, 80%, 60%)`
            : "var(--muted-foreground)";
          const transform = isBefore
            ? `translate(${s.x}%, ${s.y}%) rotate(${s.rot}deg) scale(1)`
            : `translate(${s.x}%, ${s.y}%) rotate(0deg) scale(0.8)`;
          return (
            <div
              key={i}
              className="absolute rounded-full transition-all duration-1000 ease-in-out"
              style={{
                width: size,
                height: size,
                left: 0,
                top: 0,
                background: color,
                transform: transform,
                opacity: opacity,
                filter: `blur(${blur})`,
                animation: `float-${i % 5} ${6 + (i % 7)}s ease-in-out infinite alternate`,
              }}
            />
          );
        })}
      </div>

      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: isBefore ? 0.6 : 0.1 }}
      >
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="grid-pattern"
              width={isBefore ? "35" : "60"}
              height={isBefore ? "35" : "60"}
              patternUnits="userSpaceOnUse"
              patternTransform={isBefore ? "rotate(5)" : "rotate(0)"}
            >
              <path
                d={`M ${isBefore ? 35 : 60} 0 L 0 0 0 ${isBefore ? 35 : 60}`}
                fill="none"
                stroke={isBefore ? "rgba(255,0,0,0.15)" : "rgba(0,0,0,0.04)"}
                strokeWidth={isBefore ? "1.2" : "0.5"}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {isBefore && (
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={`dot-${i}`}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                background: `hsl(${Math.random() * 360}, 60%, 50%)`,
                opacity: 0.3 + Math.random() * 0.3,
                animation: `dot-float ${4 + Math.random() * 8}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes float-0 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(20px, -30px) rotate(30deg); } }
        @keyframes float-1 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(-25px, 15px) rotate(-20deg); } }
        @keyframes float-2 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(30px, 20px) rotate(45deg); } }
        @keyframes float-3 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(-15px, -35px) rotate(-15deg); } }
        @keyframes float-4 { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(10px, 40px) rotate(60deg); } }
        @keyframes dot-float { 0% { transform: translate(0, 0); } 100% { transform: translate(15px, -20px); } }
      `}</style>
    </div>
  );
}

// ---- AtomMark (logo) ----
function AtomMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4.2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4.2"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4.2"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(120 12 12)"
      />
      <circle cx="12" cy="12" r="2.4" fill="var(--accent-atomic)" />
    </svg>
  );
}

// ---- Orbit ring helper ----
function OrbitRing({ size, duration, reverse, icon: Icon }) {
  return (
    <div
      className="absolute inset-0 m-auto rounded-full border border-border/60"
      style={{
        width: size,
        height: size,
        animation: `orbit-spin ${duration} linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      <div
        className="absolute left-1/2 top-0 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-sm"
        style={{
          animation: `orbit-counter-spin ${duration} linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <Icon className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}

// ---- Orbit diagram (hero) ----
function OrbitDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[380px]">
      <div
        className="absolute inset-0 -z-10 rounded-full blur-3xl"
        style={{
          background:
            "color-mix(in oklch, var(--accent-atomic) 22%, transparent)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex size-20 items-center justify-center rounded-full sm:size-24"
          style={{
            background: "var(--accent-atomic)",
            color: "var(--accent-atomic-foreground)",
            animation: "atomic-pulse 3s ease-in-out infinite",
          }}
        >
          <CheckCheck className="size-8 sm:size-9" />
        </div>
      </div>
      <OrbitRing size="60%" duration="9s" icon={GitBranch} />
      <OrbitRing size="80%" duration="15s" reverse icon={Flame} />
      <OrbitRing size="100%" duration="21s" icon={BarChart3} />
    </div>
  );
}

// ---- Steps data ----
const steps = [
  {
    title: "Capture it",
    description:
      "Add a task the moment it crosses your mind — plain language, no setup required.",
    icon: Target,
  },
  {
    title: "Break it down",
    description:
      "Split it into atomic subtasks small enough to actually finish in one sitting.",
    icon: GitBranch,
  },
  {
    title: "Track the streak",
    description:
      "Complete one atom at a time and watch the pattern build day over day.",
    icon: Flame,
  },
];

// ---- Main Home component ----
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState("after");

  // Before data
  const beforeTasks = [
    {
      label: "Write report for Q3",
      priority: "high",
      done: false,
      due: "Overdue",
    },
    { label: "Buy groceries", priority: "low", done: false, due: "Tomorrow" },
    { label: "Clean inbox", priority: "medium", done: false, due: "Today" },
    { label: "Call mom", priority: "high", done: false, due: "Yesterday" },
    { label: "Review budget", priority: "low", done: false, due: "Next week" },
    { label: "Plan vacation", priority: "medium", done: false, due: "Someday" },
  ];
  const afterTasks = [
    {
      label: "Draft investor update",
      done: true,
      priority: "high",
      due: "Today",
    },
    { label: "Review PR #142", done: true, priority: "medium", due: "Today" },
    {
      label: "Outline onboarding flow",
      done: true,
      priority: "high",
      due: "Today",
    },
    {
      label: "Call Sarah re: pricing",
      done: true,
      priority: "medium",
      due: "Today",
    },
    {
      label: "Write changelog entry",
      done: false,
      priority: "low",
      due: "Tomorrow",
    },
    {
      label: "Plan next sprint",
      done: false,
      priority: "medium",
      due: "Friday",
    },
  ];
  const beforeHabits = [
    { name: "Exercise", streak: 1, total: 12 },
    { name: "Read", streak: 0, total: 5 },
    { name: "Meditate", streak: 2, total: 8 },
    { name: "Journal", streak: 0, total: 3 },
  ];
  const afterHabits = [
    { name: "Exercise", streak: 18, total: 20 },
    { name: "Read", streak: 12, total: 12 },
    { name: "Meditate", streak: 9, total: 10 },
    { name: "Journal", streak: 7, total: 8 },
  ];
  const beforeHeatmap = [
    0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    1, 0, 0,
  ].map(Boolean);
  const afterHeatmap = new Array(28).fill(1).map(Boolean);

  const tasks = viewMode === "before" ? beforeTasks : afterTasks;
  const habits = viewMode === "before" ? beforeHabits : afterHabits;
  const heatmap = viewMode === "before" ? beforeHeatmap : afterHeatmap;
  const totalDone = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const completion =
    totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;
  const isBefore = viewMode === "before";

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* ---- Global CursorGrid Background ---- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CursorGrid
          global={true}
          scrollEffect={true}
          cellSize={60}
          color="var(--accent-atomic)"
          radius={140}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={0.5} // increased for visibility
          fillOpacity={0}
          gridOpacity={0.08} // lattice visible in both modes
          cellRadius={6}
          clickPulse
          pulseSpeed={600}
        />
      </div>
      <BackgroundDecor viewMode={viewMode} />
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight"
          >
            <AtomMark className="size-6" />
            AtomicTask
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#preview"
              className="transition-colors hover:text-foreground"
            >
              Preview
            </a>
            <a
              href="#before-after"
              className="transition-colors hover:text-foreground"
            >
              Before / After
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link to="/signup" className="cta-button-sm">
              Get started <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border"
            >
              {menuOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border/70 px-4 pb-4 pt-2 md:hidden">
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-muted-foreground"
            >
              How it works
            </a>
            <a
              href="#preview"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-muted-foreground"
            >
              Preview
            </a>
            <a
              href="#before-after"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-muted-foreground"
            >
              Before / After
            </a>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="cta-button-sm mt-2 w-full justify-center"
            >
              Get started
            </Link>
          </div>
        )}
      </header>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, color-mix(in oklch, var(--accent-atomic) 12%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:py-32">
          <div className="animate-hero-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span
                className="size-1.5 rounded-full"
                style={{ background: "var(--accent-atomic)" }}
              />
              Task & habit system
            </span>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Break the big thing into the{" "}
              <span style={{ color: "var(--accent-atomic)" }}>next</span> thing.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              AtomicTask turns overwhelming goals into small, trackable actions
              — so you always know exactly what to do next, and can see the
              streak you're building.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup" className="cta-button">
                Start free <ArrowRight className="size-4" />
              </Link>
              <Link to="/login" className="cta-outline">
                Log in
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Free tier available. No credit card required.
            </p>
          </div>
          <OrbitDiagram />
        </div>
      </section>
      {/* Three-step loop */}
      <section
        id="how-it-works"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            The loop
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Three small steps, repeated daily
          </h2>
          <p className="mt-3 text-muted-foreground">
            No project plans. No dashboards to configure. Just the next atomic
            action, every time.
          </p>
        </div>
        <ol className="mt-14 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/20"
            >
              <span className="font-heading text-sm font-semibold text-muted-foreground/70">
                0{i + 1}
              </span>
              <div
                className="mt-4 inline-flex size-10 items-center justify-center rounded-xl"
                style={{
                  background:
                    "color-mix(in oklch, var(--accent-atomic) 16%, transparent)",
                }}
              >
                <step.icon
                  className="size-5"
                  style={{ color: "var(--accent-atomic)" }}
                />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
      {/* Product preview */}
      <section
        id="preview"
        className="border-y border-border/70 bg-muted/30 py-20 sm:py-24"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Built for follow-through
            </span>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              See today, not someday
            </h2>
            <p className="mt-4 text-muted-foreground">
              The dashboard shows exactly what's due right now and how your
              streaks are holding up — nothing else competes for your attention.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Atomic subtasks with one-tap complete",
                "Daily streak tracking per habit",
                "Light and dark mode, matched to your system",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 size-4 shrink-0"
                    style={{ color: "var(--accent-atomic)" }}
                  />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div
              className="absolute -inset-6 -z-10 rounded-3xl blur-3xl"
              style={{
                background:
                  "color-mix(in oklch, var(--accent-atomic) 18%, transparent)",
              }}
            />
            <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm font-semibold">Today</span>
                <span className="text-xs text-muted-foreground">
                  4 of 6 done
                </span>
              </div>
              <ul className="mt-3 space-y-2.5">
                {afterTasks.map((t) => (
                  <li
                    key={t.label}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm"
                  >
                    <span
                      className={`flex size-4 items-center justify-center rounded-full border ${t.done ? "border-transparent" : "border-border"}`}
                      style={
                        t.done
                          ? { background: "var(--accent-atomic)" }
                          : undefined
                      }
                    >
                      {t.done && (
                        <Check
                          className="size-3"
                          style={{ color: "var(--accent-atomic-foreground)" }}
                        />
                      )}
                    </span>
                    <span
                      className={
                        t.done ? "text-muted-foreground line-through" : ""
                      }
                    >
                      {t.label}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-border/70 pt-4">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>22-day streak</span>
                  <Flame
                    className="size-3.5"
                    style={{ color: "var(--accent-atomic)" }}
                  />
                </div>
                <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
                  {afterHeatmap.map((filled, i) => (
                    <span
                      key={i}
                      className="aspect-square rounded-[3px]"
                      style={{
                        background: filled
                          ? "var(--accent-atomic)"
                          : "var(--muted)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* BEFORE / AFTER */}
      <section
        id="before-after"
        className="border-y border-border/70 bg-muted/30 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              The transformation
            </span>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Before & After
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              See how AtomicTask takes the chaos and turns it into clarity.
            </p>
          </div>

          {/* Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium transition-colors ${isBefore ? "text-foreground" : "text-muted-foreground"}`}
            >
              Before
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={!isBefore}
              onClick={() => setViewMode(isBefore ? "after" : "before")}
              className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              style={{
                background: isBefore ? "var(--muted)" : "var(--accent-atomic)",
              }}
            >
              <span
                className="pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                style={{
                  transform: isBefore ? "translateX(0)" : "translateX(28px)",
                }}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${!isBefore ? "text-foreground" : "text-muted-foreground"}`}
            >
              After
            </span>
          </div>

          {/* Card */}
          <div className="mt-8 relative">
            <div
              className="absolute -inset-6 -z-10 rounded-3xl blur-3xl"
              style={{
                background:
                  "color-mix(in oklch, var(--accent-atomic) 18%, transparent)",
              }}
            />
            <div
              className="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all duration-500 ease-in-out"
              style={{ transform: isBefore ? "scale(0.98)" : "scale(1)" }}
            >
              <div className="grid gap-8 md:grid-cols-2">
                {/* Tasks */}
                <div>
                  <div className="flex items-center justify-between border-b border-border/70 pb-3">
                    <span className="text-sm font-semibold">
                      {isBefore ? "Cluttered tasks" : "Today's priorities"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {completion}% done
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {tasks.map((t) => {
                      const isOverdue =
                        t.due === "Overdue" || t.due === "Yesterday";
                      return (
                        <li
                          key={t.label}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${isBefore ? "bg-muted/30 hover:bg-muted/50" : "hover:bg-muted/30"}`}
                        >
                          <span
                            className={`flex size-4 items-center justify-center rounded-full border ${t.done ? "border-transparent" : "border-border"}`}
                            style={
                              t.done
                                ? { background: "var(--accent-atomic)" }
                                : undefined
                            }
                          >
                            {t.done && (
                              <Check
                                className="size-3"
                                style={{
                                  color: "var(--accent-atomic-foreground)",
                                }}
                              />
                            )}
                          </span>
                          <span
                            className={`flex-1 ${t.done ? "text-muted-foreground line-through" : ""} ${isBefore && !t.done && isOverdue ? "text-destructive" : ""}`}
                          >
                            {t.label}
                          </span>
                          {isBefore && !t.done && (
                            <span
                              className={`text-[10px] font-medium ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                            >
                              {t.due}
                            </span>
                          )}
                          {!isBefore && !t.done && t.priority && (
                            <span
                              className="text-[10px] font-medium"
                              style={{
                                color:
                                  t.priority === "high"
                                    ? "var(--accent-atomic)"
                                    : "var(--muted-foreground)",
                              }}
                            >
                              {t.priority}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {isBefore && (
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <AlertCircle className="size-3.5" />
                      <span>3 tasks overdue — stress building up</span>
                    </p>
                  )}
                  {!isBefore && (
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap
                        className="size-3.5"
                        style={{ color: "var(--accent-atomic)" }}
                      />
                      <span>All high‑priority tasks completed</span>
                    </p>
                  )}
                </div>

                {/* Habits */}
                <div>
                  <div className="flex items-center justify-between border-b border-border/70 pb-3">
                    <span className="text-sm font-semibold">
                      {isBefore ? "Scattered habits" : "Active habits"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isBefore
                        ? "0 streaks"
                        : `${habits.filter((h) => h.streak > 0).length} streaks`}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {habits.map((h) => (
                      <li
                        key={h.name}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`inline-block size-2 rounded-full ${h.streak > 0 ? (isBefore ? "bg-muted-foreground/30" : "bg-accent-atomic") : "bg-muted-foreground/20"}`}
                          />
                          {h.name}
                        </span>
                        <span
                          className={`text-xs font-medium ${h.streak > 0 ? (isBefore ? "text-muted-foreground" : "text-accent-atomic") : "text-muted-foreground"}`}
                        >
                          {isBefore
                            ? `${h.streak}/${h.total}`
                            : `${h.streak} days`}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 border-t border-border/70 pt-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {isBefore ? "Inconsistent activity" : "22‑day streak"}
                      </span>
                      <Flame
                        className="size-3.5"
                        style={{
                          color: isBefore
                            ? "var(--muted-foreground)"
                            : "var(--accent-atomic)",
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
                      {heatmap.map((filled, i) => (
                        <span
                          key={i}
                          className="aspect-square rounded-[3px] transition-colors"
                          style={{
                            background: filled
                              ? isBefore
                                ? "var(--muted-foreground)"
                                : "var(--accent-atomic)"
                              : "var(--muted)",
                            opacity: isBefore && filled ? 0.5 : 1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {!isBefore && (
                    <div className="mt-6 flex justify-end">
                      <Link to="/signup" className="cta-button-sm">
                        Start your transformation{" "}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground px-6 py-16 text-center text-background sm:px-16">
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full blur-3xl"
            style={{
              background:
                "color-mix(in oklch, var(--accent-atomic) 35%, transparent)",
            }}
          />
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop planning. Start finishing.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-background/70">
            Set up your first atomic task in under two minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup" className="cta-button">
              Create free account <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-background/30 px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-background/10"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 font-heading font-semibold text-foreground">
            <AtomMark className="size-5" />
            AtomicTask
          </div>
          <p>© {new Date().getFullYear()} AtomicTask. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link to="/signup" className="hover:text-foreground">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
