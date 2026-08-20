import "dotenv/config";

export const port = process.env.PORT;
export const nodeEnv = process.env.NODE_ENV;
export const mongoURI = process.env.MONGO_URI;
export const jwtSecret = process.env.JWT_SECRET;
