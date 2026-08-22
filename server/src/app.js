import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"; // <-- new import
import passport from "./config/passport.js";
import "./config/redis.js";

import { globalErrorHandler } from "./utils/errorHandler.js";
import apiRouter from "./routes/index.routes.js";
import { clientUrl } from "./config/envConfig.js";

const app = express();

const allowedOrigins = clientUrl.split(",").map((url) => url.trim());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// --- other middleware ---
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(passport.initialize());

// --- routes ---
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(globalErrorHandler);

export default app;
