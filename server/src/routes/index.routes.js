import express from "express";
import authRouter from "./auth.routes.js";
import healthRouter from "./health.routes.js";
import userRouter from "./user.routes.js";
import taskRouter from "./task.routes.js";
import habitRouter from "./habit.routes.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/habits", habitRouter);

export default apiRouter;
