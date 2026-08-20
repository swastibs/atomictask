import express from "express";
import authRouter from "../modules/auth/auth.routes.js";
import healthRouter from "../modules/health/health.routes.js";

const apiRouter = express.Router();

// Mount each module router under its own path
apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);

// Future routers (e.g., task) can be added here:
// apiRouter.use("/tasks", taskRouter);

export default apiRouter;
