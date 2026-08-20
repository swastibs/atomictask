import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import passport from "./config/passport.js";
import "./config/redis.js";

import { globalErrorHandler } from "./utils/errorHandler.js";
import apiRouter from "./routes/index.routes.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(globalErrorHandler);

export default app;
