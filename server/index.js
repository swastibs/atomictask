import http from "http";
import app from "./src/app.js";
import { port } from "./src/config/envConfig.js";
import connectDB from "./src/config/db.js";
import chalk from "chalk";

const startServer = () => {
  connectDB();

  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(chalk.greenBright.bold(`Server is running on port ${port}`));
  });
};

startServer();
