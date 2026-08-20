import express from "express";
import authRouter from "./auth.routes.js";
import healthRouter from "./health.routes.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);

export default apiRouter;
