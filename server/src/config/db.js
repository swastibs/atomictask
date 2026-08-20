import mongoose from "mongoose";
import chalk from "chalk";
import { mongoURI } from "./envConfig.js";

const connectDB = async () => {
  if (!mongoURI) {
    console.error(chalk.red("MONGO_URI is not defined in environment variables"));
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(chalk.blue(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(chalk.red("MongoDB connection error:"));
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;