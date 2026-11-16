import { clsx } from "clsx";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx("rounded-2xl border border-white/[.08] bg-white/[.035]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
