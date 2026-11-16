import mongoose from "mongoose";
import { MONGO_URI } from "./envConfig.js";

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not configured. Add it to server/.env.");
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
};

export default connectDB;
