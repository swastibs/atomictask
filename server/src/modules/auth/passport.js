import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { randomBytes } from "node:crypto";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import passport from "passport";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_SECRET,
  validateAuthConfig,
} from "../../common/config/envConfig.js";
import User from "./user.model.js";
import RefreshToken from "./refreshToken.model.js";
import { findOrCreateOAuthUser, oauthCallbackUrl } from "./auth.service.js";

validateAuthConfig();

const DUMMY_PASSWORD_HASH = bcrypt.hashSync(
  randomBytes(32).toString("hex"),
  12,
);

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email: email.trim().toLowerCase(),
          isActive: true,
        }).select("+passwordHash");

        const passwordMatches = await bcrypt.compare(
          password,
          user?.passwordHash || DUMMY_PASSWORD_HASH,
        );
        if (!user || !passwordMatches) {
          return done(null, false);
        }

        if (!user.isEmailVerified) {
          return done(null, false, { emailNotVerified: true });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
    async (payload, done) => {
      try {
        if (
          payload.type !== "access" ||
          typeof payload.sub !== "string" ||
          typeof payload.sid !== "string" ||
          !mongoose.isValidObjectId(payload.sid) ||
          !Number.isInteger(payload.ver)
        ) {
          return done(null, false);
        }

        const [user, activeSession] = await Promise.all([
          User.findOne({
            _id: payload.sub,
            isActive: true,
            authVersion: payload.ver,
          }),
          RefreshToken.exists({
            _id: payload.sid,
            userId: payload.sub,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
          }),
        ]);

        return done(null, user && activeSession ? user : false);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

const googleEnabled = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
if (googleEnabled) {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: oauthCallbackUrl("google"),
        state: true,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          return done(null, await findOrCreateOAuthUser("google", profile));
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}

const githubEnabled = Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET);
if (githubEnabled) {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: oauthCallbackUrl("github"),
        scope: ["user:email"],
        allRawEmails: true,
        state: true,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          return done(null, await findOrCreateOAuthUser("github", profile));
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}

export { passport, googleEnabled, githubEnabled };
