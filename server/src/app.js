import express from "express";
import morgan from "morgan";

import { globalErrorHandler } from "./shared/utils/errorHandler.js";
import authRouter from "./modules/auth/auth.routes.js";

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(globalErrorHandler);

export default app;
