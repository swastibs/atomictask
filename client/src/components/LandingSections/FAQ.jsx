import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionFrame, SectionIntro } from "./SectionFrame";

const questions = [["Can I use AtomicTasks for free?", "Yes. The Free plan includes unlimited tasks, five habits, and the core experience with no credit card required."], ["What happens when I hit the habit limit?", "Your existing habits stay safe. Archive one or upgrade when you are ready to track more."], ["Is my data secure?", "Your data is encrypted in transit and at rest, with role-based access and no sale of personal productivity data."], ["Can I cancel my subscription?", "Anytime. Your plan stays active through the current billing period."], ["Does it work on mobile?", "Yes. AtomicTasks is responsive in the browser and designed for quick mobile check-ins."], ["How does the AI assistant work?", "It turns your intent, deadlines, and available energy into a short plan. You control every suggested task."]];
/** Keyboard-accessible FAQ accordion. */
export default function FAQ() {
  const [open, setOpen] = useState(null);
  return <SectionFrame className="[content-visibility:auto]"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><SectionIntro eyebrow="Questions, answered" title="Nothing hidden behind the fine print.">A few quick answers before you begin.</SectionIntro><Card><CardContent className="p-0">{questions.map(([question, answer], index) => <div className="border-b last:border-0" key={question}><Button variant="ghost" className="flex h-auto min-h-11 w-full justify-between rounded-none px-5 py-4 text-left" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}>{question}<ChevronDown className={`size-4 transition-transform ${open === index ? "rotate-180" : ""}`} /></Button>{open === index && <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{answer}</p>}</div>)}</CardContent></Card></div></SectionFrame>;
}
