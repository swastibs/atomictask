import "dotenv/config";

export const PORT = Number(process.env.PORT) || 8080;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PROJECT_NAME = process.env.PROJECT_NAME || "AtomicTasks";
export const MONGO_URI = process.env.MONGO_URI;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
