import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Flame,
  Gauge,
  Mic2,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Reveal from "@/components/landing/Reveal";

const features = [
  [Sparkles, "AI Day Planner", "Turn “what should I do?” into a plan you can actually finish.", "ai", "col-span-1 sm:col-span-2"],
  [Gauge, "Eisenhower Prioritizer", "Give the important stuff a lane. Let the noise wait.", "violet", ""],
  [Flame, "Streak Engine", "Build small habits with rings, reminders, and a reason to return.", "pink", ""],
  [Trophy, "XP + Badges", "Real-life wins deserve more than a tiny checkbox.", "gold", ""],
  [Users, "Squads & Accountability", "Your people keep you going when motivation goes offline.", "cyan", "col-span-1 sm:col-span-2"],
  [Mic2, "Voice Tasks", "Say it once. “Call Mom at seven.” Captured, not forgotten.", "pink", ""],
  [CalendarDays, "Calendar Sync", "Let your plans and your calendar finally meet.", "violet", ""],
  [Activity, "Insights", "Spot your patterns and celebrate the progress you miss.", "cyan", ""],
  [CheckCircle2, "Everywhere", "A calmer system across devices, even when your Wi-Fi disappears.", "gold", "col-span-1 sm:col-span-2"],
];

const accents = {
  ai: "text-cyan bg-cyan/10 group-hover:shadow-glow-cyan",
  violet: "text-[#ad98ff] bg-primary/10",
  pink: "text-pink bg-pink/10",
  gold: "text-gold bg-gold/10",
  cyan: "text-cyan bg-cyan/10",
};

export default function FeatureGrid() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-wrap">
        <Reveal>
          <span className="kicker">Your new unfair advantage</span>
          <h2 className="section-title mt-5">The AtomicTasks arsenal.</h2>
          <p className="section-description">Less juggling. More doing. A few clever tools to help you keep your promises to yourself.</p>
        </Reveal>
        <div className="mt-11 grid auto-rows-fr gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {features.map(([Icon, title, body, tone, span], index) => (
            <Reveal className={span} delay={index * 0.04} key={title}>
              <article className="group relative h-full min-h-[178px] overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.028] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[.16] hover:bg-white/[.05]">
                <div className={`grid size-10 place-items-center rounded-xl ${accents[tone]}`}>
                  <Icon className="size-[18px]" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 max-w-sm text-xs leading-5 text-muted">{body}</p>
                <span className="absolute -bottom-12 -right-8 size-28 rounded-full bg-primary/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
