import {
  Flame,
  Lock,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionFrame, SectionIntro } from "./SectionFrame";

const badges = [
  [Trophy, "7-Day Streak", true],
  [Target, "Task Master", true],
  [Flame, "Habit Hero", true],
  [Zap, "Early Bird", true],
  [Star, "Perfect Week", false],
  [Rocket, "Launch Mode", false],
  [Users, "Team Player", false],
  [Sparkles, "Momentum", false],
];
/** Gamification badges, streak, and leaderboard showcase. */
export default function GamificationShowcase() {
  return (
    <SectionFrame>
      <SectionIntro
        eyebrow="Progress you can feel"
        title="The little wins add up. Then they compound."
      >
        Earn visible proof that your consistency is working.
      </SectionIntro>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_.8fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Collection
              </p>
              <CardTitle>Badges to chase</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">
              4 / 8 unlocked
            </span>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-3">
            {badges.map(([Icon, label, unlocked]) => (
              <div
                className="grid justify-items-center gap-2 text-center transition-transform hover:-translate-y-1"
                key={label}
              >
                <span
                  className={`grid size-11 place-items-center rounded-xl ${unlocked ? "bg-[var(--accent-atomic)] text-[var(--accent-atomic-foreground)]" : "bg-muted text-muted-foreground"}`}
                >
                  {unlocked ? (
                    <Icon className="size-5" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                </span>
                <small className="text-[10px] text-muted-foreground">
                  {label}
                </small>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="grid justify-items-center p-6">
            <Flame className="size-14 animate-pulse text-[var(--accent-atomic)]" />
            <strong className="font-heading text-6xl">42</strong>
            <CardTitle>Day streak</CardTitle>
            <p className="mt-2 text-xs text-muted-foreground">
              Top 8% this month.
            </p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <span className="block h-full w-2/3 rounded-full bg-[var(--accent-atomic)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              This week
            </p>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["AS", "Aisha Shah", "2,480"],
              ["JM", "Jordan Miller", "2,210"],
              ["SK", "Sam Kim", "1,980"],
            ].map(([initials, name, points], index) => (
              <div
                className="flex items-center gap-2 border-b pb-3 last:border-0"
                key={name}
              >
                <span className="w-4 text-sm text-muted-foreground">
                  {index + 1}
                </span>
                <span className="grid size-8 place-items-center rounded-lg bg-[var(--accent-atomic)] text-xs font-bold text-[var(--accent-atomic-foreground)]">
                  {initials}
                </span>
                <strong className="flex-1 text-xs">{name}</strong>
                <span className="text-[10px] text-muted-foreground">
                  {points} pts
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </SectionFrame>
  );
}
