import "dotenv/config";

export const port = process.env.PORT || 8080;
export const nodeEnv = process.env.NODE_ENV || "development";
export const mongoURI = process.env.MONGO_URI;
export const jwtSecret = process.env.JWT_SECRET;
export const redisHost = process.env.REDIS_HOST || "127.0.0.1";
export const redisPort = process.env.REDIS_PORT || "6379";
export const redisPassword = process.env.REDIS_PASSWORD || undefined;
export const redisDB = process.env.REDIS_DB || 0;
export const redisTLS = process.env.REDIS_TLS === "true";
