import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.model.js";
import { jwtSecret } from "./envConfig.js";

if (!jwtSecret)
  throw new Error("JWT_SECRET is not defined in environment variables");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
  passReqToCallback: false,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const user = await User.findOne({
        _id: jwtPayload.id,
        isDeleted: false,
        isActive: true,
      });

      if (!user) return done(null, false);

      const sanitizedUser = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      return done(null, sanitizedUser);
    } catch (error) {
      return done(error, false);
    }
  }),
);

export default passport;
