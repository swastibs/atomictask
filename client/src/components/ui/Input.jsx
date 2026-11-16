import { clsx } from "clsx";
import { forwardRef } from "react";

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
      <input
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={clsx("field", error && "border-rose-400/70 focus:border-rose-400", className)}
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
