import MongoStore from "connect-mongo";
import session from "express-session";
import mongoose from "mongoose";
import ApiError from "../../common/utils/apiError.js";
import {
  NODE_ENV_IS_PRODUCTION,
  SESSION_SECRET,
} from "../../common/config/envConfig.js";

let sessionMiddleware;

const oauthSession = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next(
      ApiError.serviceUnavailable("OAuth session storage is unavailable."),
    );
  }

  if (!sessionMiddleware) {
    const store = MongoStore.create({
      client: mongoose.connection.getClient(),
      dbName: mongoose.connection.name,
      collectionName: "oauth_sessions",
      ttl: 10 * 60,
      autoRemove: "native",
    });

    sessionMiddleware = session({
      name: "atomictasks.oauth",
      secret: SESSION_SECRET,
      store,
      resave: false,
      saveUninitialized: false,
      proxy: NODE_ENV_IS_PRODUCTION,
      cookie: {
        httpOnly: true,
        secure: NODE_ENV_IS_PRODUCTION,
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
        path: "/api/auth",
      },
    });
  }

  return sessionMiddleware(req, res, next);
};

export default oauthSession;
