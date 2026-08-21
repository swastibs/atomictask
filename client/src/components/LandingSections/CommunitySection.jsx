import { useState } from "react";
import { Flame, GripVertical, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionFrame, SectionIntro } from "./SectionFrame";

/** Accountability partner and team collaboration demo. */
export default function CommunitySection() {
  const [nudged, setNudged] = useState("");
  const partners = [
    ["MK", "Maya Kapoor", "18 day streak"],
    ["JL", "Jon Lee", "26 day streak"],
    ["NR", "Nora Reyes", "9 day streak"],
  ];
  return (
    <SectionFrame className="bg-muted/20">
      <SectionIntro
        eyebrow="Better together"
        title="Accountability, without the awkwardness."
      >
        Work alongside people who make showing up feel normal.
      </SectionIntro>
      <div className="grid gap-4 lg:grid-cols-[.85fr_1.15fr]">
        <Card>
          <CardHeader className="flex-row justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Your circle
              </p>
              <CardTitle>Accountability partners</CardTitle>
            </div>
            <Users className="text-[var(--accent-atomic)]" />
          </CardHeader>
          <CardContent>
            {partners.map(([initials, name, streak]) => (
              <div
                className="flex items-center gap-3 border-b py-3 last:border-0"
                key={name}
              >
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent-atomic)] text-xs font-bold text-[var(--accent-atomic-foreground)]">
                  {initials}
                </span>
                <div className="flex-1">
                  <strong className="block text-xs">{name}</strong>
                  <small className="mt-1 flex items-center gap-1 text-[10px] text-[var(--accent-atomic)]">
                    <Flame className="size-3" />
                    {streak}
                  </small>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setNudged(name)}
                >
                  {nudged === name ? "Sent" : "Nudge"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                North star squad
              </p>
              <CardTitle>Team dashboard</CardTitle>
            </div>
            <span className="text-xs text-emerald-600">● Live</span>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ["To do", "Outline launch notes"],
                ["Doing", "Polish onboarding flow"],
                ["Done", "Ship habit reminders"],
              ].map(([column, task]) => (
                <div className="rounded-lg bg-muted/60 p-2" key={column}>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {column}
                  </span>
                  <div
                    draggable
                    className="mt-2 cursor-grab rounded-md border bg-card p-2 text-xs shadow-sm"
                  >
                    <GripVertical className="mb-1 size-3 text-muted-foreground" />
                    {task}
                    <small className="mt-2 block text-[10px] text-muted-foreground">
                      Atomic team
                    </small>
                  </div>
                  <Button variant="ghost" size="xs" className="mt-2">
                    <Plus /> Add task
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t pt-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Live activity
              </p>
              {[
                "Sarah completed 5 tasks",
                "John started a new habit",
                "Maya hit a 14-day streak",
              ].map((item, index) => (
                <div
                  className="flex animate-in items-center gap-2 border-b py-2 text-xs last:border-0"
                  key={item}
                >
                  <span className="size-1.5 rounded-full bg-[var(--accent-atomic)]" />
                  {item}
                  <small className="ml-auto text-muted-foreground">
                    {index + 1}m
                  </small>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionFrame>
  );
}
