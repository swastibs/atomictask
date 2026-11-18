import { Award, Flame, Shield, Sparkles, Star, Trophy } from "lucide-react";
import Reveal from "@/components/landing/Reveal";

const badges = [
  ["First light", "🌅"],
  ["On a roll", "🔥"],
  ["Deep focus", "🎯"],
  ["Crew MVP", "🏆"],
];

export default function GamificationShowcase() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="kicker"><Trophy className="size-3.5" /> Play the long game</span>
          <h2 className="section-title mt-5">Productivity,<br />but make it a game.</h2>
          <p className="section-description">
            Nobody likes boring to-do lists. We made showing up feel like a win worth coming back for.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              [Sparkles, "Earn XP for the real work"],
              [Award, "Level up as you build momentum"],
              [Shield, "Protect your streak on hard days"],
              [Flame, "Turn one good day into your next"],
            ].map(([Icon, text]) => (
              <li className="flex items-center gap-3 text-sm text-white/80" key={text}>
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-[#b7a5ff]"><Icon className="size-4" /></span>
                {text}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="glass relative overflow-hidden rounded-[26px] p-5 sm:p-7">
            <div className="absolute -right-16 -top-20 size-56 rounded-full bg-primary/15 blur-[80px]" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[.16em] text-muted">Your progress</p>
                <p className="mt-1 font-display text-2xl font-semibold">Level 08 <span className="text-base text-muted">· Pathfinder</span></p>
              </div>
              <div className="grid size-12 place-items-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
                <Star className="size-5 fill-gold/20" />
              </div>
            </div>
            <div className="relative mt-7">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-muted">2,420 XP</span><span className="font-mono text-gold">80 XP to level 9</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/[.07] p-[2px]">
                <div className="h-full w-[76%] rounded-full bg-brand" />
              </div>
            </div>
            <div className="relative mt-7">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Fresh unlocks</h3>
                <span className="text-[10px] text-muted">View all →</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {badges.map(([label, icon], index) => (
                  <div
                    className={`rounded-xl border p-3 text-center ${index === 1 ? "border-pink/25 bg-pink/[.07]" : "border-white/[.07] bg-black/10"}`}
                    key={label}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="mt-2 block text-[9px] text-muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="absolute right-8 top-20 flex items-center gap-2 rounded-full border border-gold/25 bg-[#1a1720] px-3 py-2 text-xs text-gold shadow-glow"
            >
              <Sparkles className="size-3.5" /> Level up!
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
