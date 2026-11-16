export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={`relative h-7 w-12 rounded-full border transition ${
        checked ? "border-primary/50 bg-primary" : "border-white/10 bg-white/10"
      }`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
