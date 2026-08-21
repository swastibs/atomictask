import { useEffect, useRef, useState } from "react";
import { Check, Clock3, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SectionFrame, { SectionIntro } from "./SectionFrame";

const TASKS = [
  ["Review the day ahead", "High", "15 min"],
  ["Ship one meaningful task", "High", "45 min"],
  ["Reply to priority messages", "Medium", "20 min"],
  ["Take a proper lunch break", "Low", "30 min"],
  ["Write tomorrow's first step", "Low", "10 min"],
];

/** Interactive AI planning demo. */
export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [thinking, setThinking] = useState(false);
  const [done, setDone] = useState([]);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const submit = (event) => {
    event.preventDefault();
    if (!message.trim() || thinking) return;
    setThinking(true);
    timer.current = window.setTimeout(() => setThinking(false), 1100);
  };
  return <SectionFrame className="bg-muted/20"><SectionIntro eyebrow="AI, with a point of view" title="Start with a sentence. Leave with a plan.">AtomicTasks turns a vague intention into a calm, achievable sequence.</SectionIntro><Card className="mx-auto max-w-3xl bg-card/80 shadow-xl backdrop-blur"><CardHeader className="flex-row items-center justify-between border-b"><div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-xl bg-[var(--accent-atomic)] text-[var(--accent-atomic-foreground)] ${thinking ? "animate-pulse" : ""}`}><Sparkles className="size-4" /></span><div><CardTitle>Atomic AI</CardTitle><p className="text-xs text-muted-foreground">{thinking ? "Thinking through your day..." : "Your focused planning partner"}</p></div></div><span className="text-xs text-emerald-600">Online</span></CardHeader><CardContent className="space-y-4 p-5"><div className="ml-auto w-fit rounded-xl bg-[var(--accent-atomic)] px-3 py-2 text-sm text-[var(--accent-atomic-foreground)]">{message || "Tell me what you want to make progress on."}</div>{thinking ? <div className="flex w-fit gap-1 rounded-xl border bg-background px-4 py-3"><i className="size-1.5 animate-bounce rounded-full bg-[var(--accent-atomic)]" /><i className="size-1.5 animate-bounce rounded-full bg-[var(--accent-atomic)] [animation-delay:150ms]" /><i className="size-1.5 animate-bounce rounded-full bg-[var(--accent-atomic)] [animation-delay:300ms]" /></div> : <div className="rounded-xl border bg-background p-3"><p className="text-sm font-medium">{message ? "Here's a focused version of your day:" : "Try typing Plan my day below."}</p>{message && <div className="mt-3 grid gap-2">{TASKS.map(([task, priority, duration], index) => <div className={`flex items-center gap-2 rounded-lg border p-2 ${done.includes(index) ? "opacity-50" : ""}`} key={task}><span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${priority === "High" ? "bg-red-500/15 text-red-600" : priority === "Medium" ? "bg-orange-500/15 text-orange-600" : "bg-emerald-500/15 text-emerald-600"}`}>{priority}</span><span className={`min-w-0 flex-1 text-xs ${done.includes(index) ? "line-through" : ""}`}>{task}<small className="ml-2 inline-flex items-center gap-1 text-muted-foreground"><Clock3 className="size-3" />{duration}</small></span><Button size="xs" variant={done.includes(index) ? "default" : "outline"} onClick={() => setDone((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index])}>{done.includes(index) ? <Check /> : "Done"}</Button></div>)}</div>}</div>}<form onSubmit={submit} className="flex gap-2 border-t pt-4"><Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Try: Plan my day" aria-label="Ask Atomic AI" /><Button type="submit" size="icon" aria-label="Send prompt"><Send /></Button></form>{message && <p className="text-right text-xs text-muted-foreground">{done.length}/{TASKS.length} tasks claimed</p>}</CardContent></Card></SectionFrame>;
}
