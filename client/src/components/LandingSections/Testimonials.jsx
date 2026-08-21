import { useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionFrame, SectionIntro } from "./SectionFrame";

const testimonials = [
  [
    "LP",
    "Leena Patel",
    "Product designer",
    "AtomicTasks gave me a way to make progress on the work I kept postponing. The next step is always right there.",
  ],
  [
    "DB",
    "Daniel Brooks",
    "Graduate student",
    "My mornings feel less like a negotiation. I ask the AI for a plan, then I just take the first small win.",
  ],
  [
    "RS",
    "Riya Sen",
    "Operations lead",
    "Our team finally has visibility without another meeting-heavy project tool. The streaks keep it human.",
  ],
];
/** Accessible testimonial carousel. */
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];
  const move = (amount) =>
    setIndex(
      (value) => (value + amount + testimonials.length) % testimonials.length,
    );
  return (
    <SectionFrame className="bg-muted/20">
      <SectionIntro
        eyebrow="Made for follow-through"
        title="A little structure changes a lot."
      >
        Real people, small steps, noticeable shifts.
      </SectionIntro>
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => move(-1)}
          aria-label="Previous testimonial"
        >
          <ArrowLeft />
        </Button>
        <Card className="flex-1">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center gap-1 text-[var(--accent-atomic)]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star className="size-4" fill="currentColor" key={star} />
              ))}
            </div>
            <blockquote className="mt-5 font-heading text-lg leading-relaxed">
              &ldquo;{item[3]}&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent-atomic)] text-xs font-bold text-[var(--accent-atomic-foreground)]">
                {item[0]}
              </span>
              <span className="text-left">
                <strong className="block text-xs">{item[1]}</strong>
                <small className="text-xs text-muted-foreground">
                  {item[2]}
                </small>
              </span>
            </div>
          </CardContent>
        </Card>
        <Button
          variant="outline"
          size="icon"
          onClick={() => move(1)}
          aria-label="Next testimonial"
        >
          <ArrowRight />
        </Button>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {testimonials.map((testimonial, dot) => (
          <button
            type="button"
            className={`h-1.5 rounded-full transition-all ${dot === index ? "w-6 bg-[var(--accent-atomic)]" : "w-1.5 bg-border"}`}
            onClick={() => setIndex(dot)}
            aria-label={`Show testimonial ${dot + 1}`}
            key={testimonial[1]}
          />
        ))}
      </div>
    </SectionFrame>
  );
}
