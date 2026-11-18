import { clsx } from "clsx";
import { forwardRef } from "react";
import { Input as AnimatedInput } from "@/components/keyframery/input";

const Input = forwardRef(function Input(
  { label, id, error, hint, className, ...props },
  ref,
) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground/90" htmlFor={id}>
          {label}
        </label>
      )}
      <AnimatedInput
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={Boolean(error) || undefined}
        className={clsx("h-12 rounded-xl bg-background/70 px-4 text-sm", className)}
        id={id}
        ref={ref}
        {...props}
      />
      {error && <span className="field-error" id={`${id}-error`}>{error}</span>}
      {!error && hint && (
        <span className="block text-xs text-muted" id={`${id}-hint`}>{hint}</span>
      )}
    </div>
  );
});

export default Input;
