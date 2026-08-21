import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Globe2, Headphones, ShieldCheck } from "lucide-react";
import { SectionFrame } from "./SectionFrame";

/** Trust strip with a requestAnimationFrame counter. */
export default function TrustBadges() {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / 900, 1);
          setCount(Math.round(1247 * (1 - (1 - progress) ** 3)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <SectionFrame className="py-10">
      <div
        ref={ref}
        className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex flex-wrap gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[var(--accent-atomic)]" />
            SSL encrypted
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-[var(--accent-atomic)]" />
            30-day guarantee
          </span>
          <span className="flex items-center gap-2">
            <Globe2 className="size-4 text-[var(--accent-atomic)]" />
            GDPR ready
          </span>
          <span className="flex items-center gap-2">
            <Headphones className="size-4 text-[var(--accent-atomic)]" />
            Human support
          </span>
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <i className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          <strong className="font-heading text-base text-foreground">
            {count.toLocaleString()}
          </strong>{" "}
          people are tracking habits right now
        </p>
      </div>
    </SectionFrame>
  );
}
