import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import redis from "../config/redis.js";
import ApiError from "./ApiError.js";

const blacklistKey = (token) =>
  `blacklist:${createHash("sha256").update(token).digest("hex")}`;

export const addToBlacklist = async (token) => {
  const decoded = jwt.decode(token);

  if (!decoded || !decoded.exp) {
    throw new ApiError(400, "Invalid token");
  }

  const now = Math.floor(Date.now() / 1000);
  const ttl = decoded.exp - now;

  if (ttl > 0) {
    await redis.set(blacklistKey(token), "true", "EX", ttl);
  }
};

export const isBlacklisted = async (token) => {
  const result = await redis.exists(blacklistKey(token));
  return result === 1;
};
