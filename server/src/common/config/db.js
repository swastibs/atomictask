import mongoose from "mongoose";
import { getMongoDatabaseName, MONGO_URI, NODE_ENV } from "./envConfig.js";

const connectDB = async () => {
  const databaseName = getMongoDatabaseName(NODE_ENV);

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not configured. Add it to server/.env.");
  }

  try {
    await mongoose.connect(MONGO_URI, { dbName: databaseName });
    console.log(`Connected to MongoDB database "${databaseName}"`);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
};

export default connectDB;
