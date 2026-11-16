import ApiError from "../../common/utils/apiError.js";
import { passport } from "./passport.js";

export const requireAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return next(ApiError.unauthorized("Invalid or expired access token."));
    }

    req.user = user;
    return next();
  })(req, res, next);
};

export const requireRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden("You do not have permission to do this."));
  }

  return next();
};
