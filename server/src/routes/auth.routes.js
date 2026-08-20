import express from "express";
import { validate } from "express-validation";

import {
  login,
  signUp,
  logout,
  updatePassword,
} from "../controllers/auth.controller.js";
import {
  loginSchema,
  signUpSchema,
  updatePasswordSchema,
} from "../validations/auth.validation.js";
import { authenticate } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validate(signUpSchema, {}, { abortEarly: false }),
  signUp,
);

authRouter.post(
  "/login",
  validate(loginSchema, {}, { abortEarly: false }),
  login,
);

authRouter.post("/logout", authenticate, logout);

authRouter.post(
  "/update-password",
  authenticate,
  validate(updatePasswordSchema, {}, { abortEarly: false }),
  updatePassword,
);

export default authRouter;
