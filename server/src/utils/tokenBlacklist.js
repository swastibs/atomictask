import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import ApiError from "./ApiError.js";

export const addToBlacklist = async (token) => {
  const decoded = jwt.decode(token);

  if (!decoded || !decoded.exp) {
    throw new ApiError(400, "Invalid token");
  }

  const now = Math.floor(Date.now() / 1000);
  const ttl = decoded.exp - now;

  if (ttl > 0) {
    await redis.set(`blacklist:${token}`, "true", "EX", ttl);
  }
};

export const isBlacklisted = async (token) => {
  const result = await redis.exists(`blacklist:${token}`);
  return result === 1;
};
