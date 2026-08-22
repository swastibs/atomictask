import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { apiError, taskApi } from "../api/tasks";
import { Button } from "@/components/ui/button";
export default function Trash() {
  const [tasks, setTasks] = useState([]); const [error, setError] = useState("");
  const load = () => taskApi.trash().then(setTasks).catch((requestError) => setError(apiError(requestError)));
  useEffect(load, []);
  const action = async (task, permanent) => { const message = permanent ? "Permanently delete this task? This cannot be undone." : "Restore this task?"; if (!window.confirm(message)) return; try { await (permanent ? taskApi.permanentRemove(task._id) : taskApi.restore(task._id)); load(); } catch (requestError) { setError(apiError(requestError)); } };
  return <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:py-10"><Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Back to tasks</Link><header><p className="text-xs uppercase tracking-widest text-muted-foreground">Recovery</p><h1 className="mt-2 font-heading text-3xl font-semibold">Trash</h1><p className="mt-2 text-muted-foreground">Deleted tasks remain recoverable until permanently removed.</p></header>{error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p>}<section className="overflow-hidden rounded-2xl border bg-card">{tasks.length ? tasks.map((task) => <article key={task._id} className="flex flex-col gap-3 border-b p-4 last:border-0 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><h2 className="font-medium">{task.title}</h2><p className="text-sm text-muted-foreground">Deleted {task.deletedAt ? new Date(task.deletedAt).toLocaleDateString() : "recently"}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => action(task, false)}><RotateCcw /> Restore</Button><Button variant="destructive" size="sm" onClick={() => action(task, true)}><Trash2 /> Delete forever</Button></div></article>) : <div className="p-12 text-center text-muted-foreground">Trash is empty.</div>}</section></div>;
}
