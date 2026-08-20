import passport from "../config/passport.js";
import { isBlacklisted } from "../utils/tokenBlacklist.js";

export const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    try {
      const blacklisted = await isBlacklisted(token);
      if (blacklisted) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }
    } catch (error) {
      return next(error);
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission",
      });
    }
    next();
  };
};
