import {
  BellOff,
  Brain,
  CalendarX,
  Frown,
  Users,
  ZapOff,
} from "lucide-react";
import Reveal from "@/components/landing/Reveal";

const problems = [
  [Brain, "I have 47 things to do and don't know where to start.", "The open-tab spiral is real."],
  [CalendarX, "I keep forgetting deadlines.", "Your brain has better things to do."],
  [ZapOff, "I start strong, then ghost my own goals.", "Motivation is not a system."],
  [Frown, "My to-do list gives me anxiety.", "A wall of text is not a plan."],
  [BellOff, "I want good habits — I just can't stick to them.", "Starting over gets old."],
  [Users, "I'm doing this alone and it's lonely.", "Wins are better with your people."],
];

export default function ProblemSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-wrap">
        <Reveal className="max-w-3xl">
          <span className="kicker">Sound familiar?</span>
          <h2 className="section-title mt-5">You’re not lazy.<br /><span className="text-muted">Your tools are broken.</span></h2>
          <p className="section-description">
            Productivity shouldn’t feel like a second job. If your system keeps letting you down, it’s time for a better one.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(([Icon, title, caption], index) => (
            <Reveal delay={index * 0.05} key={title}>
              <article className="group h-full rounded-2xl border border-white/[.07] bg-white/[.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[.045]">
                <span className="grid size-10 place-items-center rounded-xl bg-white/[.05] text-muted transition group-hover:bg-primary/10 group-hover:text-[#b8a8ff]">
                  <Icon className="size-4" />
                </span>
                <h3 className="mt-5 max-w-xs text-sm font-semibold leading-6">{title}</h3>
                <p className="mt-2 text-xs text-muted">{caption}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
