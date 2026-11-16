import http from "http";
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
};

startServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exitCode = 1;
});
