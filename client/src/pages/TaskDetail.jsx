import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Edit3,
  MessageSquare,
  Save,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiError, taskApi } from "../api/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const pretty = (value) =>
  value?.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function EditTaskForm({ task, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    priority: task.priority || "medium",
    status: task.status || "pending",
    dueDate: task.dueDate?.slice(0, 10) || "",
    estimatedTime: task.estimatedTime ?? "",
    actualTime: task.actualTime ?? "",
    tags: task.tags?.join(", ") || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("A title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await taskApi.update(task._id, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || undefined,
        estimatedTime:
          form.estimatedTime === "" ? undefined : Number(form.estimatedTime),
        actualTime:
          form.actualTime === "" ? undefined : Number(form.actualTime),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      onSaved(updated);
    } catch (requestError) {
      setError(apiError(requestError));
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Edit task</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close editor"
        >
          <X />
        </Button>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        Title
        <Input
          value={form.title}
          onChange={update("title")}
          maxLength={200}
          autoFocus
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Description
        <textarea
          value={form.description}
          onChange={update("description")}
          rows={4}
          maxLength={2000}
          className="rounded-lg border border-input bg-transparent p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Priority
          <select
            value={form.priority}
            onChange={update("priority")}
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          >
            {["low", "medium", "high", "urgent"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Status
          <select
            value={form.status}
            onChange={update("status")}
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          >
            {[
              "pending",
              "in-progress",
              "completed",
              "cancelled",
              "archived",
            ].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Due date
          <input
            type="date"
            value={form.dueDate}
            onChange={update("dueDate")}
            className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Estimated minutes
          <input
            type="number"
            min="0"
            value={form.estimatedTime}
            onChange={update("estimatedTime")}
            className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Actual minutes
          <input
            type="number"
            min="0"
            value={form.actualTime}
            onChange={update("actualTime")}
            className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Tags
          <input
            value={form.tags}
            onChange={update("tags")}
            placeholder="work, launch"
            className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
          />
        </label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? (
          "Saving..."
        ) : (
          <>
            <Save /> Save changes
          </>
        )}
      </Button>
    </form>
  );
}

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const load = useCallback(
    () =>
      Promise.all([taskApi.get(id), taskApi.comments(id), taskApi.subtasks(id)])
        .then(([nextTask, nextComments, nextSubtasks]) => {
          setTask(nextTask);
          setComments(nextComments || []);
          setSubtasks(nextSubtasks || []);
        })
        .catch((requestError) => setError(apiError(requestError))),
    [id],
  );
  useEffect(() => {
    load();
  }, [load]);
  const remove = async () => {
    if (!window.confirm("Soft-delete this task?")) return;
    setBusy(true);
    try {
      await taskApi.remove(id);
      navigate("/dashboard");
    } catch (requestError) {
      setError(apiError(requestError));
    } finally {
      setBusy(false);
    }
  };
  const addComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    setBusy(true);
    try {
      const next = await taskApi.addComment(id, comment.trim());
      setComments((current) => [...current, next]);
      setComment("");
    } catch (requestError) {
      setError(apiError(requestError));
    } finally {
      setBusy(false);
    }
  };
  if (!task && !error)
    return (
      <div className="mx-auto max-w-4xl p-8 text-muted-foreground">
        Loading task...
      </div>
    );
  if (error && !task)
    return (
      <div className="mx-auto max-w-4xl p-8">
        <p className="text-destructive" role="alert">
          {error}
        </p>
        <Link to="/dashboard" className="mt-4 inline-block underline">
          Back to tasks
        </Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to tasks
      </Link>
      {error && (
        <p
          className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
      {editing ? (
        <EditTaskForm
          task={task}
          onClose={() => setEditing(false)}
          onSaved={(updated) => {
            setTask(updated);
            setEditing(false);
          }}
        />
      ) : (
        <header className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="status-badge">{pretty(task.status)}</span>
              <span className="priority-badge">{pretty(task.priority)}</span>
            </div>
            <h1 className="mt-3 font-heading text-3xl font-semibold">
              {task.title}
            </h1>
            <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
              {task.description || "No description added."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit3 /> Edit
            </Button>
            <Button variant="destructive" onClick={remove} disabled={busy}>
              <Trash2 /> Delete
            </Button>
          </div>
        </header>
      )}
      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <main className="space-y-6">
          <section>
            <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
              <MessageSquare className="size-5" /> Comments
            </h2>
            <div className="mt-3 space-y-3">
              {comments.length ? (
                comments.map((item) => (
                  <article
                    key={item._id || item.createdAt}
                    className="rounded-xl border p-4"
                  >
                    <p className="text-sm">{item.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.author?.name || "Team member"} ·{" "}
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments yet.
                </p>
              )}
            </div>
            <form onSubmit={addComment} className="mt-4 flex gap-2">
              <Input
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add a note..."
                aria-label="Comment"
                maxLength={2000}
              />
              <Button
                type="submit"
                size="icon"
                disabled={busy || !comment.trim()}
                aria-label="Add comment"
              >
                <Send />
              </Button>
            </form>
          </section>
        </main>
        <aside className="space-y-4">
          <section className="rounded-xl border p-5">
            <h2 className="font-heading text-lg font-semibold">Subtasks</h2>
            {subtasks.length ? (
              subtasks.map((item) => (
                <div
                  key={item._id}
                  className="mt-3 flex items-center gap-2 text-sm"
                >
                  <Check className="size-4 text-[var(--accent-atomic)]" />
                  {item.title}
                </div>
              ))
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No subtasks yet.
              </p>
            )}
          </section>
          <section className="rounded-xl border p-5 text-sm">
            <p className="text-muted-foreground">Due date</p>
            <strong>
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}
            </strong>
            <p className="mt-4 text-muted-foreground">Time tracked</p>
            <strong>
              {task.actualTime || 0} / {task.estimatedTime || 0} minutes
            </strong>
          </section>
        </aside>
      </div>
    </div>
  );
}