import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  getProfile,
  getAdminDashboard,
  updateProfile,
} from "../controllers/user.controller.js";
import { validate } from "express-validation";
import { updateProfileSchema } from "../validations/auth.validation.js";

const userRouter = express.Router();

userRouter.get("/profile", authenticate, getProfile);
userRouter.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema, {}, { abortEarly: false, stripUnknown: true }),
  updateProfile,
);

userRouter.get(
  "/admin/dashboard",
  authenticate,
  authorize("admin"),
  getAdminDashboard,
);

export default userRouter;
