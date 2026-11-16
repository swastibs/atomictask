import { clsx } from "clsx";

const variants = {
  primary: "bg-brand text-white shadow-[0_8px_24px_rgba(124,92,255,.22)] hover:shadow-[0_12px_34px_rgba(124,92,255,.38)] hover:scale-[1.02]",
  secondary: "border border-white/10 bg-white/[.045] text-foreground hover:bg-white/[.08] hover:border-white/20",
  ghost: "text-muted hover:bg-white/[.06] hover:text-foreground",
  danger: "border border-rose-400/20 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
  icon: "size-10 p-0",
};

export default function Button({
  as: Component = "button",
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <Component
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55 active:scale-[.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      type={Component === "button" ? type : undefined}
      {...props}
    />
  );
}
