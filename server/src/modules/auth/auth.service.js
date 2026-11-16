import { randomBytes, randomUUID, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import ApiError from "../../common/utils/apiError.js";
import {
  API_URL,
  CLIENT_URL,
  COOKIE_SAME_SITE,
  EMAIL_ENABLED,
  EMAIL_FROM,
  JWT_AUDIENCE,
  JWT_EXPIRE,
  JWT_ISSUER,
  JWT_SECRET,
  NODE_ENV_IS_PRODUCTION,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
} from "../../common/config/envConfig.js";
import OAuthCode from "./oauthCode.model.js";
import RefreshToken from "./refreshToken.model.js";
import User from "./user.model.js";

export const REFRESH_COOKIE_NAME = "atomictasks_refresh";
const PASSWORD_HASH_ROUNDS = 12;

const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");

const createEmailToken = () => randomBytes(32).toString("hex");

export const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

export const ensureEmailIsConfigured = () => {
  if (!EMAIL_ENABLED) {
    throw ApiError.serviceUnavailable(
      "Email delivery is not configured. Set EMAIL_FROM, SMTP_HOST, SMTP_USER, and SMTP_PASS.",
    );
  }
};

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
};

export const hashPassword = (password) =>
  bcrypt.hash(password, PASSWORD_HASH_ROUNDS);

export const comparePassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash);

export const sendVerificationEmail = async (user) => {
  ensureEmailIsConfigured();
  const token = createEmailToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.emailVerificationTokenHash = hashToken(token);
  user.emailVerificationExpiresAt = expiresAt;
  await user.save();

  const verificationUrl = new URL("/auth/verify-email", CLIENT_URL);
  verificationUrl.searchParams.set("token", token);
  await sendEmail({
    to: user.email,
    subject: "Verify your AtomicTasks email",
    text: `Hi ${user.name},\n\nVerify your email within 24 hours:\n${verificationUrl}\n\nIf you did not create an account, you can ignore this email.`,
  });
};

export const sendPasswordResetEmail = async (user) => {
  ensureEmailIsConfigured();
  const token = createEmailToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  user.passwordResetTokenHash = hashToken(token);
  user.passwordResetExpiresAt = expiresAt;
  await user.save();

  const resetUrl = new URL("/auth/reset-password", CLIENT_URL);
  resetUrl.searchParams.set("token", token);
  await sendEmail({
    to: user.email,
    subject: "Reset your AtomicTasks password",
    text: `Hi ${user.name},\n\nReset your password within one hour:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
  });
};

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: NODE_ENV_IS_PRODUCTION,
  sameSite: COOKIE_SAME_SITE,
  path: "/api/auth",
});

export const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
};

const issueTokens = async (user, req, res) => {
  const sessionId = new mongoose.Types.ObjectId();
  const refreshToken = jwt.sign(
    { type: "refresh", ver: user.authVersion },
    REFRESH_TOKEN_SECRET,
    {
      algorithm: "HS256",
      subject: user.id,
      jwtid: randomUUID(),
      expiresIn: REFRESH_TOKEN_EXPIRE,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );
  const refreshPayload = jwt.decode(refreshToken);

  await RefreshToken.create({
    _id: sessionId,
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(refreshPayload.exp * 1000),
    userAgent: req.get("user-agent")?.slice(0, 512),
    ipAddress: req.ip?.slice(0, 64),
  });

  const accessToken = jwt.sign(
    { type: "access", ver: user.authVersion, sid: sessionId.toString() },
    JWT_SECRET,
    {
      algorithm: "HS256",
      subject: user.id,
      expiresIn: JWT_EXPIRE,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...refreshCookieOptions(),
    maxAge: refreshPayload.exp * 1000 - Date.now(),
  });

  return {
    accessToken,
    tokenType: "Bearer",
    expiresIn: JWT_EXPIRE,
    user: publicUser(user),
  };
};

export const createAccount = async (input) => {
  ensureEmailIsConfigured();

  if (await User.exists({ email: input.email })) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const user = new User({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
  });

  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      throw ApiError.conflict("An account with this email already exists.");
    }
    throw error;
  }

  await sendVerificationEmail(user);
  return publicUser(user);
};

export const createSession = (user, req, res) =>
  issueTokens(user, req, res);

export const rotateRefreshToken = async (token, req, res) => {
  let payload;
  try {
    payload = jwt.verify(token, REFRESH_TOKEN_SECRET, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token.");
  }

  if (
    payload.type !== "refresh" ||
    typeof payload.sub !== "string" ||
    !payload.jti
  ) {
    throw ApiError.unauthorized("Invalid or expired refresh token.");
  }

  const tokenHash = hashToken(token);
  const now = new Date();
  const storedToken = await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      userId: payload.sub,
      revokedAt: null,
      expiresAt: { $gt: now },
    },
    { $set: { revokedAt: now } },
    { new: true },
  );

  if (!storedToken) {
    const reusedToken = await RefreshToken.findOne({
      tokenHash,
      userId: payload.sub,
      revokedAt: { $ne: null },
    });
    if (reusedToken) {
      await RefreshToken.updateMany(
        { userId: payload.sub, revokedAt: null },
        { $set: { revokedAt: now } },
      );
      await User.updateOne(
        { _id: payload.sub },
        { $inc: { authVersion: 1 } },
      );
    }
    throw ApiError.unauthorized("Invalid or expired refresh token.");
  }

  const user = await User.findOne({
    _id: payload.sub,
    isActive: true,
    authVersion: payload.ver,
  });
  if (!user) {
    await RefreshToken.updateMany(
      { userId: payload.sub, revokedAt: null },
      { $set: { revokedAt: now } },
    );
    clearRefreshCookie(res);
    throw ApiError.unauthorized("Invalid or expired refresh token.");
  }

  return issueTokens(user, req, res);
};

export const revokeRefreshToken = async (token) => {
  if (!token) {
    return;
  }
  await RefreshToken.updateOne(
    { tokenHash: hashToken(token), revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
};

export const revokeAllSessions = async (userId) => {
  const now = new Date();
  await Promise.all([
    RefreshToken.updateMany(
      { userId, revokedAt: null },
      { $set: { revokedAt: now } },
    ),
    User.updateOne({ _id: userId }, { $inc: { authVersion: 1 } }),
  ]);
};

export const verifyEmail = async (token) => {
  const user = await User.findOneAndUpdate(
    {
      emailVerificationTokenHash: hashToken(token),
      emailVerificationExpiresAt: { $gt: new Date() },
      isEmailVerified: false,
    },
    {
      $set: { isEmailVerified: true },
      $unset: {
        emailVerificationTokenHash: 1,
        emailVerificationExpiresAt: 1,
      },
    },
    { new: true },
  );

  if (!user) {
    throw ApiError.badRequest("Invalid or expired email verification token.");
  }

  return publicUser(user);
};

export const resetPassword = async (token, password) => {
  const user = await User.findOneAndUpdate(
    {
      passwordResetTokenHash: hashToken(token),
      passwordResetExpiresAt: { $gt: new Date() },
      isActive: true,
    },
    {
      $set: { passwordHash: await hashPassword(password) },
      $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
      $inc: { authVersion: 1 },
    },
    { new: true },
  );

  if (!user) {
    throw ApiError.badRequest("Invalid or expired password reset token.");
  }

  await RefreshToken.updateMany(
    { userId: user.id, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findOne({ _id: userId, isActive: true }).select(
    "+passwordHash",
  );

  if (!user?.passwordHash) {
    throw ApiError.badRequest(
      "This account does not have a password. Use password reset to set one.",
    );
  }

  if (!(await comparePassword(currentPassword, user.passwordHash))) {
    throw ApiError.badRequest("Current password is incorrect.");
  }

  user.passwordHash = await hashPassword(newPassword);
  user.authVersion += 1;
  await user.save();
  await RefreshToken.updateMany(
    { userId: user.id, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );

  return publicUser(user);
};

const verifiedProviderEmail = (provider, profile) => {
  if (provider === "google") {
    const email = profile.emails?.[0]?.value;
    return profile._json?.email_verified === true ? email : undefined;
  }

  return profile.emails?.find((entry) => entry.verified && entry.primary)
    ?.value ?? profile.emails?.find((entry) => entry.verified)?.value;
};

export const findOrCreateOAuthUser = async (provider, profile) => {
  const providerField = `${provider}Id`;
  const providerId = String(profile.id);
  const email = verifiedProviderEmail(provider, profile)?.trim().toLowerCase();

  if (!email) {
    throw ApiError.unauthorized(
      "The OAuth provider did not return a verified email address.",
    );
  }

  let user = await User.findOne({ [providerField]: providerId }).select(
    `+${providerField}`,
  );
  if (user) {
    if (!user.isActive) {
      throw ApiError.forbidden("This account is disabled.");
    }
    return user;
  }

  user = await User.findOne({ email }).select(`+${providerField}`);
  if (user) {
    if (!user.isActive) {
      throw ApiError.forbidden("This account is disabled.");
    }
    if (user[providerField] && user[providerField] !== providerId) {
      throw ApiError.conflict("A different OAuth account is already linked.");
    }
    user[providerField] = providerId;
    user.isEmailVerified = true;
    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw ApiError.conflict("A different OAuth account is already linked.");
      }
      throw error;
    }
    return user;
  }

  try {
    const displayName = profile.displayName?.trim().slice(0, 80);
    const emailName = email.split("@")[0].slice(0, 80);
    return await User.create({
      name: displayName && displayName.length >= 2
        ? displayName
        : emailName.padEnd(2, "_"),
      email,
      isEmailVerified: true,
      [providerField]: providerId,
    });
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }

    user = await User.findOne({ email }).select(`+${providerField}`);
    if (!user || (user[providerField] && user[providerField] !== providerId)) {
      throw ApiError.conflict("Unable to link this OAuth account.");
    }
    user[providerField] = providerId;
    user.isEmailVerified = true;
    try {
      await user.save();
    } catch (saveError) {
      if (saveError.code === 11000) {
        throw ApiError.conflict("A different OAuth account is already linked.");
      }
      throw saveError;
    }
    return user;
  }
};

export const createOAuthCode = async (user) => {
  const code = createEmailToken();
  await OAuthCode.create({
    userId: user.id,
    codeHash: hashToken(code),
    expiresAt: new Date(Date.now() + 2 * 60 * 1000),
  });

  return code;
};

export const exchangeOAuthCode = async (code, req, res) => {
  const oauthCode = await OAuthCode.findOneAndDelete({
    codeHash: hashToken(code),
    expiresAt: { $gt: new Date() },
  });

  if (!oauthCode) {
    throw ApiError.badRequest("Invalid or expired OAuth code.");
  }

  const user = await User.findOne({ _id: oauthCode.userId, isActive: true });
  if (!user) {
    throw ApiError.unauthorized("Unable to complete OAuth sign-in.");
  }

  return issueTokens(user, req, res);
};

export const createOAuthRedirect = (code) => {
  const redirectUrl = new URL("/auth/callback", CLIENT_URL);
  redirectUrl.searchParams.set("code", code);
  return redirectUrl.toString();
};

export const oauthCallbackUrl = (provider) =>
  new URL(`/api/auth/${provider}/callback`, API_URL).toString();

export const refreshTokenHash = hashToken;
