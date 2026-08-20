import http from "http";
import app from "./src/app.js";
import { port } from "./src/config/envConfig.js";
import connectDB from "./src/config/db.js";
import chalk from "chalk";

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  server.on("error", (error) => {
    if (error.syscall !== "listen") {
      console.error(chalk.red(error));
      process.exit(1);
    }

    switch (error.code) {
      case "EACCES":
        console.error(chalk.red(`Port ${port} requires elevated privileges`));
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(chalk.red(`Port ${port} is already in use`));
        process.exit(1);
        break;
      default:
        console.error(chalk.red(error));
        process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(
      chalk.greenBright.bold(
        `Server is running on port http://localhost:${port}`,
      ),
    );
  });
};

startServer();
