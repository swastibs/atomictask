import cors from "cors";
import express from "express";
import { CLIENT_URL, NODE_ENV, PROJECT_NAME } from "./common/config/envConfig.js";

const app = express();

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    project: PROJECT_NAME,
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

export default app;
