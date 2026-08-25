import ApiError from "../utils/ApiError.js";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const attempts = new Map();

const keyFor = (req) => {
  const identity = String(req.body?.email || req.body?.username || "unknown")
    .trim()
    .toLowerCase();
  return `${req.ip}:${identity}`;
};

export const loginRateLimit = (req, res, next) => {
  const key = keyFor(req);
  const now = Date.now();
  const record = attempts.get(key);
  if (record && record.expiresAt <= now) attempts.delete(key);
  const current = attempts.get(key);
  if (current && current.failures >= MAX_FAILURES) {
    const retryAfter = Math.ceil((current.expiresAt - now) / 1000);
    res.set("Retry-After", String(retryAfter));
    return next(
      new ApiError(429, "Too many failed login attempts. Try again later."),
    );
  }

  res.on("finish", () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      attempts.delete(key);
      return;
    }
    if (res.statusCode !== 401) return;
    const existing = attempts.get(key);
    const nextRecord =
      existing && existing.expiresAt > Date.now()
        ? existing
        : { failures: 0, expiresAt: Date.now() + WINDOW_MS };
    nextRecord.failures += 1;
    attempts.set(key, nextRecord);
    if (attempts.size > 10000) {
      for (const [entryKey, entry] of attempts) {
        if (entry.expiresAt <= Date.now()) attempts.delete(entryKey);
      }
    }
  });
  next();
};
