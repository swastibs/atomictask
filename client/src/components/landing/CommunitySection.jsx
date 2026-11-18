import { Bell, Check, Flame, Heart, Users } from "lucide-react";
import Reveal from "@/components/landing/Reveal";

const people = [
  ["M", "bg-pink-300"], ["J", "bg-cyan-300"], ["A", "bg-violet-300"],
  ["R", "bg-amber-200"], ["S", "bg-emerald-300"],
];

export default function CommunitySection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-wrap grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <Reveal>
          <span className="kicker"><Users className="size-3.5" /> Better together</span>
          <h2 className="section-title mt-5">You’re not doing<br />this alone.</h2>
          <p className="section-description">
            Accountability that feels like a friend checking in, not a manager checking up. Find your people, celebrate their wins, and keep each other moving.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {people.map(([initial, color]) => (
                <span className={`grid size-9 place-items-center rounded-full border-2 border-background text-xs font-bold text-slate-900 ${color}`} key={initial}>
                  {initial}
                </span>
              ))}
              <span className="grid size-9 place-items-center rounded-full border-2 border-background bg-white/10 text-[9px] text-white">+12k</span>
            </div>
            <span className="text-xs leading-5 text-muted">Good energy.<br /><strong className="text-white/80">Better together.</strong></span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass relative mx-auto w-full max-w-md rounded-[26px] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[.15em] text-muted">This week</p>
                <h3 className="mt-1 font-display text-xl font-semibold">The Sunday Scaries Club</h3>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Users className="size-4" /></span>
            </div>
            <div className="mt-5 space-y-2">
              {[
                ["1", "Jordan Lee", "12,450 XP", "JL", "bg-cyan-300"],
                ["2", "Maya Rivera", "11,820 XP", "MR", "bg-pink-300"],
                ["3", "Alex Chen", "10,640 XP", "AC", "bg-violet-300"],
              ].map(([rank, name, xp, initials, color], index) => (
                <div
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 ${index === 0 ? "border border-gold/20 bg-gold/[.06]" : "bg-white/[.025]"}`}
                  key={rank}
                >
                  <span className={`w-5 text-center font-mono text-xs ${index === 0 ? "text-gold" : "text-muted"}`}>0{rank}</span>
                  <span className={`grid size-8 place-items-center rounded-full text-[9px] font-bold text-slate-900 ${color}`}>{initials}</span>
                  <span className="flex-1 text-xs font-medium">{name}</span>
                  <span className="font-mono text-[10px] text-muted">{xp}</span>
                </div>
              ))}
            </div>
            <div
              className="absolute -bottom-5 -right-2 flex max-w-[250px] items-center gap-3 rounded-2xl border border-primary/20 bg-[#171523] p-3 shadow-glow sm:-right-8"
            >
              <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-pink/10 text-pink">
                <Bell className="size-4" /><span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[#171523] bg-pink" />
              </span>
              <p className="text-[10px] leading-4 text-white/75">
                <strong className="text-white">Maya nudged you</strong><br />“One tiny win today? I’m in.” 👀
              </p>
              <Heart className="size-3.5 shrink-0 text-pink" />
              <Check className="sr-only" />
            </div>
            <div className="mt-7 flex items-center justify-between text-[10px] text-muted">
              <span className="inline-flex items-center gap-1.5"><Flame className="size-3.5 text-pink" /> Weekly challenge</span>
              <span>5 days left</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
