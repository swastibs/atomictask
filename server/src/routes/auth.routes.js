import express from "express";
import { validate } from "express-validation";
import { login, signUp } from "../controllers/auth.controller.js";
import { loginSchema, signUpSchema } from "../controllers/auth.validation.js";

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

export default authRouter;
