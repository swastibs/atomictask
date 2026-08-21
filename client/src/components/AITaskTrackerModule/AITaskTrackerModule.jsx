import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CalendarDays,
  Check,
  Clock3,
  GripVertical,
  Play,
  Sparkles,
  Timer,
  X,
  Zap,
} from "lucide-react";
import "./AITaskTrackerModule.css";

const STARTER_TASKS = [
  { id: 1, title: "Review the day ahead", due: "Today, 9:00 AM", priority: "High", duration: "15 min" },
  { id: 2, title: "Ship one meaningful task", due: "Today, 11:30 AM", priority: "Focus", duration: "45 min" },
  { id: 3, title: "Take a proper lunch break", due: "Today, 1:00 PM", priority: "Light", duration: "30 min" },
];

const SUGGESTED_TASKS = [
  { id: 4, title: "Map the afternoon priorities", due: "Today, 2:00 PM", priority: "High", duration: "20 min" },
  { id: 5, title: "Clear your smallest open loop", due: "Today, 3:00 PM", priority: "Focus", duration: "25 min" },
  { id: 6, title: "Write tomorrow's first step", due: "Today, 4:30 PM", priority: "Light", duration: "10 min" },
];

export default function AITaskTrackerModule() {
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState(STARTER_TASKS);
  const [focusTask, setFocusTask] = useState(null);
  const [seconds, setSeconds] = useState(25 * 60);
  const [celebrate, setCelebrate] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const trackerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!focusTask || seconds === 0) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [focusTask, seconds]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.12 });
    if (trackerRef.current) observer.observe(trackerRef.current);
    return () => observer.disconnect();
  }, []);

  const suggestTasks = (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    setTasks((current) => [...current.filter((task) => !task.ai), ...SUGGESTED_TASKS.map((task) => ({ ...task, ai: true }))]);
    setPrompt("");
  };
  const toggleTask = (id) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 700);
  };
  const startFocus = (task) => {
    setFocusTask(task);
    setSeconds(25 * 60);
  };
  const finishFocus = () => {
    if (focusTask) toggleTask(focusTask.id);
    setFocusTask(null);
  };
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  const completed = tasks.filter((task) => task.done).length;

  return (
    <section id="ai-tasks" className={`ai-section ai-scroll-reveal ${isVisible ? "is-visible" : ""}`} ref={trackerRef}>
      <div className="ai-shell">
        <div className="ai-intro">
          <span className="eyebrow">A second brain for the next move</span>
          <h2>Turn a thought into traction.</h2>
          <p>Ask for a plan, then let the day get pleasantly smaller.</p>
        </div>
        <div className="ai-tracker-card">
          <header className="ai-header">
            <div className="ai-brand"><span className="ai-avatar"><Bot size={17} /></span><div><strong>ATOMIC / AI TASKS</strong><small><i /> Ready when you are</small></div></div>
            <span className="ai-count"><Zap size={14} /> {completed}/{tasks.length} complete</span>
          </header>
          <div className="ai-content">
            <div className="ai-main-column">
              <form className="suggestion-box" onSubmit={suggestTasks}>
                <div className="suggestion-label"><Sparkles size={15} /> AI suggestion box</div>
                <div className="suggestion-input"><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Try: Plan my day" aria-label="Ask AI to plan your day" /><button type="submit" aria-label="Generate task plan"><Sparkles size={16} /></button></div>
                <small>Three focused tasks, shaped around your energy.</small>
              </form>
              <div className="task-list">
                <div className="ai-panel-heading"><div><span className="eyebrow">Today's queue</span><h3>Make room for momentum</h3></div><span className="task-date"><CalendarDays size={14} /> Aug 21</span></div>
                {tasks.map((task) => (
                  <div className={`task-row ${task.done ? "is-done" : ""} ${task.ai ? "is-ai" : ""}`} key={task.id} draggable onDragStart={() => setDraggedTask(task.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedTask && draggedTask !== task.id) setTasks((current) => { const from = current.findIndex((item) => item.id === draggedTask); const to = current.findIndex((item) => item.id === task.id); const next = [...current]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next; }); }}>
                    <GripVertical className="drag-handle" size={15} />
                    <button type="button" className="task-check" onClick={() => toggleTask(task.id)} aria-label={`Mark ${task.title} complete`}>{task.done && <Check size={13} />}</button>
                    <div className="task-copy"><strong>{task.title}</strong><small><Clock3 size={12} /> {task.due} <i /> {task.duration}</small></div>
                    <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <button type="button" className="start-button" onClick={() => startFocus(task)}><Play size={12} /> Start</button>
                    {task.ai && <Sparkles className="task-sparkle" size={13} />}
                  </div>
                ))}
              </div>
            </div>
            <aside className="ai-side-column">
              <div className="insights-panel"><div className="ai-panel-heading"><div><span className="eyebrow">AI insights</span><h3>A pattern worth keeping</h3></div><Bot size={18} className="insight-bot" /></div><p>You&apos;re most productive in the morning. Protect your first focus block for work that needs a clear head.</p><div className="insight-meter"><span style={{ width: "78%" }} /></div><small>78% of your completed tasks land before noon.</small></div>
              <div className="mini-calendar"><div className="mini-calendar-header"><strong>August 2026</strong><span>Drag to schedule</span></div><div className="calendar-grid">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <b key={`${day}-${index}`}>{day}</b>)}{Array.from({ length: 35 }, (_, index) => <button type="button" className={index === 19 ? "today" : index === 20 ? "has-task" : ""} key={index}>{index < 3 ? "" : (index - 2)}</button>)}</div></div>
            </aside>
          </div>
        </div>
      </div>
      {focusTask && <div className="focus-overlay" role="dialog" aria-modal="true"><div className="focus-modal"><button type="button" className="close-focus" onClick={() => setFocusTask(null)} aria-label="Close focus mode"><X size={18} /></button><span className="focus-icon"><Timer size={24} /></span><span className="eyebrow">Focus mode</span><h2>{focusTask.title}</h2><strong className="focus-time">{minutes}:{remainingSeconds}</strong><div className="focus-progress"><span style={{ width: `${(1 - seconds / (25 * 60)) * 100}%` }} /></div><button type="button" className="finish-button" onClick={finishFocus}><Check size={16} /> Finish and celebrate</button></div></div>}
      {celebrate && <div className="celebrate-sparkle" aria-hidden="true"><Sparkles size={26} /></div>}
    </section>
  );
}
