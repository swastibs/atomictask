import "dotenv/config";

export const PORT = Number(process.env.PORT) || 8080;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PROJECT_NAME = process.env.PROJECT_NAME || "AtomicTasks";
export const MONGO_URI = process.env.MONGO_URI;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const API_URL = process.env.API_URL || `http://localhost:${PORT}`;

export const JWT_SECRET = process.env.JWT_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const JWT_EXPIRE = process.env.JWT_EXPIRE || "15m";
export const REFRESH_TOKEN_EXPIRE =
  process.env.REFRESH_TOKEN_EXPIRE || "30d";
export const JWT_ISSUER = process.env.JWT_ISSUER || "atomictasks-api";
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "atomictasks-client";
export const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || "lax";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const EMAIL_FROM = process.env.EMAIL_FROM;
export const EMAIL_ENABLED = Boolean(
  SMTP_HOST && SMTP_USER && SMTP_PASS && EMAIL_FROM,
);

export const NODE_ENV_IS_PRODUCTION = NODE_ENV === "production";

export const validateAuthConfig = () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is required for authentication storage.");
  }

  const requiredSecrets = {
    JWT_SECRET,
    REFRESH_TOKEN_SECRET,
    SESSION_SECRET,
  };
  const missingSecrets = Object.entries(requiredSecrets)
    .filter(([, value]) => !value || value.trim().length < 32)
    .map(([name]) => name);

  if (missingSecrets.length > 0) {
    throw new Error(
      `Authentication requires secrets of at least 32 characters: ${missingSecrets.join(", ")}`,
    );
  }

  const distinctSecrets = new Set(
    Object.values(requiredSecrets).map((value) => value.trim()),
  );
  if (distinctSecrets.size !== 3) {
    throw new Error("JWT_SECRET, REFRESH_TOKEN_SECRET, and SESSION_SECRET must be distinct.");
  }

  if (Boolean(GOOGLE_CLIENT_ID) !== Boolean(GOOGLE_CLIENT_SECRET)) {
    throw new Error("Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
  }

  if (Boolean(GITHUB_CLIENT_ID) !== Boolean(GITHUB_CLIENT_SECRET)) {
    throw new Error("Set both GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.");
  }

  const configuredSmtpValues = [
    EMAIL_FROM,
    SMTP_HOST,
    SMTP_USER,
    SMTP_PASS,
  ].filter(Boolean).length;
  if (configuredSmtpValues > 0 && !EMAIL_ENABLED) {
    throw new Error(
      "Configure EMAIL_FROM, SMTP_HOST, SMTP_USER, and SMTP_PASS together.",
    );
  }

  if (!["lax", "strict", "none"].includes(COOKIE_SAME_SITE)) {
    throw new Error("COOKIE_SAME_SITE must be lax, strict, or none.");
  }

  if (COOKIE_SAME_SITE === "none" && !NODE_ENV_IS_PRODUCTION) {
    throw new Error(
      "COOKIE_SAME_SITE=none requires NODE_ENV=production and HTTPS.",
    );
  }

  if (NODE_ENV_IS_PRODUCTION) {
    for (const [name, value] of [
      ["API_URL", API_URL],
      ["CLIENT_URL", CLIENT_URL],
    ]) {
      if (new URL(value).protocol !== "https:") {
        throw new Error(`${name} must use HTTPS in production.`);
      }
    }
  }
};
