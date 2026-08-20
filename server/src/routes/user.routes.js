import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  getProfile,
  getAdminDashboard,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", authenticate, getProfile);

userRouter.get(
  "/admin/dashboard",
  authenticate,
  authorize("admin"),
  getAdminDashboard,
);

export default userRouter;
