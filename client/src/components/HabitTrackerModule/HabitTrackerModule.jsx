import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flame,
  Check,
  TrendingUp,
  BarChart3,
  Calendar,
  Award,
  Target,
  Sparkles,
} from "lucide-react";

// ---- Fixed habits ----
const HABITS = [
  { id: "exercise", name: "Exercise" },
  { id: "read", name: "Read" },
  { id: "meditate", name: "Meditate" },
  { id: "journal", name: "Journal" },
];

// ---- Date helpers ----
const pad = (value) => String(value).padStart(2, "0");

const formatDateKey = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
};

const parseDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (dateKey, amount) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return formatDateKey(date);
};

const getTodayKey = () => formatDateKey(new Date());

const formatPrettyDate = (dateKey) => {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatShortDate = (dateKey) => {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const getDayLabel = (dateKey) => {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: "short",
  });
};

// ---- Generate random data for last 14 days ----
const createInitialState = () => {
  const today = getTodayKey();
  const completed = {};
  for (let offset = -13; offset <= 0; offset += 1) {
    const dateKey = addDays(today, offset);
    completed[dateKey] = {};
    HABITS.forEach((habit) => {
      completed[dateKey][habit.id] = Math.random() < 0.7;
    });
  }
  return completed;
};

// ---- Streak calculator ----
const calculateStreak = (habitId, completed, fromDateKey) => {
  let streak = 0;
  let cursor = fromDateKey;
  while (completed[cursor]?.[habitId]) {
    streak += 1;
    cursor = addDays(cursor, -1);
    if (streak > 3650) break;
  }
  return streak;
};

// ---- Build window of 7 days ----
const calculateWindow = (selectedDate) => {
  return Array.from({ length: 7 }, (_, index) =>
    addDays(selectedDate, -(6 - index)),
  );
};

// ---- Resolve accent color to RGB ----
const getAccentRGB = () => {
  const root = document.documentElement;
  const accentVar = getComputedStyle(root)
    .getPropertyValue("--accent-atomic")
    .trim();
  if (accentVar) {
    const el = document.createElement("div");
    el.style.color = accentVar;
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color;
    document.body.removeChild(el);
    if (rgb && rgb.startsWith("rgb")) {
      const [r, g, b] = rgb.match(/\d+/g).map(Number);
      return { r, g, b };
    }
  }
  return { r: 255, g: 165, b: 0 };
};

// ---- Mix red and accent based on ratio (0 = red, 1 = accent) ----
const mixColor = (ratio, accentRGB) => {
  const red = { r: 230, g: 50, b: 50 };
  const r = Math.round(red.r + (accentRGB.r - red.r) * ratio);
  const g = Math.round(red.g + (accentRGB.g - red.g) * ratio);
  const b = Math.round(red.b + (accentRGB.b - red.b) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
};

// ---- Get message based on completed count ----
const getMessage = (completedCount, total) => {
  const remaining = total - completedCount;
  if (completedCount === 0) return "Don't break your streak!";
  if (completedCount === 1) return `Keep it up! Just ${remaining} more to go`;
  if (completedCount === 2) return `Halfway there! ${remaining} remaining`;
  if (completedCount === 3) return "Almost there! 1 more to go";
  if (completedCount === total) return "🏆 Perfect day! Amazing!";
  return `You're on fire!`;
};

// ---- Habit Row ----
function HabitRow({
  habit,
  checked,
  streak,
  onToggle,
  isDemoTarget,
  onFirstToggle,
}) {
  const rowRef = useRef(null);
  const glowRef = useRef(null);

  const handleToggle = () => {
    onToggle(habit.id);
    onFirstToggle();
  };

  const handleRowClick = () => {
    handleToggle();
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    handleToggle();
  };

  const handleMouseMove = (e) => {
    if (!glowRef.current || !rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.left = `${x}px`;
    glowRef.current.style.top = `${y}px`;
    glowRef.current.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (!glowRef.current) return;
    glowRef.current.style.opacity = "0";
  };

  const isUnchecked = !checked;

  return (
    <div
      ref={rowRef}
      className={`group relative flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-3 transition-all duration-200 overflow-hidden ${
        isUnchecked
          ? "cursor-pointer hover:border-border/80 hover:bg-muted/30"
          : ""
      } ${isDemoTarget && isUnchecked ? "demo-pulse" : ""}`}
      onMouseMove={isUnchecked ? handleMouseMove : undefined}
      onMouseLeave={handleMouseLeave}
      onClick={handleRowClick}
    >
      {/* Demo shimmer */}
      {isDemoTarget && isUnchecked && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="demo-shimmer absolute inset-0 -translate-x-full animate-shimmer" />
        </div>
      )}

      {/* Cursor glow */}
      {isUnchecked && (
        <div
          ref={glowRef}
          className="pointer-events-none absolute size-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle, color-mix(in oklch, var(--accent-atomic) 20%, transparent), transparent 70%)`,
            willChange: "transform, left, top",
          }}
        />
      )}

      {/* Checkbox */}
      <button
        type="button"
        onClick={handleButtonClick}
        aria-label={`${checked ? "Uncomplete" : "Complete"} ${habit.name}`}
        aria-pressed={checked}
        className={`relative z-10 flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
          isUnchecked ? "hover:scale-110" : ""
        } ${isDemoTarget && isUnchecked ? "demo-checkbox" : ""}`}
        style={
          checked
            ? {
                background: "var(--accent-atomic)",
                borderColor: "var(--accent-atomic)",
              }
            : {
                borderColor: "var(--border)",
              }
        }
      >
        {checked && (
          <Check
            className="size-3.5"
            style={{ color: "var(--accent-atomic-foreground)" }}
          />
        )}
      </button>

      <div className="relative z-10 min-w-0 flex-1">
        <div
          className={`text-sm font-medium transition-all ${
            checked ? "text-muted-foreground line-through" : ""
          }`}
        >
          {habit.name}
        </div>

        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Flame
            className="size-3"
            style={{
              color:
                streak > 0 ? "var(--accent-atomic)" : "var(--muted-foreground)",
            }}
          />
          <span>
            {streak} day{streak === 1 ? "" : "s"} streak
          </span>
        </div>
      </div>

      {/* Tap indicator */}
      {isDemoTarget && isUnchecked && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-muted-foreground/50 animate-pulse-slow">
            tap
          </span>
          <div
            className="size-1.5 rounded-full animate-ping"
            style={{ background: "var(--accent-atomic)" }}
          />
        </div>
      )}
    </div>
  );
}

// ---- Daily Graph with winning effect ----
function DailyGraph({
  dates,
  selectedDate,
  completed,
  habits,
  onSelectDate,
  accentRGB,
  isPerfect,
}) {
  const graphData = dates.map((dateKey) => {
    const completedCount = habits.reduce(
      (count, habit) => count + (completed[dateKey]?.[habit.id] ? 1 : 0),
      0,
    );
    const percentage =
      habits.length > 0
        ? Math.round((completedCount / habits.length) * 100)
        : 0;
    return { dateKey, completedCount, percentage };
  });

  const bestDay = graphData.reduce(
    (best, current) => (current.percentage > best.percentage ? current : best),
    { percentage: 0 },
  );

  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Daily Overview</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            Last 7 days ending {formatShortDate(selectedDate)}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp
            className="size-3.5"
            style={{ color: "var(--accent-atomic)" }}
          />
          <span>Best {bestDay.percentage}%</span>
        </div>
      </div>

      <div className="flex h-44 items-end gap-1.5">
        {graphData.map((day, index) => {
          const isSelected = day.dateKey === selectedDate;
          const height = Math.max(day.percentage, 5);
          const ratio = day.percentage / 100;
          const barColor = mixColor(ratio, accentRGB);
          const isPerfectDay = day.percentage === 100;

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => onSelectDate(day.dateKey)}
              className="group relative flex h-full min-w-0 flex-1 flex-col justify-end"
            >
              <div className="relative flex h-full items-end justify-center w-full">
                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 group-hover:translate-y-0 translate-y-1"
                  style={{
                    background:
                      "color-mix(in oklch, var(--background) 95%, transparent)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  }}
                >
                  <div className="text-center">
                    <div className="text-[9px] font-medium text-muted-foreground tracking-wide uppercase">
                      {getDayLabel(day.dateKey)}
                    </div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: barColor }}
                    >
                      {day.percentage}%
                    </div>
                    <div className="text-[8px] text-muted-foreground/60">
                      {formatShortDate(day.dateKey)}
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45"
                    style={{
                      background:
                        "color-mix(in oklch, var(--background) 95%, transparent)",
                      borderRight: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  />
                </div>

                {/* Bar with winning effect */}
                <div
                  className={`w-full max-w-7 rounded-t-md transition-all duration-300 ${
                    index < 3 ? "animate-bar-pulse" : ""
                  } ${isPerfectDay ? "bar-win" : ""}`}
                  style={{
                    height: `${height}%`,
                    background: isSelected ? "var(--accent-atomic)" : barColor,
                    opacity: day.percentage === 0 ? 0.3 : isSelected ? 1 : 0.8,
                    boxShadow: isSelected
                      ? `0 0 20px color-mix(in oklch, var(--accent-atomic) 40%, transparent)`
                      : isPerfectDay
                        ? `0 0 30px color-mix(in oklch, var(--accent-atomic) 60%, transparent)`
                        : "none",
                  }}
                />
              </div>

              <span
                className={`mt-2 text-[9px] transition-colors ${
                  isSelected
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {getDayLabel(day.dateKey).slice(0, 1)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Habit Breakdown Graph ----
function HabitBreakdownGraph({ dates, completed, habits, accentRGB }) {
  const habitData = habits.map((habit) => {
    const count = dates.filter(
      (dateKey) => completed[dateKey]?.[habit.id] === true,
    ).length;
    const percentage = Math.round((count / dates.length) * 100);
    return { habit, count, percentage };
  });

  const best = habitData.reduce(
    (a, b) => (a.percentage > b.percentage ? a : b),
    habitData[0],
  );
  const worst = habitData.reduce(
    (a, b) => (a.percentage < b.percentage ? a : b),
    habitData[0],
  );

  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Habit Breakdown</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            Completion per habit over the last 7 days
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Award
            className="size-3.5"
            style={{ color: "var(--accent-atomic)" }}
          />
          <span>
            Best: {best.habit.name} ({best.percentage}%)
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {habitData.map((item) => {
          const ratio = item.percentage / 100;
          const barColor = mixColor(ratio, accentRGB);
          return (
            <div key={item.habit.id} className="flex items-center gap-3">
              <span className="w-20 text-xs font-medium text-muted-foreground">
                {item.habit.name}
              </span>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    background: barColor,
                    opacity: item.percentage === 0 ? 0.4 : 1,
                  }}
                />
              </div>
              <span className="w-10 text-right text-xs font-semibold">
                {item.percentage}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center text-[10px] text-muted-foreground">
        {best.percentage === worst.percentage
          ? "All habits are equally consistent!"
          : `${best.habit.name} is your strongest habit, ${worst.habit.name} needs more attention.`}
      </div>
    </div>
  );
}

// ---- Main component ----
export default function HabitTrackerModule() {
  const [completed, setCompleted] = useState(createInitialState);
  const [selectedDate, setSelectedDate] = useState(getTodayKey);
  const [accentRGB, setAccentRGB] = useState(() => getAccentRGB());
  const [viewMode, setViewMode] = useState("daily");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [demoTargetId, setDemoTargetId] = useState(null);
  const demoTimeoutRef = useRef(null);
  const isFirstRender = useRef(true);
  const [winningEffect, setWinningEffect] = useState(false);

  const today = getTodayKey();
  const minDate = addDays(today, -6);
  const habits = HABITS;

  useEffect(() => {
    const updateAccent = () => setAccentRGB(getAccentRGB());
    const root = document.documentElement;
    const observer = new MutationObserver(updateAccent);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Show encouragement after first interaction
  useEffect(() => {
    if (hasInteracted) {
      setShowEncouragement(true);
      const timer = setTimeout(() => setShowEncouragement(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  // ---- Data computations ----
  const selectedDateData = completed[selectedDate] || {};
  const completedCount = habits.filter(
    (habit) => selectedDateData[habit.id],
  ).length;
  const completionPercentage =
    habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const isPerfect = completionPercentage === 100;

  // ---- Winning effect (moved here after completionPercentage is defined) ----
  useEffect(() => {
    if (isPerfect) {
      setWinningEffect(true);
      const timer = setTimeout(() => setWinningEffect(false), 6000);
      return () => clearTimeout(timer);
    }
    setWinningEffect(false);
  }, [isPerfect]);

  // ---- Demo effect ----
  const findFirstUncheckedHabit = () => {
    const selectedData = completed[selectedDate] || {};
    return habits.find((h) => !selectedData[h.id]) || null;
  };

  const scheduleDemo = useCallback(() => {
    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
      demoTimeoutRef.current = null;
    }

    const unchecked = habits.filter(
      (h) => !(completed[selectedDate] || {})[h.id],
    );
    if (unchecked.length === 0) {
      setDemoTargetId(null);
      return;
    }

    const delay = 10000 + Math.random() * 10000;
    demoTimeoutRef.current = setTimeout(() => {
      const firstUnchecked = findFirstUncheckedHabit();
      if (firstUnchecked) {
        setDemoTargetId(firstUnchecked.id);
      }
      demoTimeoutRef.current = null;
    }, delay);
  }, [completed, selectedDate, habits]);

  useEffect(() => {
    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
      demoTimeoutRef.current = null;
    }

    const unchecked = habits.filter(
      (h) => !(completed[selectedDate] || {})[h.id],
    );
    if (unchecked.length === 0) {
      setDemoTargetId(null);
      return;
    }

    if (demoTargetId && (completed[selectedDate] || {})[demoTargetId]) {
      setDemoTargetId(null);
      scheduleDemo();
      return;
    }

    if (!demoTargetId) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        const firstUnchecked = findFirstUncheckedHabit();
        if (firstUnchecked) {
          setDemoTargetId(firstUnchecked.id);
        }
        scheduleDemo();
      } else {
        scheduleDemo();
      }
    } else {
      scheduleDemo();
    }

    return () => {
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
        demoTimeoutRef.current = null;
      }
    };
  }, [
    completed,
    selectedDate,
    habits,
    demoTargetId,
    scheduleDemo,
    findFirstUncheckedHabit,
  ]);

  const activityDates = useMemo(
    () => calculateWindow(selectedDate),
    [selectedDate],
  );

  const overallCompletion = useMemo(() => {
    if (!habits.length || !activityDates.length) return 0;
    const totalPossible = habits.length * activityDates.length;
    const totalCompleted = activityDates.reduce(
      (total, dateKey) =>
        total +
        habits.reduce(
          (dayTotal, habit) =>
            dayTotal + (completed[dateKey]?.[habit.id] ? 1 : 0),
          0,
        ),
      0,
    );
    return Math.round((totalCompleted / totalPossible) * 100);
  }, [activityDates, habits, completed]);

  const bestCurrentStreak = useMemo(() => {
    if (!habits.length) return 0;
    return Math.max(
      ...habits.map((habit) =>
        calculateStreak(habit.id, completed, selectedDate),
      ),
    );
  }, [habits, completed, selectedDate]);

  const toggleHabit = (habitId) => {
    setCompleted((prev) => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [habitId]: !prev[selectedDate]?.[habitId],
      },
    }));

    if (demoTargetId === habitId) {
      setDemoTargetId(null);
    }

    if (!hasInteracted) {
      setHasInteracted(true);
    }

    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
      demoTimeoutRef.current = null;
    }
    const delay = 10000 + Math.random() * 10000;
    demoTimeoutRef.current = setTimeout(() => {
      const firstUnchecked = findFirstUncheckedHabit();
      if (firstUnchecked) {
        setDemoTargetId(firstUnchecked.id);
      }
      demoTimeoutRef.current = null;
    }, delay);
  };

  const goToPreviousDay = () => {
    const prev = addDays(selectedDate, -1);
    if (prev >= minDate) setSelectedDate(prev);
  };

  const goToNextDay = () => {
    const next = addDays(selectedDate, 1);
    if (next <= today) setSelectedDate(next);
  };

  const goToToday = () => {
    setSelectedDate(today);
  };

  const message = getMessage(completedCount, habits.length);
  const ratio = completionPercentage / 100;
  const barColor = mixColor(ratio, accentRGB);
  const circleColor = mixColor(ratio, accentRGB);

  const habitCounts = habits.map((habit) => {
    const count = activityDates.filter(
      (dateKey) => completed[dateKey]?.[habit.id] === true,
    ).length;
    return {
      habit,
      count,
      percentage: Math.round((count / activityDates.length) * 100),
    };
  });
  const totalPossible = habits.length * activityDates.length;
  const totalCompleted = activityDates.reduce(
    (total, dateKey) =>
      total +
      habits.reduce(
        (dayTotal, habit) =>
          dayTotal + (completed[dateKey]?.[habit.id] ? 1 : 0),
        0,
      ),
    0,
  );
  const weeklyCompletion =
    totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  const bestHabit = habitCounts.reduce(
    (a, b) => (a.percentage > b.percentage ? a : b),
    habitCounts[0],
  );
  const worstHabit = habitCounts.reduce(
    (a, b) => (a.percentage < b.percentage ? a : b),
    habitCounts[0],
  );

  const firstUnchecked = findFirstUncheckedHabit();

  return (
    <section
      id="habits"
      className="border-y border-border/70 bg-muted/20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Interactive habit tracking
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Build the streak one day at a time
          </h2>
          <p className="mt-3 text-muted-foreground">
            Check habits off, switch dates, and watch your activity change
            instantly.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            className="absolute -inset-8 -z-10 rounded-[2rem] blur-3xl"
            style={{
              background:
                "color-mix(in oklch, var(--accent-atomic) 12%, transparent)",
            }}
          />

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            {/* Header */}
            <div className="border-b border-border/70 p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-semibold">Habit tracker</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Interactive landing‑page demo
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousDay}
                    aria-label="Previous day"
                    disabled={selectedDate === minDate}
                    className={`flex size-9 items-center justify-center rounded-lg border border-border transition-colors ${
                      selectedDate === minDate
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-muted"
                    }`}
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  <div className="flex min-w-[220px] items-center justify-center gap-2 rounded-lg border border-border px-3 py-2">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={selectedDate}
                      min={minDate}
                      max={today}
                      onChange={(event) => setSelectedDate(event.target.value)}
                      className="bg-transparent text-sm font-medium outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={goToNextDay}
                    aria-label="Next day"
                    disabled={selectedDate === today}
                    className={`flex size-9 items-center justify-center rounded-lg border border-border transition-colors ${
                      selectedDate === today
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-muted"
                    }`}
                  >
                    <ChevronRight className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={goToToday}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted"
                  >
                    Today
                  </button>
                </div>
              </div>
            </div>

            {/* Main */}
            <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Left: Habits */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      {formatPrettyDate(selectedDate)}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold">
                      {completedCount} of {habits.length} completed
                    </h3>

                    {/* Message Badge */}
                    <div
                      className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 ${
                        showEncouragement ? "scale-105 shadow-lg" : ""
                      } ${isPerfect ? "message-win" : ""}`}
                      style={{
                        background: `color-mix(in oklch, ${circleColor} 12%, transparent)`,
                        border: `1px solid color-mix(in oklch, ${circleColor} 20%, transparent)`,
                      }}
                    >
                      <Sparkles
                        className={`size-3.5 transition-all duration-500 ${
                          showEncouragement ? "rotate-180" : ""
                        }`}
                        style={{ color: circleColor }}
                      />
                      <span
                        className={`text-xs font-medium transition-all duration-500 ${
                          showEncouragement ? "text-sm" : ""
                        }`}
                        style={{ color: circleColor }}
                      >
                        {showEncouragement ? "✨ Nice! Keep going!" : message}
                      </span>
                    </div>
                  </div>

                  {/* Percentage Circle with Winning Effect */}
                  <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                      isPerfect ? "circle-win" : ""
                    }`}
                    style={{
                      background: `color-mix(in oklch, ${circleColor} 12%, transparent)`,
                      border: `2px solid color-mix(in oklch, ${circleColor} 30%, transparent)`,
                      animation: isPerfect
                        ? "winning-pulse 0.8s ease-in-out 8"
                        : "none",
                    }}
                  >
                    <span
                      className={`text-sm font-bold transition-colors duration-300 ${
                        isPerfect ? "text-accent-atomic" : ""
                      }`}
                      style={{ color: circleColor }}
                    >
                      {completionPercentage}%
                    </span>

                    {/* Confetti overlay on circle */}
                    {isPerfect && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                        <div className="confetti-container">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="confetti-piece"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 0.5}s`,
                                animationDuration: `${0.8 + Math.random() * 0.6}s`,
                                background:
                                  i % 2 === 0
                                    ? "var(--accent-atomic)"
                                    : `hsl(${Math.random() * 60 + 30}, 80%, 60%)`,
                                width: `${3 + Math.random() * 4}px`,
                                height: `${3 + Math.random() * 4}px`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${completionPercentage}%`,
                      background: barColor,
                    }}
                  />
                </div>

                {/* Habit list */}
                <div className="mt-5 space-y-2.5">
                  {habits.map((habit) => {
                    const isChecked = Boolean(selectedDateData[habit.id]);
                    const isDemo =
                      !isChecked &&
                      (demoTargetId === habit.id ||
                        (demoTargetId === null &&
                          firstUnchecked?.id === habit.id &&
                          !hasInteracted));
                    return (
                      <HabitRow
                        key={habit.id}
                        habit={habit}
                        checked={isChecked}
                        streak={calculateStreak(
                          habit.id,
                          completed,
                          selectedDate,
                        )}
                        onToggle={toggleHabit}
                        isDemoTarget={isDemo}
                        onFirstToggle={() => {
                          if (!hasInteracted) setHasInteracted(true);
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Right: Graphs */}
              <div className="space-y-4">
                {/* View toggle */}
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("daily")}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      viewMode === "daily"
                        ? "bg-accent-atomic text-accent-atomic-foreground"
                        : "text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Calendar className="size-3.5" />
                      Daily
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("habit")}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      viewMode === "habit"
                        ? "bg-accent-atomic text-accent-atomic-foreground"
                        : "text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <BarChart3 className="size-3.5" />
                      Habit Breakdown
                    </span>
                  </button>
                </div>

                {/* Graph */}
                <div className="transition-all duration-300">
                  {viewMode === "daily" ? (
                    <DailyGraph
                      dates={activityDates}
                      selectedDate={selectedDate}
                      completed={completed}
                      habits={habits}
                      onSelectDate={setSelectedDate}
                      accentRGB={accentRGB}
                      isPerfect={isPerfect}
                    />
                  ) : (
                    <HabitBreakdownGraph
                      dates={activityDates}
                      completed={completed}
                      habits={habits}
                      accentRGB={accentRGB}
                    />
                  )}
                </div>

                {/* Stats */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Flame className="size-3.5" />
                      Best streak
                    </div>
                    <div className="mt-1 text-2xl font-bold">
                      {bestCurrentStreak}
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                      consecutive days
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="size-3.5" />
                      7‑day completion
                    </div>
                    <div className="mt-1 text-2xl font-bold">
                      {overallCompletion}%
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                      based on actual activity
                    </div>
                  </div>
                </div>

                {/* Weekly summary */}
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <Target
                      className="size-3.5"
                      style={{ color: "var(--accent-atomic)" }}
                    />
                    <span>This week's habit breakdown</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Best:</span>{" "}
                      <span className="font-medium">
                        {bestHabit?.habit?.name} ({bestHabit?.percentage}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Needs work:</span>{" "}
                      <span className="font-medium">
                        {worstHabit?.habit?.name} ({worstHabit?.percentage}%)
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">
                        Weekly completion:
                      </span>{" "}
                      <span
                        className="font-medium"
                        style={{ color: circleColor }}
                      >
                        {weeklyCompletion}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes bar-pulse {
          0% { opacity: 0.7; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.05); }
          100% { opacity: 0.7; transform: scaleY(1); }
        }
        .animate-bar-pulse {
          animation: bar-pulse 2s ease-in-out 2;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s ease-in-out infinite;
        }
        .demo-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in oklch, var(--accent-atomic) 8%, transparent),
            transparent
          );
          width: 60%;
          height: 100%;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @keyframes ping {
          0% { transform: scale(0.8); opacity: 1; }
          70% { transform: scale(1.8); opacity: 0.3; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        .animate-ping {
          animation: ping 1.5s ease-in-out infinite;
        }

        @keyframes pulse-soft {
          0%, 100% { 
            box-shadow: 0 0 0 0 color-mix(in oklch, var(--accent-atomic) 20%, transparent);
            border-color: var(--border);
          }
          50% { 
            box-shadow: 0 0 0 6px color-mix(in oklch, var(--accent-atomic) 5%, transparent);
            border-color: color-mix(in oklch, var(--accent-atomic) 30%, var(--border));
          }
        }
        .demo-pulse {
          animation: pulse-soft 2.5s ease-in-out infinite;
        }

        @keyframes checkbox-bounce {
          0%, 100% { transform: scale(1); }
          30% { transform: scale(1.15); }
          60% { transform: scale(0.9); }
        }
        .demo-checkbox {
          animation: checkbox-bounce 2s ease-in-out infinite;
        }

        /* ---- Winning Effects ---- */
        /* ---- Winning Effects ---- */@keyframes winning-pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 color-mix(in oklch, var(--accent-atomic) 50%, transparent);
          }
          25% { transform: scale(1.08); }
          50% { 
            transform: scale(1);
            box-shadow: 0 0 40px 10px color-mix(in oklch, var(--accent-atomic) 30%, transparent);
          }
          75% { transform: scale(1.05); }
        }
        .circle-win {
          animation: winning-pulse 0.8s ease-in-out 1 !important;
          position: relative;
        }

        .message-win {
          animation: winning-pulse 0.8s ease-in-out 1 !important;
        }

        /* Confetti */
        .confetti-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 50%;
        }
        .confetti-piece {
          position: absolute;
          border-radius: 2px;
          animation: confetti-fall 1s ease-out forwards;
          opacity: 0;
        }
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) rotate(720deg) scale(0);
          }
        }

        /* Bar winning glow */
        .bar-win {
          animation: bar-win-glow 0.6s ease-in-out 6 !important;
        }
        @keyframes bar-win-glow {
          0%, 100% { 
            filter: brightness(1);
            transform: scaleY(1);
          }
          50% { 
            filter: brightness(1.4);
            transform: scaleY(1.05);
          }
        }
      `}</style>
    </section>
  );
}
