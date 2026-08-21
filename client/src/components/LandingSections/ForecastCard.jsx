import { Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionFrame } from "./SectionFrame";

/** Motivational 30-day projection card. */
export default function ForecastCard() {
  return (
    <SectionFrame>
      <Card className="relative overflow-hidden border-[var(--accent-atomic)]/50 bg-[var(--accent-atomic)]/10 p-8 text-center sm:p-12">
        <div className="pointer-events-none absolute inset-0 text-[var(--accent-atomic)]">
          <Sparkles className="absolute left-10 top-8 animate-pulse" />
          <Sparkles className="absolute right-12 top-1/3 size-4 animate-pulse" />
          <Sparkles className="absolute bottom-8 left-1/4 size-3 animate-pulse" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Your 30-day forecast
        </span>
        <h2 className="mx-auto mt-3 max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Keep the chain. Change the shape of your days.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          If you maintain your current{" "}
          <strong className="text-foreground">12-day streak</strong>, in 30 days
          you will have completed{" "}
          <strong className="text-foreground">84 habits</strong> and{" "}
          <strong className="text-foreground">46 tasks</strong>.
        </p>
        <div className="my-7 flex justify-center gap-6 sm:gap-12">
          {[
            ["+30", "days of momentum"],
            ["84", "habits completed"],
            ["46", "tasks shipped"],
          ].map(([value, label]) => (
            <span className="grid gap-1" key={label}>
              <strong className="font-heading text-2xl text-[var(--accent-atomic)]">
                {value}
              </strong>
              <small className="text-[10px] text-muted-foreground">
                {label}
              </small>
            </span>
          ))}
        </div>
        <Button size="lg">
          <Rocket /> See my forecast
        </Button>
      </Card>
    </SectionFrame>
  );
}
