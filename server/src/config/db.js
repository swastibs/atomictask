import mongoose from "mongoose";
import chalk from "chalk";

import { mongoURI } from "./envConfig.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(chalk.blue(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
  }
};

export default connectDB;
