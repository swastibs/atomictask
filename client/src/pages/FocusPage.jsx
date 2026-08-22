import { useEffect, useState } from "react";
import { ArrowLeft, Pause, Play, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import HabitTrackerModule from "@/components/HabitTrackerModule/HabitTrackerModule";
import { Button } from "@/components/ui/button";

function Pomodoro() {
  const [seconds, setSeconds] = useState(25 * 60); const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return undefined; const timer = setInterval(() => setSeconds((value) => value > 0 ? value - 1 : 0), 1000); return () => clearInterval(timer); }, [running]);
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0"); const remainder = String(seconds % 60).padStart(2, "0");
  return <section className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Focus session</p><div className="my-8 font-heading text-7xl font-semibold tabular-nums">{minutes}:{remainder}</div><div className="flex justify-center gap-2"><Button onClick={() => setRunning((value) => !value)}>{running ? <Pause /> : <Play />}{running ? "Pause" : "Start focus"}</Button><Button variant="outline" size="icon" onClick={() => { setRunning(false); setSeconds(25 * 60); }} aria-label="Reset timer"><RotateCcw /></Button></div><p className="mt-6 text-sm text-muted-foreground">One focused block, then a short reset. Your task list stays available in the sidebar.</p></section>;
}

export default function FocusPage({ mode }) { return <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:py-10"><Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Back to tasks</Link>{mode === "pomodoro" ? <><header><p className="text-xs uppercase tracking-widest text-muted-foreground">Focus</p><h1 className="mt-2 font-heading text-3xl font-semibold">Pomodoro</h1></header><Pomodoro /></> : <><header><p className="text-xs uppercase tracking-widest text-muted-foreground">Consistency</p><h1 className="mt-2 font-heading text-3xl font-semibold">Habits</h1><p className="mt-2 text-muted-foreground">Build momentum with small repeatable actions.</p></header><HabitTrackerModule /></>}</div>; }
