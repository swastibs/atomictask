import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Reveal from "@/components/landing/Reveal";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <Reveal className="section-wrap">
        <div className="relative overflow-hidden rounded-[28px] border border-primary/25 bg-gradient-to-br from-primary/20 via-[#161523] to-cyan/10 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="absolute -left-20 -top-28 size-64 rounded-full bg-primary/25 blur-[90px]" />
          <div className="absolute -bottom-36 -right-10 size-72 rounded-full bg-cyan/15 blur-[90px]" />
          <div className="relative">
            <span className="kicker"><Sparkles className="size-3.5" /> One small win changes the day</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold tracking-[-.055em] sm:text-5xl lg:text-6xl">
              Your first streak<br className="sm:hidden" /> starts today.
            </h2>
            <p className="mt-4 text-sm text-muted">You don’t need a new personality. Just a next step.</p>
            <Button as={Link} className="mt-7" size="lg" to="/register">
              Create free account <ArrowRight className="size-4" />
            </Button>
            <p className="mt-3 text-[10px] text-muted/70">Takes 30 seconds · No credit card · Your pace, always</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
