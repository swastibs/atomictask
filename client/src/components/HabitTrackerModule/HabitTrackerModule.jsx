import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BarChart3,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  MousePointer2,
  Target,
  TrendingUp,
} from "lucide-react";
import "./HabitTrackerModule.css";

const HABITS = [
  { id: "move", name: "Move your body", mark: "M", detail: "20 min movement" },
  { id: "read", name: "Read", mark: "R", detail: "10 pages" },
  { id: "focus", name: "Deep focus", mark: "F", detail: "One focused block" },
  { id: "reflect", name: "Reflect", mark: "J", detail: "Write a few lines" },
];
// Change this value to control how many times the completion glow can fire per visit.
const WIN_EFFECT_LIMIT = 3;
const pad = (value) => String(value).padStart(2, "0");
const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const todayKey = () => dateKey(new Date());
const parseDate = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const addDays = (key, amount) => {
  const date = parseDate(key);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
};
const prettyDate = (key) =>
  parseDate(key).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
const shortDate = (key) =>
  parseDate(key).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
const dayName = (key) =>
  parseDate(key).toLocaleDateString(undefined, { weekday: "short" });
const createInitialState = () => {
  const today = todayKey();
  const state = {};
  for (let offset = -6; offset <= 0; offset += 1) {
    const key = addDays(today, offset);
    state[key] = {};
    HABITS.forEach((habit, index) => {
      state[key][habit.id] = Math.random() > (index === 0 ? 0.35 : 0.25);
    });
  }
  return state;
};
const progressColor = (percentage) =>
  percentage === 0
    ? "#e05252"
    : `color-mix(in oklch, var(--accent-atomic) ${percentage}%, #e05252)`;
const getDailyStats = (dates, completed) =>
  dates.map((key) => {
    const count = HABITS.filter((habit) => completed[key]?.[habit.id]).length;
    return {
      key,
      count,
      percentage: Math.round((count / HABITS.length) * 100),
    };
  });
const getStreak = (habitId, completed, start) => {
  let streak = 0;
  let cursor = start;
  while (completed[cursor]?.[habitId]) {
    streak += 1;
    cursor = addDays(cursor, -1);
    if (streak > 365) break;
  }
  return streak;
};

function HabitRow({ habit, checked, streak, onToggle, showHint }) {
  return (
    <button
      type="button"
      className={`habit-row ${checked ? "is-complete" : ""} ${showHint ? "is-hint" : ""}`}
      onClick={() => onToggle(habit.id)}
      aria-pressed={checked}
    >
      <span className="habit-mark">
        {checked ? <Check size={15} strokeWidth={2.5} /> : habit.mark}
      </span>
      <span className="habit-copy">
        <span className="habit-name">{habit.name}</span>
        <span className="habit-detail">
          <Flame size={12} /> {streak} day{streak === 1 ? "" : "s"} streak <i />{" "}
          {habit.detail}
        </span>
      </span>
      {!checked && showHint && (
        <MousePointer2
          className="habit-hint-cursor"
          size={17}
          aria-hidden="true"
        />
      )}
      <span className="habit-status">{checked ? "Done" : "Open"}</span>
    </button>
  );
}

function DailyGraph({ stats, selectedDate, onSelect }) {
  const best = Math.max(...stats.map((item) => item.percentage));
  return (
    <div className="tracker-panel graph-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Activity rhythm</span>
          <h4>Daily completion</h4>
        </div>
        <span className="panel-kicker">
          <TrendingUp size={14} /> Best {best}%
        </span>
      </div>
      <div className="daily-chart" aria-label="Daily completion graph">
        {stats.map((item) => (
          <button
            type="button"
            className={`day-column ${item.key === selectedDate ? "selected" : ""}`}
            key={item.key}
            onClick={() => onSelect(item.key)}
          >
            <span className="chart-tooltip">
              <strong>{item.percentage}%</strong>
              <small>
                {shortDate(item.key)} · {item.count}/{HABITS.length} done
              </small>
            </span>
            <span className="bar-track">
              <span
                className={`chart-bar ${item.percentage === 100 ? "bar-perfect" : ""}`}
                style={{
                  height: `${Math.max(item.percentage, 4)}%`,
                  background: progressColor(item.percentage),
                }}
              />
            </span>
            <span className="day-label">{dayName(item.key).slice(0, 2)}</span>
            <span className="day-number">{parseDate(item.key).getDate()}</span>
          </button>
        ))}
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-dot danger" /> Missed
        </span>
        <span>
          <i className="legend-dot progress" /> In progress
        </span>
        <span>
          <i className="legend-dot complete" /> Complete
        </span>
      </div>
    </div>
  );
}

function HabitGraph({ dates, completed }) {
  const rows = HABITS.map((habit) => {
    const count = dates.filter((key) => completed[key]?.[habit.id]).length;
    return {
      habit,
      count,
      percentage: Math.round((count / dates.length) * 100),
    };
  });
  return (
    <div className="tracker-panel graph-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Consistency signal</span>
          <h4>Habit-wise weekly report</h4>
        </div>
        <span className="panel-kicker">
          <Award size={14} /> 7 day view
        </span>
      </div>
      <div className="habit-report">
        {rows.map(({ habit, count, percentage }) => (
          <div className="report-row" key={habit.id}>
            <div className="report-label">
              <span className="habit-report-mark">{habit.mark}</span>
              <span>{habit.name}</span>
            </div>
            <div className="report-track">
              <span
                style={{
                  width: `${percentage}%`,
                  background: progressColor(percentage),
                }}
              />
            </div>
            <strong>{percentage}%</strong>
            <small>{count}/7</small>
          </div>
        ))}
      </div>
      <div className="report-note">
        <Target size={14} /> Every small repeat compounds into a stronger week.
      </div>
    </div>
  );
}

export default function HabitTrackerModule() {
  const today = todayKey();
  const minDate = addDays(today, -6);
  const [selectedDate, setSelectedDate] = useState(today);
  const [completed, setCompleted] = useState(createInitialState);
  const [viewMode, setViewMode] = useState("daily");
  const [showHint, setShowHint] = useState(false);
  const [winPulseKey, setWinPulseKey] = useState(0);
  const winCountRef = useRef(0);
  const dates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        addDays(selectedDate, -(6 - index)),
      ),
    [selectedDate],
  );
  const dailyStats = useMemo(
    () => getDailyStats(dates, completed),
    [dates, completed],
  );
  const selectedData = completed[selectedDate] || {};
  const completedCount = HABITS.filter(
    (habit) => selectedData[habit.id],
  ).length;
  const percentage = Math.round((completedCount / HABITS.length) * 100);
  const weeklyTotal = dailyStats.reduce((sum, item) => sum + item.count, 0);
  const weeklyPercentage = Math.round(
    (weeklyTotal / (HABITS.length * dates.length)) * 100,
  );
  const bestStreak = Math.max(
    ...HABITS.map((habit) => getStreak(habit.id, completed, selectedDate)),
  );
  const firstUnchecked = HABITS.find((habit) => !selectedData[habit.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(true), 12000);
    return () => window.clearTimeout(timer);
  }, [selectedDate, completed, firstUnchecked?.id]);
  const toggleHabit = (habitId) => {
    const completesDay = HABITS.every(
      (habit) => habit.id === habitId || selectedData[habit.id],
    );
    setCompleted((previous) => ({
      ...previous,
      [selectedDate]: {
        ...(previous[selectedDate] || {}),
        [habitId]: !previous[selectedDate]?.[habitId],
      },
    }));
    setShowHint(false);
    if (
      completesDay &&
      !selectedData[habitId] &&
      winCountRef.current < WIN_EFFECT_LIMIT
    ) {
      winCountRef.current += 1;
      setWinPulseKey((key) => key + 1);
    }
  };
  const selectDate = (key) => {
    if (key >= minDate && key <= today) {
      setShowHint(false);
      setSelectedDate(key);
    }
  };
  const message =
    percentage === 0
      ? "Don't break your streak"
      : percentage === 100
        ? "Perfect day. Keep the signal strong"
        : percentage < 50
          ? `Keep it up. ${HABITS.length - completedCount} more to go`
          : "You're building real momentum";
  const streakText =
    bestStreak > 0 ? `${bestStreak} day streak` : "Start a streak today";

  return (
    <section id="habits" className="habit-section">
      <div className="habit-shell">
        <div className="habit-intro">
          <span className="eyebrow">A calmer way to stay consistent</span>
          <h2>Make progress visible.</h2>
          <p>
            A focused weekly view for the habits that move your day forward.
          </p>
        </div>
        <div className="tracker-card">
          <header className="tracker-header">
            <div>
              <div className="brand-line">
                <span className="brand-dot" /> ATOMIC / HABITS
              </div>
              <p>Personal rhythm dashboard</p>
            </div>
            <div className="date-controls">
              <button
                type="button"
                onClick={() => selectDate(addDays(selectedDate, -1))}
                disabled={selectedDate === minDate}
                aria-label="Previous day"
              >
                <ChevronLeft size={17} />
              </button>
              <label>
                <CalendarDays size={15} />
                <input
                  type="date"
                  value={selectedDate}
                  min={minDate}
                  max={today}
                  onChange={(event) => selectDate(event.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={() => selectDate(addDays(selectedDate, 1))}
                disabled={selectedDate === today}
                aria-label="Next day"
              >
                <ChevronRight size={17} />
              </button>
              <button
                type="button"
                className="today-button"
                onClick={() => setSelectedDate(today)}
              >
                Today
              </button>
            </div>
          </header>
          <div className="tracker-content">
            <div className="habit-column">
              <div className="section-top">
                <div>
                  <span className="eyebrow">{prettyDate(selectedDate)}</span>
                  <h3>
                    {completedCount} <span>/ {HABITS.length} complete</span>
                  </h3>
                  <p
                    className="status-message"
                    style={{ color: progressColor(percentage) }}
                  >
                    {message}
                  </p>
                </div>
                <div
                  key={winPulseKey}
                  className={`completion-ring ${percentage === 100 && winPulseKey ? "ring-win" : ""}`}
                  style={{ "--ring-color": progressColor(percentage) }}
                >
                  <strong>
                    {percentage}
                    <small>%</small>
                  </strong>
                  <span>today</span>
                </div>
              </div>
              <div className="progress-line">
                <span
                  style={{
                    width: `${percentage}%`,
                    background: progressColor(percentage),
                  }}
                />
              </div>
              <div className="habit-list">
                {HABITS.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    checked={Boolean(selectedData[habit.id])}
                    streak={getStreak(habit.id, completed, selectedDate)}
                    onToggle={toggleHabit}
                    showHint={showHint && firstUnchecked?.id === habit.id}
                  />
                ))}
              </div>
              <div className="interaction-note">
                <MousePointer2 size={14} /> Tap a habit row to update your day
              </div>
            </div>
            <div className="insight-column">
              <div className="view-switcher">
                <button
                  type="button"
                  className={viewMode === "daily" ? "active" : ""}
                  onClick={() => setViewMode("daily")}
                >
                  <BarChart3 size={15} /> Daily rhythm
                </button>
                <button
                  type="button"
                  className={viewMode === "habit" ? "active" : ""}
                  onClick={() => setViewMode("habit")}
                >
                  <Target size={15} /> Weekly by habit
                </button>
              </div>
              {viewMode === "daily" ? (
                <DailyGraph
                  stats={dailyStats}
                  selectedDate={selectedDate}
                  onSelect={selectDate}
                />
              ) : (
                <HabitGraph dates={dates} completed={completed} />
              )}
              <div className="stats-grid">
                <div className="stat-card">
                  <Flame size={16} />
                  <span>Best streak</span>
                  <strong>{bestStreak}</strong>
                  <small>{streakText}</small>
                </div>
                <div className="stat-card">
                  <TrendingUp size={16} />
                  <span>Weekly completion</span>
                  <strong>{weeklyPercentage}%</strong>
                  <small>Across all habits</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
