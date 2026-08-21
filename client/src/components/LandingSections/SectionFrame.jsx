import { Card } from "@/components/ui/card";
import useScrollAnimation from "@/hooks/useScrollAnimation";

/** Shared responsive wrapper for landing sections. */
export function SectionFrame({ id, className = "", children }) {
  const { ref, className: revealClass } = useScrollAnimation();
  return (
    <section
      id={id}
      ref={ref}
      className={`border-b border-border/70 px-4 py-20 transition duration-700 motion-reduce:transform-none motion-reduce:transition-none sm:px-6 sm:py-24 ${revealClass} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionIntro({ eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-muted-foreground">{children}</p>}
    </div>
  );
}

export function DemoCard({ className = "", children }) {
  return (
    <Card className={`border-border/70 shadow-lg ${className}`}>
      {children}
    </Card>
  );
}

export default SectionFrame;
