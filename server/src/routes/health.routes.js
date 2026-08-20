import express from "express";
import { getHealth } from "../controllers/health.controller.js";

const healthRouter = express.Router();

healthRouter.get("/", getHealth);

export default healthRouter;
