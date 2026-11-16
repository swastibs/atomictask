import mongoose from "mongoose";
import ApiError from "../../common/utils/apiError.js";
import ApiResponse from "../../common/utils/apiResponse.js";
import {
  clearRefreshCookie,
  changePassword,
  createAccount,
  createOAuthCode,
  createOAuthRedirect,
  createSession,
  ensureEmailIsConfigured,
  exchangeOAuthCode,
  publicUser,
  REFRESH_COOKIE_NAME,
  refreshTokenHash,
  revokeAllSessions,
  revokeRefreshToken,
  rotateRefreshToken,
  sendPasswordResetEmail,
  sendVerificationEmail,
  verifyEmail,
  resetPassword,
} from "./auth.service.js";
import RefreshToken from "./refreshToken.model.js";
import User from "./user.model.js";

export const register = async (req, res) => {
  const user = await createAccount(req.body);
  return ApiResponse.created(
    res,
    "Account created. Check your email to verify your account.",
    user,
  );
};

export const login = (passport) => (req, res, next) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      if (info?.emailNotVerified) {
        return next(
          ApiError.forbidden("Verify your email before signing in."),
        );
      }
      return next(ApiError.unauthorized("Invalid email or password."));
    }

    createSession(user, req, res)
      .then((tokens) =>
        ApiResponse.ok(res, "Signed in successfully.", tokens),
      )
      .catch(next);
  })(req, res, next);
};

export const refresh = async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    throw ApiError.unauthorized("Refresh token is required.");
  }

  let tokens;
  try {
    tokens = await rotateRefreshToken(token, req, res);
  } catch (error) {
    clearRefreshCookie(res);
    throw error;
  }
  return ApiResponse.ok(res, "Session refreshed.", tokens);
};

export const logout = async (req, res) => {
  await revokeRefreshToken(req.cookies?.[REFRESH_COOKIE_NAME]);
  clearRefreshCookie(res);
  return ApiResponse.ok(res, "Signed out successfully.");
};

export const logoutAll = async (req, res) => {
  await revokeAllSessions(req.user.id);
  clearRefreshCookie(res);
  return ApiResponse.ok(res, "All sessions have been signed out.");
};

export const getCurrentUser = (req, res) =>
  ApiResponse.ok(res, "Current user.", publicUser(req.user));

export const updateProfile = async (req, res) => {
  req.user.name = req.body.name;
  await req.user.save();
  return ApiResponse.ok(res, "Profile updated.", publicUser(req.user));
};

export const updatePassword = async (req, res) => {
  const user = await changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword,
  );
  clearRefreshCookie(res);
  return ApiResponse.ok(res, "Password changed. Sign in again.", user);
};

export const forgotPassword = async (req, res) => {
  ensureEmailIsConfigured();
  const user = await User.findOne({
    email: req.body.email,
    isActive: true,
  });
  if (user) {
    await sendPasswordResetEmail(user);
  }

  return ApiResponse.ok(
    res,
    "If an account exists for that email, password reset instructions have been sent.",
  );
};

export const completePasswordReset = async (req, res) => {
  await resetPassword(req.body.token, req.body.password);
  clearRefreshCookie(res);
  return ApiResponse.ok(
    res,
    "Password reset successfully. Sign in with your new password.",
  );
};

export const verifyEmailAddress = async (req, res) => {
  const user = await verifyEmail(req.body.token);
  return ApiResponse.ok(res, "Email verified successfully.", user);
};

export const resendVerification = async (req, res) => {
  ensureEmailIsConfigured();
  const user = await User.findOne({
    email: req.body.email,
    isActive: true,
    isEmailVerified: false,
  });

  if (user) {
    await sendVerificationEmail(user);
  }

  return ApiResponse.ok(
    res,
    "If the account needs verification, a verification email has been sent.",
  );
};

export const listSessions = async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const currentTokenHash = refreshToken
    ? refreshTokenHash(refreshToken)
    : undefined;
  const sessions = await RefreshToken.find({
    userId: req.user.id,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .select("userAgent ipAddress createdAt expiresAt +tokenHash");

  return ApiResponse.ok(
    res,
    "Active sessions.",
    sessions.map((session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      current: session.tokenHash === currentTokenHash,
    })),
  );
};

export const revokeSession = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.sessionId)) {
    throw ApiError.notFound("Session not found.");
  }

  const session = await RefreshToken.findOneAndUpdate(
    {
      _id: req.params.sessionId,
      userId: req.user.id,
      revokedAt: null,
    },
    { $set: { revokedAt: new Date() } },
    { new: true },
  ).select("+tokenHash");

  if (!session) {
    throw ApiError.notFound("Session not found.");
  }

  if (
    req.cookies?.[REFRESH_COOKIE_NAME] &&
    refreshTokenHash(req.cookies[REFRESH_COOKIE_NAME]) === session.tokenHash
  ) {
    clearRefreshCookie(res);
  }

  return ApiResponse.ok(res, "Session revoked.");
};

export const exchangeCode = async (req, res) => {
  const tokens = await exchangeOAuthCode(req.body.code, req, res);
  return ApiResponse.ok(res, "Signed in successfully.", tokens);
};

export const completeOAuth = async (req, res) => {
  const code = await createOAuthCode(req.user);
  res.set("Cache-Control", "no-store");
  res.set("Referrer-Policy", "no-referrer");
  return res.redirect(303, createOAuthRedirect(code));
};
