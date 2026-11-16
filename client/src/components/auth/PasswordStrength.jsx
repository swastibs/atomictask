import { Check, Circle } from "lucide-react";
import { passwordBytes } from "@/lib/utils";

const checks = [
  { label: "12+ characters", valid: (value) => value.length >= 12 },
  { label: "≤ 72 UTF-8 bytes", valid: (value) => value.length > 0 && passwordBytes(value) <= 72 },
];

export default function PasswordStrength({ password = "" }) {
  const passed = checks.filter((check) => check.valid(password)).length;
  return (
    <div aria-live="polite" className="mt-2 space-y-2">
      <div aria-label={`Password checks ${passed} of 2`} className="flex gap-1.5">
        {checks.map((check) => (
          <span
            className={`h-1 flex-1 rounded-full ${check.valid(password) ? "bg-emerald-400" : "bg-white/10"}`}
            key={check.label}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted">
        <ul className="flex gap-3">
          {checks.map((check) => (
            <li className="inline-flex items-center gap-1" key={check.label}>
              {check.valid(password)
                ? <Check className="size-3 text-emerald-300" />
                : <Circle className="size-3" />}
              {check.label}
            </li>
          ))}
        </ul>
        <span className={passwordBytes(password) > 72 ? "text-rose-300" : ""}>
          {passwordBytes(password)}/72
        </span>
      </div>
    </div>
  );
}
