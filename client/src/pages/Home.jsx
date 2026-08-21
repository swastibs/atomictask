import { lazy, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCheck,
  Flame,
  GitBranch,
  Target,
  AlertCircle,
  Zap,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import CursorGrid from "@/components/CursorGrid/CursorGrid";
import DeferredModule from "@/components/DeferredModule";

const HabitTrackerModule = lazy(() => import("@/components/HabitTrackerModule/HabitTrackerModule"));
const AITaskTrackerModule = lazy(() => import("@/components/AITaskTrackerModule/AITaskTrackerModule"));

// ============================================================
// Background decorative layer
// ============================================================

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

  const dots = [
    { x: 8, y: 12, size: 3, hue: 15, duration: 6 },
    { x: 22, y: 28, size: 4, hue: 72, duration: 8 },
    { x: 38, y: 16, size: 2, hue: 130, duration: 5 },
    { x: 54, y: 34, size: 4, hue: 185, duration: 9 },
    { x: 67, y: 12, size: 3, hue: 230, duration: 7 },
    { x: 83, y: 24, size: 4, hue: 275, duration: 8 },
    { x: 94, y: 42, size: 3, hue: 320, duration: 6 },
    { x: 14, y: 48, size: 2, hue: 45, duration: 9 },
    { x: 31, y: 58, size: 4, hue: 95, duration: 7 },
    { x: 49, y: 52, size: 3, hue: 150, duration: 6 },
    { x: 63, y: 68, size: 4, hue: 205, duration: 8 },
    { x: 79, y: 55, size: 2, hue: 255, duration: 9 },
    { x: 91, y: 73, size: 4, hue: 300, duration: 7 },
    { x: 18, y: 76, size: 3, hue: 35, duration: 6 },
    { x: 36, y: 85, size: 4, hue: 85, duration: 8 },
    { x: 52, y: 92, size: 2, hue: 140, duration: 7 },
    { x: 71, y: 84, size: 3, hue: 195, duration: 9 },
    { x: 88, y: 93, size: 4, hue: 245, duration: 6 },
    { x: 5, y: 65, size: 3, hue: 290, duration: 8 },
    { x: 44, y: 42, size: 2, hue: 340, duration: 7 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div className="absolute inset-0 transition-all duration-1000">
        {shapes.map((shape, index) => {
          const size = isBefore ? shape.size : shape.size * 0.4;
          const opacity = isBefore ? 0.75 : 0.15;
          const blur = isBefore ? "0px" : "2px";

          const color = isBefore
            ? `hsl(${index * 18 + 20}, 80%, 60%)`
            : "var(--muted-foreground)";

          const transform = isBefore
            ? `translate(${shape.x}%, ${shape.y}%) rotate(${shape.rot}deg) scale(1)`
            : `translate(${shape.x}%, ${shape.y}%) rotate(0deg) scale(0.8)`;

          return (
            <div
              key={index}
              className="absolute rounded-full transition-all duration-1000 ease-in-out"
              style={{
                width: size,
                height: size,
                left: 0,
                top: 0,
                background: color,
                transform,
                opacity,
                filter: `blur(${blur})`,
                animation: `float-${index % 5} ${
                  6 + (index % 7)
                }s ease-in-out infinite alternate`,
              }}
            />
          );
        })}
      </div>

      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isBefore ? 0.6 : 0.1,
        }}
      >
        <svg className="h-full w-full">
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
          {dots.map((dot, index) => (
            <div
              key={`dot-${index}`}
              className="absolute rounded-full"
              style={{
                width: dot.size,
                height: dot.size,
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                background: `hsl(${dot.hue}, 60%, 50%)`,
                opacity: 0.45,
                animation: `dot-float ${dot.duration}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes float-0 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }

          100% {
            transform: translate(20px, -30px) rotate(30deg);
          }
        }

        @keyframes float-1 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }

          100% {
            transform: translate(-25px, 15px) rotate(-20deg);
          }
        }

        @keyframes float-2 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }

          100% {
            transform: translate(30px, 20px) rotate(45deg);
          }
        }

        @keyframes float-3 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }

          100% {
            transform: translate(-15px, -35px) rotate(-15deg);
          }
        }

        @keyframes float-4 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }

          100% {
            transform: translate(10px, 40px) rotate(60deg);
          }
        }

        @keyframes dot-float {
          0% {
            transform: translate(0, 0);
          }

          100% {
            transform: translate(15px, -20px);
          }
        }

        @keyframes orbit-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbit-counter-spin {
          from {
            transform: translateX(-50%) translateY(-50%) rotate(0deg);
          }

          to {
            transform: translateX(-50%) translateY(-50%) rotate(-360deg);
          }
        }

        @keyframes atomic-pulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// AtomMark
// ============================================================

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

// ============================================================
// Orbit ring
// ============================================================

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

// ============================================================
// Orbit diagram
// ============================================================

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

// ============================================================
// Steps
// ============================================================

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

// ============================================================
// Tasks
// ============================================================

const beforeTasks = [
  {
    id: 1,
    label: "Write report for Q3",
    priority: "high",
    done: false,
    due: "Overdue",
  },
  {
    id: 2,
    label: "Buy groceries",
    priority: "low",
    done: false,
    due: "Tomorrow",
  },
  {
    id: 3,
    label: "Clean inbox",
    priority: "medium",
    done: false,
    due: "Today",
  },
  {
    id: 4,
    label: "Call mom",
    priority: "high",
    done: false,
    due: "Yesterday",
  },
  {
    id: 5,
    label: "Review budget",
    priority: "low",
    done: false,
    due: "Next week",
  },
  {
    id: 6,
    label: "Plan vacation",
    priority: "medium",
    done: false,
    due: "Someday",
  },
];

const afterTasks = [
  {
    id: 1,
    label: "Draft investor update",
    priority: "high",
    done: true,
  },
  {
    id: 2,
    label: "Review PR #142",
    priority: "medium",
    done: true,
  },
  {
    id: 3,
    label: "Outline onboarding flow",
    priority: "high",
    done: true,
  },
  {
    id: 4,
    label: "Call Sarah re: pricing",
    priority: "medium",
    done: true,
  },
  {
    id: 5,
    label: "Write changelog entry",
    priority: "low",
    done: false,
  },
  {
    id: 6,
    label: "Plan next sprint",
    priority: "medium",
    done: false,
  },
];

// ============================================================
// Before / After habits
// ============================================================

const beforeHabits = [
  {
    name: "Exercise",
    streak: 1,
    total: 12,
  },
  {
    name: "Read",
    streak: 0,
    total: 5,
  },
  {
    name: "Meditate",
    streak: 2,
    total: 8,
  },
  {
    name: "Journal",
    streak: 0,
    total: 3,
  },
];

const afterHabits = [
  {
    name: "Exercise",
    streak: 18,
    total: 20,
  },
  {
    name: "Read",
    streak: 12,
    total: 12,
  },
  {
    name: "Meditate",
    streak: 9,
    total: 10,
  },
  {
    name: "Journal",
    streak: 7,
    total: 8,
  },
];

const beforeHeatmap = [
  0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
  0, 0,
].map(Boolean);

const afterHeatmap = new Array(28).fill(true);

// ============================================================
// Interactive before / after demo
// ============================================================

function InteractiveDemo({ viewMode }) {
  const isBefore = viewMode === "before";

  const habits = isBefore ? beforeHabits : afterHabits;

  const heatmap = isBefore ? beforeHeatmap : afterHeatmap;

  const [interactiveTasks, setInteractiveTasks] = useState(
    isBefore ? beforeTasks : afterTasks,
  );

  const toggleTask = (id) => {
    if (isBefore) {
      return;
    }

    setInteractiveTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
            }
          : task,
      ),
    );
  };

  const visibleTasks = interactiveTasks;

  const totalDone = visibleTasks.filter((task) => task.done).length;

  const totalTasks = visibleTasks.length;

  const completion =
    totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  const activeStreaks = habits.filter((habit) => habit.streak > 0).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all duration-500 ease-in-out">
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
            {visibleTasks.map((task) => {
              const isOverdue =
                task.due === "Overdue" || task.due === "Yesterday";

              return (
                <li
                  key={task.id}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                    isBefore
                      ? "bg-muted/30 hover:bg-muted/50"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      task.done ? "border-transparent" : "border-border"
                    }`}
                    style={
                      task.done
                        ? {
                            background: "var(--accent-atomic)",
                          }
                        : undefined
                    }
                    disabled={isBefore}
                    aria-label={
                      task.done ? "Mark as incomplete" : "Mark as complete"
                    }
                  >
                    {task.done && (
                      <Check
                        className="size-3"
                        style={{
                          color: "var(--accent-atomic-foreground)",
                        }}
                      />
                    )}
                  </button>

                  <span
                    className={`flex-1 ${
                      task.done ? "text-muted-foreground line-through" : ""
                    } ${
                      isBefore && !task.done && isOverdue
                        ? "text-destructive"
                        : ""
                    }`}
                  >
                    {task.label}
                  </span>

                  {isBefore && !task.done && (
                    <span
                      className={`text-[10px] font-medium ${
                        isOverdue ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {task.due}
                    </span>
                  )}

                  {!isBefore && !task.done && (
                    <span
                      className="text-[10px] font-medium"
                      style={{
                        color:
                          task.priority === "high"
                            ? "var(--accent-atomic)"
                            : "var(--muted-foreground)",
                      }}
                    >
                      {task.priority}
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
                style={{
                  color: "var(--accent-atomic)",
                }}
              />

              <span>Click a task to update completion</span>
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
                : `${activeStreaks} ${
                    activeStreaks === 1 ? "streak" : "streaks"
                  }`}
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {habits.map((habit) => (
              <li
                key={habit.name}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block size-2 rounded-full ${
                      habit.streak > 0
                        ? isBefore
                          ? "bg-muted-foreground/30"
                          : "bg-accent-atomic"
                        : "bg-muted-foreground/20"
                    }`}
                  />

                  {habit.name}
                </span>

                <span
                  className={`text-xs font-medium ${
                    habit.streak > 0
                      ? isBefore
                        ? "text-muted-foreground"
                        : "text-accent-atomic"
                      : "text-muted-foreground"
                  }`}
                >
                  {isBefore
                    ? `${habit.streak}/${habit.total}`
                    : `${habit.streak} days`}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-border/70 pt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {isBefore ? "Inconsistent activity" : "Active streaks"}
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
              {heatmap.map((filled, index) => (
                <span
                  key={index}
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
                Start your transformation
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Home
// ============================================================

export default function Home() {
  const [viewMode, setViewMode] = useState("after");

  const isBefore = viewMode === "before";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Global CursorGrid */}
      <div className="pointer-events-none fixed inset-0 z-0">
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
          maxOpacity={0.4}
          fillOpacity={0}
          gridOpacity={0.05}
          cellRadius={6}
          clickPulse
          pulseSpeed={600}
        />
      </div>

      <BackgroundDecor viewMode={viewMode} />

      {/* ======================================================
          NAV
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

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
                style={{
                  background: "var(--accent-atomic)",
                }}
              />
              Task & habit system
            </span>

            <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Break the big thing into the{" "}
              <span
                style={{
                  color: "var(--accent-atomic)",
                }}
              >
                next
              </span>{" "}
              thing.
            </h1>

            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              AtomicTask turns overwhelming goals into small, trackable actions
              — so you always know exactly what to do next, and can see the
              streak you're building.
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

      {/* ======================================================
          HOW IT WORKS
      ====================================================== */}

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
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/20"
            >
              <span className="font-heading text-sm font-semibold text-muted-foreground/70">
                0{index + 1}
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
                  style={{
                    color: "var(--accent-atomic)",
                  }}
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

      {/* ======================================================
          HABIT TRACKER
      ====================================================== */}

      <div className="flex flex-col">
        <DeferredModule><HabitTrackerModule /></DeferredModule>
        <DeferredModule><AITaskTrackerModule /></DeferredModule>
      </div>

      {/* ======================================================
          BEFORE / AFTER
      ====================================================== */}

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

            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              See how AtomicTask takes the chaos and turns it into clarity.
            </p>
          </div>

          {/* Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium transition-colors ${
                isBefore ? "text-foreground" : "text-muted-foreground"
              }`}
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
              className={`text-sm font-medium transition-colors ${
                !isBefore ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              After
            </span>
          </div>

          {/* Demo */}
          <div className="relative mt-8">
            <div
              className="absolute -inset-6 -z-10 rounded-3xl blur-3xl"
              style={{
                background:
                  "color-mix(in oklch, var(--accent-atomic) 18%, transparent)",
              }}
            />

            <InteractiveDemo viewMode={viewMode} />
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA
      ====================================================== */}

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

      {/* ======================================================
          FOOTER
      ====================================================== */}

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
