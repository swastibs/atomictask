import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { CLIENT_URL } from "./common/config/envConfig.js";
import errorHandler from "./common/middleware/error.middleware.js";
import ApiError from "./common/utils/apiError.js";
import ApiResponse from "./common/utils/apiResponse.js";
import formatUptime from "./common/utils/formatUptime.js";
import authRouter from "./modules/auth/auth.routes.js";
import { passport } from "./modules/auth/passport.js";

const app = express();
const CLIENT_ORIGIN = new URL(CLIENT_URL).origin;

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/api/health", (_req, res) => {
  return ApiResponse.ok(res, "Server is Running", undefined, {
    uptime: formatUptime(process.uptime()),
  });
});

app.use("/api/auth", authRouter);

app.use((_req, _res, next) => {
  next(ApiError.notFound("Route not found"));
});

app.use(errorHandler);

export default app;
