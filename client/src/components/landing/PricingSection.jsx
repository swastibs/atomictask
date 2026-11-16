import { ArrowRight, Check, Sparkles, Users, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const plans = [
  {
    name: "Lite",
    icon: Zap,
    description: "For building your first streak.",
    monthly: "₹0",
    yearly: "₹0",
    suffix: "forever",
    features: ["Unlimited tasks", "5 habits", "Basic badges", "7-day analytics"],
    cta: "Start for free",
    href: "/register?plan=lite",
  },
  {
    name: "Pro",
    icon: Sparkles,
    description: "For momentum that keeps growing.",
    monthly: "₹249",
    yearly: "₹2,490",
    suffix: "month",
    yearlySuffix: "year",
    features: ["Unlimited habits", "AI assistant", "Accountability partners", "Two-way calendar", "All integrations", "All-time analytics"],
    cta: "Get early access",
    href: "/register?plan=pro",
    popular: true,
  },
  {
    name: "Team",
    icon: Users,
    description: "For good work, done together.",
    monthly: "₹999",
    yearly: "₹9,990",
    suffix: "month",
    yearlySuffix: "year",
    features: ["Everything in Pro", "Team dashboard", "Admin controls", "Custom integrations"],
    cta: "Get early access",
    href: "/register?plan=team",
  },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section aria-labelledby="pricing-title" className="ref-section ref-pricing" id="pricing">
      <div className="ref-content-width">
        <header className="ref-section-heading is-centered">
          <span className="ref-eyebrow">Simple pricing</span>
          <h2 id="pricing-title">Start free. Upgrade when it earns its place.</h2>
          <p>Clear limits, useful upgrades, no confusing feature maze.</p>
          <div className="ref-billing-toggle">
            <span className={!yearly ? "is-selected" : ""}>Monthly</span>
            <button
              aria-label="Toggle yearly pricing"
              aria-pressed={yearly}
              className={`ref-switch${yearly ? " is-on" : ""}`}
              onClick={() => setYearly((value) => !value)}
              type="button"
            >
              <span />
            </button>
            <span className={yearly ? "is-selected" : ""}>Yearly</span>
            <span className="ref-saving-badge">SAVE ~17%</span>
          </div>
        </header>

        <div className="ref-pricing-grid">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <article
                className={`ref-plan-card${plan.popular ? " is-popular" : ""}`}
                key={plan.name}
              >
                {plan.popular && <span className="ref-popular-label">Most popular</span>}
                <div className="ref-plan-heading">
                  <span className="ref-icon-tile"><Icon aria-hidden="true" /></span>
                  <div>
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                  </div>
                </div>
                <p className="ref-plan-price">
                  {yearly ? plan.yearly : plan.monthly}
                  <span>/ {yearly ? plan.yearlySuffix || plan.suffix : plan.suffix}</span>
                </p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}><Check aria-hidden="true" /> {feature}</li>
                  ))}
                </ul>
                <Link
                  className={plan.popular ? "ref-primary-link" : "ref-outline-link"}
                  onClick={() => toast.info("Pricing goes live soon — grab early access.")}
                  to={plan.href}
                >
                  {plan.cta} <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            );
          })}
        </div>
        <p className="ref-pricing-note">Built for students, creators, and small teams.</p>
      </div>
    </section>
  );
}
