import express from "express";
import { validate } from "express-validation";
import { signUp } from "./auth.controller.js";
import { signUpSchema } from "./auth.validation.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validate(signUpSchema, {}, { abortEarly: false }),
  signUp,
);

export default authRouter;
