import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import ApiError from "../../common/utils/apiError.js";
import asyncHandler from "../../common/middleware/asyncHandler.js";
import requireTrustedOrigin from "../../common/middleware/trustedOrigin.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import ChangePasswordDto from "./dto/changePassword.dto.js";
import EmailDto from "./dto/email.dto.js";
import LoginDto from "./dto/login.dto.js";
import OAuthCodeDto from "./dto/oauthCode.dto.js";
import RegisterDto from "./dto/register.dto.js";
import ResetPasswordDto from "./dto/resetPassword.dto.js";
import TokenDto from "./dto/token.dto.js";
import UpdateProfileDto from "./dto/updateProfile.dto.js";
import {
  completeOAuth,
  completePasswordReset,
  exchangeCode,
  forgotPassword,
  getCurrentUser,
  listSessions,
  login,
  logout,
  logoutAll,
  refresh,
  register,
  resendVerification,
  revokeSession,
  updatePassword,
  updateProfile,
  verifyEmailAddress,
} from "./auth.controller.js";
import { passport, googleEnabled, githubEnabled } from "./passport.js";
import { requireAuth } from "./auth.middleware.js";
import oauthSession from "./session.middleware.js";

const router = Router();

const createRateLimiter = (windowMs, limit) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) =>
      next(ApiError.tooManyRequests("Too many authentication attempts.")),
  });

const loginLimiter = createRateLimiter(15 * 60 * 1000, 10);
const emailLimiter = createRateLimiter(60 * 60 * 1000, 5);
const registrationLimiter = createRateLimiter(60 * 60 * 1000, 5);
const oauthLimiter = createRateLimiter(15 * 60 * 1000, 10);

router.use(requireTrustedOrigin);

const startOAuth = (provider, enabled, scope) => (req, res, next) => {
  if (!enabled) {
    return next(
      ApiError.serviceUnavailable(`${provider} OAuth is not configured.`),
    );
  }

  return passport.authenticate(provider, {
    session: false,
    scope,
  })(req, res, next);
};

const requireOAuthProvider = (provider, enabled) => (_req, _res, next) => {
  if (!enabled) {
    return next(
      ApiError.serviceUnavailable(`${provider} OAuth is not configured.`),
    );
  }
  return next();
};

const finishOAuth = (provider, enabled) => [
  (req, res, next) => {
    if (!enabled) {
      return next(
        ApiError.serviceUnavailable(`${provider} OAuth is not configured.`),
      );
    }

    return passport.authenticate(
      provider,
      { session: false },
      (error, user) => {
        if (error) {
          return next(error);
        }
        if (!user) {
          return next(ApiError.unauthorized("OAuth sign-in failed."));
        }

        req.user = user;
        return next();
      },
    )(req, res, next);
  },
  asyncHandler(completeOAuth),
];

router.post(
  "/register",
  registrationLimiter,
  validate(RegisterDto),
  asyncHandler(register),
);
router.post("/login", loginLimiter, validate(LoginDto), login(passport));
router.post("/refresh", loginLimiter, asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
router.post("/logout-all", requireAuth, asyncHandler(logoutAll));

router.get("/me", requireAuth, getCurrentUser);
router.patch(
  "/me",
  requireAuth,
  validate(UpdateProfileDto),
  asyncHandler(updateProfile),
);
router.post(
  "/change-password",
  requireAuth,
  validate(ChangePasswordDto),
  asyncHandler(updatePassword),
);

router.post(
  "/forgot-password",
  emailLimiter,
  validate(EmailDto),
  asyncHandler(forgotPassword),
);
router.post(
  "/reset-password",
  loginLimiter,
  validate(ResetPasswordDto),
  asyncHandler(completePasswordReset),
);
router.post(
  "/verify-email",
  emailLimiter,
  validate(TokenDto),
  asyncHandler(verifyEmailAddress),
);
router.post(
  "/resend-verification",
  emailLimiter,
  validate(EmailDto),
  asyncHandler(resendVerification),
);

router.get("/sessions", requireAuth, asyncHandler(listSessions));
router.delete("/sessions/:sessionId", requireAuth, asyncHandler(revokeSession));

router.post(
  "/oauth/exchange",
  loginLimiter,
  validate(OAuthCodeDto),
  asyncHandler(exchangeCode),
);
router.get(
  "/google",
  oauthLimiter,
  requireOAuthProvider("Google", googleEnabled),
  oauthSession,
  startOAuth("google", googleEnabled, ["profile", "email"]),
);
router.get(
  "/google/callback",
  requireOAuthProvider("Google", googleEnabled),
  oauthSession,
  ...finishOAuth("google", googleEnabled),
);
router.get(
  "/github",
  oauthLimiter,
  requireOAuthProvider("GitHub", githubEnabled),
  oauthSession,
  startOAuth("github", githubEnabled, ["user:email"]),
);
router.get(
  "/github/callback",
  requireOAuthProvider("GitHub", githubEnabled),
  oauthSession,
  ...finishOAuth("github", githubEnabled),
);

export default router;
