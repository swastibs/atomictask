import http from "http";
import mongoose from "mongoose";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";
import { NODE_ENV, PORT } from "./src/common/config/envConfig.js";

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(
      `AtomicTasks server running at http://localhost:${PORT} (${NODE_ENV})`,
    );
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    console.log(`${signal} received; closing server connections.`);

    const shutdownTimeout = setTimeout(() => {
      console.error("Graceful shutdown timed out.");
      process.exit(1);
    }, 10_000);
    shutdownTimeout.unref();

    server.close(async (error) => {
      if (error) {
        console.error("Error closing the HTTP server:", error);
        process.exitCode = 1;
      }

      try {
        await mongoose.disconnect();
      } catch (shutdownError) {
        console.error("Error closing database connections:", shutdownError);
        process.exitCode = 1;
      }
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch(async (error) => {
  console.error("Failed to start the server:", error);
  try {
    await mongoose.disconnect();
  } catch (shutdownError) {
    console.error("Error closing the database connection:", shutdownError);
  }
  process.exitCode = 1;
});
