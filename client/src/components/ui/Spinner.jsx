import { LoaderCircle } from "lucide-react";

export default function Spinner({ label = "Loading", className = "" }) {
  return (
    <span aria-live="polite" className={`inline-flex items-center gap-2 ${className}`} role="status">
      <LoaderCircle aria-hidden className="size-4 animate-spin" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
