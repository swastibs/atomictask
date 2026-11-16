import { ChevronDown } from "lucide-react";
import Reveal from "@/components/landing/Reveal";

const questions = [
  ["Is there a free plan?", "Yep. The Lite tier is free forever, with unlimited tasks, up to five habits, basic badges, and a 7-day look at your analytics."],
  ["Is my data safe?", "Your account is protected with secure sessions and encrypted token handling. We never expose your refresh token to the browser."],
  ["Do I need a credit card?", "Nope. Start with the free tier and keep going at your own pace."],
  ["Does it work offline?", "Offline-friendly task access is on the roadmap. Your account foundation is ready now; the task and habit modules are coming soon."],
  ["Is the AI optional?", "Absolutely. The AI is a co-pilot, not the pilot. Use it when it helps and ignore it when you’ve got your own plan."],
  ["Can I cancel anytime?", "There’s no paid checkout yet. Pricing is a preview of the plans we’re building toward."],
  ["Is there a student discount?", "The free tier is built to be genuinely useful for students. We’ll share more about student pricing when paid plans launch."],
  ["How does the streak shield work?", "Streak shields are a planned way to protect your momentum on a rough day. The current preview shows where the feature is headed."],
];

export default function FAQ() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-wrap grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <Reveal>
          <span className="kicker">Good questions</span>
          <h2 className="section-title mt-5">Quick answers.<br /><span className="text-muted">No runaround.</span></h2>
          <p className="section-description">Still curious? Your next step is only a click away.</p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="divide-y divide-white/[.08] border-y border-white/[.08]">
            {questions.map(([question, answer]) => (
              <details className="group py-4" key={question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-1 text-sm font-medium hover:text-[#c7baff] [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown className="size-4 shrink-0 text-muted transition group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pt-3 text-xs leading-6 text-muted">{answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
