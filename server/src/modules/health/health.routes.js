import express from "express";
import { getHealth } from "./health.controller.js";

const healthRouter = express.Router();

healthRouter.get("/", getHealth);

export default healthRouter;
