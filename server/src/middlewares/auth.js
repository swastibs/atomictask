import passport from "../config/passport.js";

export const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });

    req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission",
      });

    next();
  };
};
