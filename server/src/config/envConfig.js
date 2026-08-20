import "dotenv/config";

export const port = process.env.PORT || 8080;
export const nodeEnv = process.env.NODE_ENV || "development";
export const mongoURI = process.env.MONGO_URI;
export const jwtSecret = process.env.JWT_SECRET;
