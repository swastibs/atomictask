import { useMemo, useState } from "react";
import {
  Check,
  CirclePlus,
  Clock3,
  Flame,
  MoreHorizontal,
  Target,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review the day ahead", due: "Today", done: true },
    { id: 2, title: "Ship one meaningful task", due: "Today", done: false },
    { id: 3, title: "Take a proper lunch break", due: "Today", done: false },
    {
      id: 4,
      title: "Write tomorrow's first step",
      due: "Tomorrow",
      done: false,
    },
  ]);
  const [draft, setDraft] = useState("");
  const completed = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks],
  );
  const toggleTask = (id) =>
    setTasks((items) =>
      items.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  const addTask = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setTasks((items) => [
      ...items,
      { id: Date.now(), title: draft.trim(), due: "Today", done: false },
    ]);
    setDraft("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Tuesday, August 21
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Good morning, {user?.name?.split(" ")[0] || "there"}.
          </h1>
          <p className="mt-2 text-muted-foreground">
            One focused step is enough to move the day forward.
          </p>
        </div>
        <Button>
          <CirclePlus /> Add a task
        </Button>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--accent-atomic)] text-[var(--accent-atomic-foreground)]">
              <Check />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">
                Today&apos;s progress
              </p>
              <strong className="font-heading text-2xl">
                {completed}/{tasks.length}
              </strong>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Flame className="size-9 text-[var(--accent-atomic)]" />
            <div>
              <p className="text-xs text-muted-foreground">Current streak</p>
              <strong className="font-heading text-2xl">12 days</strong>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <TrendingUp className="size-9 text-[var(--accent-atomic)]" />
            <div>
              <p className="text-xs text-muted-foreground">Weekly rhythm</p>
              <strong className="font-heading text-2xl">78%</strong>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Focus queue
              </p>
              <CardTitle>What needs your attention</CardTitle>
            </div>
            <Button variant="ghost" size="icon" aria-label="More task options">
              <MoreHorizontal />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={addTask} className="mb-5 flex gap-2">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Add a small next step..."
                aria-label="New task"
              />
              <Button type="submit" size="icon" aria-label="Add task">
                <CirclePlus />
              </Button>
            </form>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40 ${task.done ? "opacity-60" : ""}`}
                  key={task.id}
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} ${task.done ? "open" : "done"}`}
                    className={`grid size-6 shrink-0 place-items-center rounded-full border ${task.done ? "border-[var(--accent-atomic)] bg-[var(--accent-atomic)] text-[var(--accent-atomic-foreground)]" : "border-border"}`}
                  >
                    {task.done && <Check className="size-3.5" />}
                  </button>
                  <span
                    className={`min-w-0 flex-1 text-sm ${task.done ? "line-through" : ""}`}
                  >
                    {task.title}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    {task.due}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Today&apos;s habits
              </p>
              <CardTitle>Keep the chain alive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <strong className="font-heading text-4xl">75%</strong>
                <Target className="text-[var(--accent-atomic)]" />
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <span className="block h-full w-3/4 rounded-full bg-[var(--accent-atomic)]" />
              </div>
              <p className="text-xs text-muted-foreground">
                Three of four habits are on track today.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Small prompt
              </p>
              <p className="mt-3 font-heading text-lg">
                What would make tomorrow easier?
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Capture one answer before you close the day.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
