import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...values) {
  return twMerge(clsx(values));
}

export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function passwordBytes(value = "") {
  return new TextEncoder().encode(value).length;
}

export function getServerError(error, fallback = "That didn't work — let's try again.") {
  return error?.response?.data?.message || error?.message || fallback;
}

export function fieldError(error, field) {
  const errors = error?.response?.data?.errors || [];
  return errors.find((message) =>
    String(message).toLowerCase().includes(field.toLowerCase()),
  );
}

export function applyServerErrors(form, error, fields = []) {
  const errors = error?.response?.data?.errors || [];
  let mapped = false;
  for (const field of fields) {
    const message = errors.find((item) =>
      String(item).toLowerCase().includes(`"${field.toLowerCase()}"`),
    );
    if (message) {
      form.setError(field, { type: "server", message });
      mapped = true;
    }
  }
  if (!mapped || error?.response?.data?.message) {
    form.setError("root.server", {
      type: "server",
      message: getServerError(error),
    });
  }
}
