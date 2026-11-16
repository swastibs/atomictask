import { motion } from "framer-motion";
import { ArrowUp, Clock3, Sparkles, WandSparkles } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/landing/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function AISection() {
  const [showReply, setShowReply] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24 sm:py-32">
      <div className="section-wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="kicker"><WandSparkles className="size-3.5" /> The co-pilot, not the pilot</span>
          <h2 className="section-title mt-5">Your AI<br /><span className="gradient-text">co-pilot.</span></h2>
          <p className="section-description">
            No blank-page panic. Get a plan shaped around your priorities, your time, and the energy you actually have today.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              [Sparkles, "Plan my day", "Make a realistic plan from the pile."],
              [Clock3, "What now?", "Find the next best move in a minute."],
            ].map(([Icon, title, copy]) => (
              <div className="rounded-xl border border-white/[.08] bg-white/[.025] p-4" key={title}>
                <Icon className="size-4 text-cyan" />
                <h3 className="mt-3 text-xs font-semibold">{title}</h3>
                <p className="mt-1 text-[10px] leading-4 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass mx-auto max-w-md rounded-[26px] p-4 sm:p-6">
            <div className="flex items-center gap-3 border-b border-white/[.07] pb-4">
              <span className="grid size-9 place-items-center rounded-xl bg-cyan/10 text-cyan"><Sparkles className="size-4" /></span>
              <div><p className="text-xs font-semibold">Atomic AI</p><p className="text-[10px] text-emerald-300">Here for your next move</p></div>
              <span className="ml-auto size-2 rounded-full bg-emerald-300 shadow-[0_0_10px_#6ee7b7]" />
            </div>
            <div className="min-h-[236px] space-y-4 py-5">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-3 text-[11px] leading-5 text-white/85">
                I have a presentation, need to reply to two emails, and want to work out. What now?
              </div>
              {showReply ? (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-[92%] rounded-2xl rounded-tl-sm border border-white/[.07] bg-white/[.035] px-4 py-3 text-[11px] leading-5 text-white/80"
                  initial={{ opacity: 0, y: 8 }}
                >
                  Start with 25 minutes on your presentation while your focus is fresh. Then batch those two quick replies. Keep the workout as your end-of-day win. You’ve got this.
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-full bg-cyan/10 px-2 py-1 text-[9px] text-cyan">25 min focus</span>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] text-[#c5b7ff]">2 quick tasks</span>
                  </div>
                </motion.div>
              ) : (
                <div aria-label="AI is thinking" className="flex w-fit items-center gap-1 rounded-full bg-white/[.04] px-4 py-3">
                  {[0, 1, 2].map((n) => (
                    <motion.span
                      animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      className="size-1.5 rounded-full bg-cyan"
                      key={n}
                      transition={{ duration: 1, delay: n * 0.16, repeat: Infinity }}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              className="flex h-11 w-full items-center justify-between rounded-xl border border-white/[.08] bg-black/10 px-4 text-[10px] text-muted transition hover:border-cyan/30 hover:text-white"
              onClick={() => setShowReply((value) => !value)}
              type="button"
            >
              Ask “what now?” <span className="grid size-7 place-items-center rounded-lg bg-brand text-white"><ArrowUp className="size-3.5" /></span>
            </button>
            <p className="mt-3 text-center text-[9px] text-muted/70">You’re in charge. The AI just helps you find the next step.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
