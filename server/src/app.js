import cors from "cors";
import express from "express";
import { CLIENT_URL } from "./common/config/envConfig.js";
import errorHandler from "./common/middleware/error.middleware.js";
import ApiError from "./common/utils/apiError.js";
import ApiResponse from "./common/utils/apiResponse.js";
import formatUptime from "./common/utils/formatUptime.js";

const app = express();

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  return ApiResponse.ok(res, "Server is Running", undefined, {
    uptime: formatUptime(process.uptime()),
  });
});

app.use((_req, _res, next) => {
  next(ApiError.notFound("Route not found"));
});

app.use(errorHandler);

export default app;
