import { CLIENT_URL } from "../config/envConfig.js";
import ApiError from "../utils/apiError.js";

const trustedOrigin = new URL(CLIENT_URL).origin;
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const requireTrustedOrigin = (req, _res, next) => {
  const origin = req.get("origin");

  if (
    MUTATING_METHODS.has(req.method) &&
    origin &&
    origin !== trustedOrigin
  ) {
    return next(ApiError.forbidden("Requests from this origin are not allowed."));
  }

  return next();
};

export default requireTrustedOrigin;
