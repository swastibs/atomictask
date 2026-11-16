import { Atom, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand({ compact = false }) {
  return (
    <Link aria-label="AtomicTasks home" className="inline-flex items-center gap-2.5" to="/">
      <span className="relative grid size-9 place-items-center rounded-xl bg-brand text-white shadow-glow">
        <Atom className="size-5" strokeWidth={2.2} />
        <Check className="absolute bottom-1 right-1 size-2.5" strokeWidth={3} />
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-[-.065em]">
          atomic<span className="text-[#9c85ff]">tasks</span>
        </span>
      )}
    </Link>
  );
}
