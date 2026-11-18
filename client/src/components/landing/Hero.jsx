import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsPanels,
  TabsTab,
} from "@/components/keyframery/primitives/tabs";

const FOCUS_TIMER_STORAGE_KEY = "atomictasks:landing-focus-timer:v1";
const FOCUS_DURATIONS = [5, 15, 25];
const TODAY_LABEL = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "short",
  day: "numeric",
}).format(new Date());
const INITIAL_TASKS = [
  { id: "next-thing", title: "Pick the one next thing", minutes: 10, done: true },
  { id: "project-update", title: "Send the project update", minutes: 25, done: false },
  { id: "lunch-break", title: "Take a proper lunch break", minutes: 30, done: false },
  { id: "daily-review", title: "Review today’s wins", minutes: 5, done: true },
];
const SAMPLE_HABITS = [
  { id: "water", title: "Drink a glass of water", streak: 5, done: true },
  { id: "reading", title: "Read for 10 minutes", streak: 12, done: false },
  { id: "walk", title: "Take a short walk", streak: 3, done: false },
];

function createFocusTimer(durationMinutes = 25) {
  return {
    durationMinutes,
    remainingMs: durationMinutes * 60_000,
    endsAt: null,
  };
}

function loadFocusTimer() {
  if (typeof window === "undefined") {
    return { timer: createFocusTimer(), storageError: false };
  }

  try {
    const savedValue = window.localStorage.getItem(FOCUS_TIMER_STORAGE_KEY);
    if (!savedValue) {
      return { timer: createFocusTimer(), storageError: false };
    }

    const saved = JSON.parse(savedValue);
    const durationMinutes = FOCUS_DURATIONS.includes(saved.durationMinutes)
      ? saved.durationMinutes
      : 25;
    const durationMs = durationMinutes * 60_000;
    const wasRunning = Number.isFinite(saved.endsAt);
    const remainingMs = wasRunning
      ? Math.max(0, saved.endsAt - Date.now())
      : Math.min(
          durationMs,
          Math.max(0, Number.isFinite(saved.remainingMs) ? saved.remainingMs : durationMs),
        );

    return {
      timer: {
        durationMinutes,
        remainingMs,
        endsAt: wasRunning && remainingMs > 0 ? saved.endsAt : null,
      },
      storageError: false,
    };
  } catch (error) {
    console.error("Unable to restore the landing focus timer.", error);
    return { timer: createFocusTimer(), storageError: true };
  }
}

function persistFocusTimer(timer) {
  try {
    window.localStorage.setItem(FOCUS_TIMER_STORAGE_KEY, JSON.stringify(timer));
    return true;
  } catch (error) {
    console.error("Unable to save the landing focus timer.", error);
    return false;
  }
}

function formatFocusTime(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function OrbitDiagram() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [habits, setHabits] = useState(SAMPLE_HABITS);
  const [initialTimer] = useState(loadFocusTimer);
  const [timer, setTimer] = useState(initialTimer.timer);
  const [now, setNow] = useState(Date.now);
  const [timerStorageError, setTimerStorageError] = useState(initialTimer.storageError);
  const completedTasks = tasks.filter((task) => task.done).length;
  const completedHabits = habits.filter((habit) => habit.done).length;
  const nextTaskIndex = tasks.findIndex((task) => !task.done);
  const remainingMs = timer.endsAt
    ? Math.max(0, timer.endsAt - now)
    : timer.remainingMs;
  const durationMs = timer.durationMinutes * 60_000;
  const timerProgress = Math.min(1, Math.max(0, 1 - remainingMs / durationMs));
  const isTimerRunning = timer.endsAt !== null;
  const timerEndsAt = timer.endsAt;
  const timerDurationMinutes = timer.durationMinutes;

  useEffect(() => {
    if (!timerEndsAt) return undefined;

    const intervalId = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (currentTime >= timerEndsAt) {
        const completedTimer = {
          durationMinutes: timerDurationMinutes,
          endsAt: null,
          remainingMs: 0,
        };
        setTimer(completedTimer);
        setTimerStorageError(!persistFocusTimer(completedTimer));
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerEndsAt, timerDurationMinutes]);

  const toggleTask = (taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const toggleHabit = (habitId) => {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === habitId ? { ...habit, done: !habit.done } : habit,
      ),
    );
  };

  const updateTimer = (nextTimer) => {
    setTimer(nextTimer);
    setTimerStorageError(!persistFocusTimer(nextTimer));
  };

  const startTimer = () => {
    const remaining = remainingMs > 0 ? remainingMs : durationMs;
    const startedAt = Date.now();
    setNow(startedAt);
    updateTimer({
      ...timer,
      remainingMs: remaining,
      endsAt: startedAt + remaining,
    });
  };

  const pauseTimer = () => {
    updateTimer({
      ...timer,
      endsAt: null,
      remainingMs: remainingMs,
    });
  };

  const resetTimer = () => {
    updateTimer(createFocusTimer(timer.durationMinutes));
    setNow(Date.now());
  };

  return (
    <div aria-label="AtomicTasks app preview" className="ref-orbit">
      <div className="ref-preview-top">
        <div>
          <span className="ref-eyebrow">{TODAY_LABEL}</span>
          <h2>Today, in focus</h2>
        </div>
        <span className="ref-preview-mark"><Sparkles aria-hidden="true" /></span>
      </div>
      <Tabs className="ref-preview-tabs" defaultValue="today">
        <TabsList aria-label="Product preview" className="ref-preview-tabs-list">
          <TabsTab value="today">Today</TabsTab>
          <TabsTab value="habits">Habits</TabsTab>
          <TabsTab value="focus">Focus</TabsTab>
          <TabsIndicator className="ref-preview-tabs-indicator" />
        </TabsList>
        <TabsPanels className="ref-preview-panels">
          <TabsPanel className="ref-preview-panel" value="today">
            <div className="ref-preview-progress">
              <div className="ref-preview-progress-heading">
                <div>
                  <span className="ref-preview-progress-label">Daily progress</span>
                  <strong>{completedTasks}<span> of {tasks.length} tasks</span></strong>
                </div>
                <span className="ref-preview-progress-percent">
                  {Math.round((completedTasks / tasks.length) * 100)}%
                </span>
              </div>
              <div
                aria-label="Daily task progress"
                aria-valuemax={tasks.length}
                aria-valuemin={0}
                aria-valuenow={completedTasks}
                className="ref-preview-bar"
                role="progressbar"
              >
                <span style={{ width: `${(completedTasks / tasks.length) * 100}%` }} />
              </div>
              <p className="ref-preview-progress-note">
                {completedTasks === tasks.length
                  ? "Everything is done for today."
                  : `${tasks.length - completedTasks} tasks left to go.`}
              </p>
            </div>
            {tasks.map((task, index) => (
              <button
                aria-pressed={task.done}
                className={`ref-preview-task${task.done ? " is-done" : ""}`}
                key={task.id}
                onClick={() => toggleTask(task.id)}
                type="button"
              >
                <span aria-hidden="true" className="ref-preview-task-check">
                  {task.done && <Check />}
                </span>
                <span className="ref-preview-task-copy">
                  <strong>{task.title}</strong>
                  <small>
                    <span
                      className={`ref-preview-task-status ${
                        task.done ? "is-done" : index === nextTaskIndex ? "is-next" : "is-later"
                      }`}
                    >
                      {task.done ? "Done" : index === nextTaskIndex ? "Next up" : "Later"}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{task.minutes} min</span>
                  </small>
                </span>
              </button>
            ))}
          </TabsPanel>
          <TabsPanel className="ref-preview-panel" value="habits">
            <div className="ref-preview-habit-summary">
              <span><Flame aria-hidden="true" /> {Math.max(...habits.map((habit) => habit.streak))} day streak</span>
              <strong>{completedHabits} of {habits.length} today</strong>
            </div>
            <div aria-label="Sample habits" className="ref-preview-habits">
              {habits.map((habit) => (
                <button
                  aria-pressed={habit.done}
                  className={`ref-preview-habit${habit.done ? " is-done" : ""}`}
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  type="button"
                >
                  <span aria-hidden="true" className="ref-preview-habit-check">
                    {habit.done && <Check />}
                  </span>
                  <span className="ref-preview-habit-copy">
                    <strong>{habit.title}</strong>
                    <small>{habit.streak} day streak</small>
                  </span>
                  <span className="ref-preview-habit-action">
                    {habit.done ? "Done" : "Check in"}
                  </span>
                </button>
              ))}
            </div>
            <p className="ref-preview-caption">Tap a habit to check in for today.</p>
          </TabsPanel>
          <TabsPanel className="ref-preview-panel" value="focus">
            <div className="ref-preview-focus">
              <span>FOCUS TIMER</span>
              <strong aria-label={formatFocusTime(remainingMs)} className="ref-preview-clock">
                {formatFocusTime(remainingMs)}
              </strong>
              <div
                aria-label="Focus session progress"
                aria-valuemax={durationMs / 1000}
                aria-valuemin={0}
                aria-valuenow={Math.round(timerProgress * durationMs / 1000)}
                className="ref-preview-focus-progress"
                role="progressbar"
              >
                <span style={{ width: `${timerProgress * 100}%` }} />
              </div>
              <div aria-label="Focus timer duration" className="ref-preview-presets">
                {FOCUS_DURATIONS.map((minutes) => (
                  <button
                    aria-pressed={timer.durationMinutes === minutes}
                    disabled={isTimerRunning}
                    key={minutes}
                    onClick={() => updateTimer(createFocusTimer(minutes))}
                    type="button"
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
              <div className="ref-preview-timer-actions">
                <button
                  className="ref-preview-timer-start"
                  onClick={isTimerRunning ? pauseTimer : startTimer}
                  type="button"
                >
                  {isTimerRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                  {isTimerRunning ? "Pause" : remainingMs === 0 ? "Start again" : "Start focus"}
                </button>
                <button
                  aria-label="Reset focus timer"
                  className="ref-preview-timer-reset"
                  onClick={resetTimer}
                  type="button"
                >
                  <RotateCcw aria-hidden="true" />
                </button>
              </div>
              <p role={timerStorageError ? "alert" : undefined}>
                {timerStorageError
                  ? "Timer couldn’t be saved on this device."
                  : isTimerRunning
                    ? "Keep going. Your timer is saved on this device."
                    : remainingMs === 0
                      ? "Session complete. Nice work."
                      : "One task. One timer. No pressure."}
              </p>
            </div>
            <div className="ref-preview-focus-note"><CheckCheck aria-hidden="true" /> Small steps count.</div>
          </TabsPanel>
        </TabsPanels>
      </Tabs>
      <div className="ref-preview-foot"><span /><span>Your space, your pace</span><span>·</span><span>Zero guilt</span></div>
    </div>
  );
}

export default function Hero() {
  useDocumentTitle("");

  return (
    <section aria-labelledby="landing-title" className="ref-hero" id="product">
      <div className="ref-hero-glow" />
      <div className="ref-hero-inner">
        <div className="ref-hero-copy">
          <span className="ref-eyebrow ref-hero-eyebrow">
            <span aria-hidden="true" />
            Task &amp; habit system
          </span>
          <h1 id="landing-title">
            Break the big thing into <span>next</span> thing.
          </h1>
          <p>
            AtomicTasks turns overwhelming goals into small, trackable actions
            so you always know what to do next.
          </p>
          <div className="ref-hero-actions">
            <Link className="ref-primary-link" to="/register">
              Start free <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link className="ref-outline-link" to="/login">
              Log in
            </Link>
          </div>
          <p className="ref-hero-note">
            Free tier available. No credit card required.
          </p>
        </div>
        <OrbitDiagram />
      </div>
    </section>
  );
}
