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
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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

const mockTasks = [
  { label: "Draft investor update", done: true },
  { label: "Review PR #142", done: true },
  { label: "Outline onboarding flow", done: true },
  { label: "Call Sarah re: pricing", done: true },
  { label: "Write changelog entry", done: false },
  { label: "Plan next sprint", done: false },
];

// Hardcoded, not random — a random heatmap re-shuffles on every re-render.
const heatmap = [
  1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
  0, 1,
].map(Boolean);

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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
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
              Get started
              <ArrowRight className="size-3.5" />
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
              Task &amp; habit system
            </span>

            <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Break the big thing into the{" "}
              <span style={{ color: "var(--accent-atomic)" }}>next</span> thing.
            </h1>

            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              AtomicTask turns overwhelming goals into small, trackable actions
              — so you always know exactly what to do next, and can see the
              streak you&apos;re building.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup" className="cta-button">
                Start free
                <ArrowRight className="size-4" />
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
              The dashboard shows exactly what&apos;s due right now and how your
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
                {mockTasks.map((t) => (
                  <li
                    key={t.label}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm"
                  >
                    <span
                      className={`flex size-4 items-center justify-center rounded-full border ${
                        t.done ? "border-transparent" : "border-border"
                      }`}
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
                  {heatmap.map((filled, i) => (
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

      {/* Final CTA band */}
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
              Create free account
              <ArrowRight className="size-4" />
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
