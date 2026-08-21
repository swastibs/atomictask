import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionFrame, SectionIntro } from "./SectionFrame";

/** Monthly/yearly pricing comparison with local state. */
export default function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const plans = useMemo(
    () => [
      {
        name: "Free",
        price: "₹0",
        detail: "For getting started",
        features: [
          "Unlimited tasks",
          "5 habits",
          "Basic gamification",
          "Community support",
        ],
      },
      {
        name: "Pro",
        price: yearly ? "₹208" : "₹249",
        detail: yearly ? "per month, billed yearly" : "per month",
        popular: true,
        features: [
          "Unlimited habits",
          "AI assistant",
          "Accountability partners",
          "Advanced analytics",
          "All integrations",
          "Priority support",
        ],
      },
      {
        name: "Team",
        price: yearly ? "₹833" : "₹999",
        detail: "per month for 5 users",
        features: [
          "Everything in Pro",
          "Team dashboard",
          "Admin controls",
          "Dedicated support",
        ],
      },
    ],
    [yearly],
  );
  return (
    <SectionFrame className="bg-muted/20">
      <SectionIntro
        eyebrow="A plan for your pace"
        title="Serious about progress. Flexible about price."
      >
        Start free, upgrade when the system starts paying you back.
      </SectionIntro>
      <div className="mb-8 flex items-center justify-center gap-3 text-xs">
        <span className={!yearly ? "font-bold" : "text-muted-foreground"}>
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          onClick={() => setYearly((value) => !value)}
          className="flex h-6 w-11 rounded-full bg-muted p-1"
        >
          <span
            className={`size-4 rounded-full bg-[var(--accent-atomic)] transition-transform ${yearly ? "translate-x-5" : ""}`}
          />
        </button>
        <span className={yearly ? "font-bold" : "text-muted-foreground"}>
          Yearly <em className="not-italic text-emerald-600">Save 16%</em>
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            className={`relative ${plan.popular ? "border-[var(--accent-atomic)] shadow-lg" : ""}`}
            key={plan.name}
          >
            {plan.popular && (
              <span className="absolute right-4 top-0 -translate-y-1/2 rounded bg-[var(--accent-atomic)] px-2 py-1 text-[10px] font-bold text-[var(--accent-atomic-foreground)]">
                Most popular
              </span>
            )}
            <CardHeader>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {plan.name}
              </p>
              <CardTitle>
                {plan.name === "Pro"
                  ? "For momentum"
                  : plan.name === "Team"
                    ? "For shared goals"
                    : "For the first step"}
              </CardTitle>
              <div className="mt-4 font-heading text-4xl font-semibold">
                {plan.price}
                <small className="ml-1 text-xs font-normal text-muted-foreground">
                  {plan.name !== "Free" && "/ month"}
                </small>
              </div>
              <p className="text-xs text-muted-foreground">{plan.detail}</p>
            </CardHeader>
            <CardContent className="flex flex-col">
              <ul className="mb-6 min-h-36 space-y-3 text-xs text-muted-foreground">
                {plan.features.map((feature) => (
                  <li className="flex gap-2" key={feature}>
                    <Check className="size-4 shrink-0 text-[var(--accent-atomic)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="mt-auto"
              >
                {plan.name === "Free" ? "Start free" : `Choose ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionFrame>
  );
}
