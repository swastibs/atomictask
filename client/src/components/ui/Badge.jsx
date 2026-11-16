import { clsx } from "clsx";

const colors = {
  violet: "border-primary/25 bg-primary/10 text-[#c7bcff]",
  cyan: "border-cyan/25 bg-cyan/10 text-cyan",
  pink: "border-pink/25 bg-pink/10 text-pink",
  gold: "border-gold/25 bg-gold/10 text-gold",
  green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  neutral: "border-white/10 bg-white/[.045] text-muted",
};

export default function Badge({ className, tone = "violet", children }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.12em]",
        colors[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
