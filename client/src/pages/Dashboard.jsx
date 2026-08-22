import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, CirclePlus, Flame, ListChecks, MoreHorizontal, Play, Plus, Search, Target, Timer, TrendingUp, X } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiError, taskApi } from "../api/tasks";
import "./Dashboard.css";

const pad = (value) => String(value).padStart(2, "0");
const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const todayKey = () => dateKey(new Date());
const shiftDate = (key, amount) => { const date = new Date(`${key}T12:00:00`); date.setDate(date.getDate() + amount); return dateKey(date); };
const dateLabel = (key, options) => new Date(`${key}T12:00:00`).toLocaleDateString(undefined, options);
const titleCase = (value) => value?.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const priorityColor = { urgent: "var(--destructive)", high: "var(--accent-atomic)", medium: "var(--accent-orbit)", low: "var(--muted-foreground)" };

function StatCard({ label, value, note, icon: Icon, tone = "teal" }) {
  return <article className={`dash-stat stat-${tone}`}><div className="stat-icon"><Icon size={17} /></div><div><span>{label}</span><strong>{value ?? 0}</strong><small>{note}</small></div></article>;
}

function MiniChart({ stats }) {
  const total = stats?.total || 0; const completed = stats?.completed || 0; const pending = Math.max(total - completed, 0);
  const bars = [stats?.completedToday || 0, stats?.inProgress || 0, stats?.pending || 0, stats?.overdue || 0, stats?.completed || 0]; const max = Math.max(...bars, 1);
  return <div className="chart-wrap"><div className="chart-heading"><div><span className="eyebrow">Workload pulse</span><h3>Progress this week</h3></div><TrendingUp size={18} /></div><div className="bars" aria-label="Task activity chart">{bars.map((value, index) => <div className="bar-col" key={index}><span className="bar-value">{value}</span><i style={{ height: `${Math.max((value / max) * 100, 8)}%` }} /><small>{["Today", "Active", "Open", "Late", "Done"][index]}</small></div>)}</div><div className="chart-summary"><span><i className="dot teal" /> {completed} completed</span><span><i className="dot coral" /> {pending} remaining</span></div></div>;
}

function TaskItem({ task, onToggle, index = 0 }) {
  const due = task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Anytime"; const completed = task.status === "completed";
  return <article className={`task-item ${completed ? "is-done" : ""}`} style={{ "--task-index": index }}><button type="button" className="task-check" onClick={() => onToggle(task)} aria-label={`${completed ? "Reopen" : "Complete"} ${task.title}`}>{completed && <Check size={14} />}</button><div className="task-content"><Link to={`/tasks/${task._id}`} className="task-title">{task.title}</Link><div className="task-meta"><span className="priority-dot" style={{ background: priorityColor[task.priority] || priorityColor.medium }} />{titleCase(task.priority)}<span className="meta-divider" />{due}{task.tags?.slice(0, 2).map((tag) => <span className="task-tag" key={tag}>#{tag}</span>)}</div></div><button type="button" className="icon-quiet" aria-label={`More options for ${task.title}`}><MoreHorizontal size={18} /></button></article>;
}

function CreateTask({ onClose, onCreated }) {
  const [title, setTitle] = useState(""); const [dueDate, setDueDate] = useState(todayKey()); const [priority, setPriority] = useState("medium"); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const submit = async (event) => { event.preventDefault(); if (!title.trim()) return setError("Give your task a title first."); setSaving(true); try { await taskApi.create({ title: title.trim(), dueDate, priority }); onCreated(); } catch (requestError) { setError(apiError(requestError)); setSaving(false); } };
  return <div className="modal-backdrop"><form className="task-modal" onSubmit={submit}><div className="modal-head"><div><span className="eyebrow">Quick capture</span><h2>New task</h2></div><button type="button" className="icon-quiet" onClick={onClose} aria-label="Close"><X /></button></div><label>Task title<input value={title} onChange={(event) => setTitle(event.target.value)} autoFocus placeholder="What needs your attention?" maxLength={200} /></label><div className="form-grid"><label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} min={todayKey()} /></label><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}>{["low", "medium", "high", "urgent"].map((item) => <option key={item}>{item}</option>)}</select></label></div>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={saving}>{saving ? "Adding..." : "Add task"}<Plus size={17} /></button></form></div>;
}

function PomodoroPreview() {
  return <section className="focus-preview"><div className="focus-orb"><Timer size={22} /><strong>25:00</strong><span>Ready when you are</span></div><div className="focus-copy"><span className="eyebrow">Focus room</span><h3>Protect your attention.</h3><p>Start a focused block and let the small wins stack up.</p><Link to="/pomodoro" className="text-button"><Play size={14} /> Open Pomodoro</Link></div></section>;
}

function HabitPreview({ onOpen }) {
  const habits = [["Move your body", 100], ["Read 10 pages", 70], ["Deep focus", 45]];
  return <section className="module-section"><div className="section-heading"><div><span className="eyebrow">Consistency lab</span><h2>Habits <span>work in progress</span></h2><p className="section-subtitle">Small rituals that make the rest of the day easier.</p></div><button type="button" className="text-button" onClick={onOpen}>Open habits <ArrowUpRight size={14} /></button></div><div className="habit-preview"><div className="habit-preview-head"><div className="habit-score"><strong>72%</strong><span>today's rhythm</span></div><div className="mini-ring"><span>3</span><small>habits</small></div></div><div className="habit-preview-list">{habits.map(([name, progress]) => <div className="habit-preview-row" key={name}><span className="habit-bullet"><Check size={12} /></span><div><strong>{name}</strong><div className="mini-progress"><i style={{ width: `${progress}%` }} /></div></div><small>{progress}%</small></div>)}</div><div className="module-footer"><span><Flame size={14} /> 4 day streak</span><span className="status-label">Preview</span></div></div></section>;
}

export default function Dashboard() {
  const { user } = useAuth(); const navigate = useNavigate(); const [searchParams, setSearchParams] = useSearchParams(); const [tasks, setTasks] = useState([]); const [stats, setStats] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [showCreate, setShowCreate] = useState(false); const [taskFilter, setTaskFilter] = useState("all"); const [search, setSearch] = useState("");
  const todayMode = searchParams.has("dueDate"); const selectedDate = todayMode ? searchParams.get("dueDate") || todayKey() : todayKey(); const isToday = selectedDate === todayKey();
  const listParams = useMemo(() => ({ limit: 100, sortBy: "dueDate", sortOrder: "asc", ...(todayMode ? { dueDate: selectedDate } : {}) }), [todayMode, selectedDate]);
  const load = async () => { setLoading(true); try { const [taskResult, taskStats] = await Promise.all([taskApi.list(listParams), taskApi.stats()]); setTasks(taskResult.tasks); setStats(taskStats); setError(""); } catch (requestError) { setError(apiError(requestError)); } finally { setLoading(false); } };
  useEffect(() => {
    let cancelled = false;
    const fetchDashboard = async () => {
      try {
        const [taskResult, taskStats] = await Promise.all([taskApi.list(listParams), taskApi.stats()]);
        if (!cancelled) { setTasks(taskResult.tasks); setStats(taskStats); setError(""); setLoading(false); }
      } catch (requestError) {
        if (!cancelled) { setError(apiError(requestError)); setLoading(false); }
      }
    };
    fetchDashboard();
    return () => { cancelled = true; };
  }, [listParams]);
  const completedForDate = useMemo(() => tasks.filter((task) => task.status === "completed").length, [tasks]);
  const visibleTasks = useMemo(() => tasks.filter((task) => (taskFilter === "all" || task.status === taskFilter) && task.title.toLowerCase().includes(search.toLowerCase().trim())), [tasks, taskFilter, search]);
  const firstName = user?.name?.split(" ")[0] || "there";
  const toggle = async (task) => { const nextStatus = task.status === "completed" ? "pending" : "completed"; setTasks((current) => current.map((item) => item._id === task._id ? { ...item, status: nextStatus } : item)); try { await taskApi.update(task._id, { status: nextStatus }); setStats(await taskApi.stats()); } catch (requestError) { setError(apiError(requestError)); load(); } };
  return <div className="dashboard-page"><header className="dashboard-header"><div><div className="date-kicker"><CalendarDays size={15} /> {todayMode ? dateLabel(selectedDate, { weekday: "long", month: "long", day: "numeric" }) : "Your complete workspace"}</div><h1>{todayMode ? (isToday ? `Good morning, ${firstName}.` : `Your plan for ${dateLabel(selectedDate, { weekday: "long" })}.`) : `All tasks, ${firstName}.`}</h1><p>{completedForDate ? `You have already cleared ${completedForDate} task${completedForDate === 1 ? "" : "s"}. Keep the rhythm going.` : todayMode ? "A clear plan makes space for better work." : "Everything assigned to you, in one place."}</p></div><div className="header-actions"><div className="top-date-nav"><button className="icon-quiet" onClick={() => setSearchParams({ dueDate: shiftDate(selectedDate, -1) })} aria-label="Previous day"><ChevronLeft /></button><button className={`date-chip ${todayMode && isToday ? "selected" : ""}`} onClick={() => setSearchParams({ dueDate: todayKey() })}>Today <small>{dateLabel(todayKey(), { month: "short", day: "numeric" })}</small></button><button className="icon-quiet" onClick={() => setSearchParams({ dueDate: shiftDate(selectedDate, 1) })} aria-label="Next day"><ChevronRight /></button><input type="date" value={selectedDate} onChange={(event) => setSearchParams({ dueDate: event.target.value })} aria-label="Choose a date" /></div><Link to="/profile" className="avatar" aria-label="Open account">{user?.name?.charAt(0)?.toUpperCase() || "A"}</Link><button className="primary-button" onClick={() => setShowCreate(true)}><CirclePlus size={18} /> Add task</button></div></header>
    {error && <div className="dashboard-alert" role="alert">{error}</div>}
    <section className="stats-grid"><StatCard label="Total tasks" value={stats?.total} note="all active work" icon={ListChecks} tone="teal" /><StatCard label="Completed" value={stats?.completed} note={`${stats?.completionRate || 0}% completion rate`} icon={CheckCircle2} tone="lime" /><StatCard label="In progress" value={stats?.inProgress} note="currently moving" icon={ArrowUpRight} tone="blue" /><StatCard label="Overdue" value={stats?.overdue} note="needs attention" icon={Flame} tone="coral" /></section>
    <div className="dashboard-grid"><main className="dashboard-main"><section className="today-panel"><div className="section-heading"><div><span className="eyebrow">{todayMode ? "Today at a glance" : "Complete task list"}</span><h2>{todayMode ? (isToday ? "Today" : dateLabel(selectedDate, { month: "short", day: "numeric" })) : "All tasks"}<span>{visibleTasks.length} shown</span></h2></div><div className="completion-pill"><strong>{tasks.length ? Math.round((completedForDate / tasks.length) * 100) : 0}%</strong><span>{todayMode ? "complete" : "done"}</span></div></div><div className="progress-track"><i style={{ width: `${tasks.length ? (completedForDate / tasks.length) * 100 : 0}%` }} /></div><div className="task-tools"><label className="task-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" /></label><div className="filter-tabs" role="tablist" aria-label="Filter tasks">{[["all", "All"], ["pending", "Open"], ["in-progress", "Active"], ["completed", "Done"]].map(([value, label]) => <button type="button" key={value} className={taskFilter === value ? "active" : ""} onClick={() => setTaskFilter(value)}>{label}{value === "all" ? ` ${tasks.length}` : ` ${tasks.filter((task) => task.status === value).length}`}</button>)}</div></div>{loading ? <div className="empty-state">Loading your plan...</div> : visibleTasks.length ? <div className="task-list">{visibleTasks.map((task, index) => <TaskItem key={task._id} task={task} onToggle={toggle} index={index} />)}</div> : <div className="empty-state"><Target size={24} /><strong>{search || taskFilter !== "all" ? "Nothing matches this view." : "Your day is wide open."}</strong><span>{search || taskFilter !== "all" ? "Try another filter or search term." : "Add a task or use the quiet time well."}</span><button className="text-button" onClick={() => setShowCreate(true)}>Create your first task <Plus size={14} /></button></div>}<button className="add-inline" onClick={() => setShowCreate(true)}><Plus size={16} /> Add a task to this day</button></section>
      <HabitPreview onOpen={() => navigate("/habits")} />
    </main><aside className="dashboard-aside"><MiniChart stats={stats} /><section className="insight-card"><div className="insight-mark"><ArrowDownRight size={17} /></div><div><span className="eyebrow">A useful signal</span><h3>{stats?.overdue ? "Close the oldest loop first." : "You are set up for a clean run."}</h3><p>{stats?.overdue ? `${stats.overdue} task${stats.overdue === 1 ? " is" : "s are"} past due. A five-minute reset can change the shape of the day.` : "No overdue tasks are waiting. Use that margin to move one important task forward."}</p></div></section><PomodoroPreview /><section className="habit-mini"><div className="chart-heading"><div><span className="eyebrow">Habit snapshot</span><h3>Keep showing up</h3></div><Flame size={18} /></div><div className="habit-streak"><strong>4</strong><span>day streak</span><div className="streak-dots">{[1, 1, 1, 1, 0, 0, 0].map((active, index) => <i className={active ? "active" : ""} key={index} />)}</div></div><Link to="/habits" className="text-button">See habit tracker <ArrowUpRight size={14} /></Link></section></aside></div>
    {showCreate && <CreateTask onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />}</div>;
}
