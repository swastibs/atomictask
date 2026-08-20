import Redis from "ioredis";
import chalk from "chalk";
import {
  redisDB,
  redisHost,
  redisPassword,
  redisPort,
  redisTLS,
} from "./envConfig.js";

const redisOptions = {
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  db: redisDB,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

if (redisTLS) {
  redisOptions.tls = {};
}

const redis = new Redis(redisOptions);

redis.on("connect", () => {
  console.log(chalk.yellow("Redis client connecting..."));
});

redis.on("ready", () => {
  console.log(chalk.white.bold("Redis client connected and ready for use."));
});

redis.on("error", (err) => {
  console.error(chalk.red("Redis Client Error:"), chalk.red(err));
});

export default redis;
