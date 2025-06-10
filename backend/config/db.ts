import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error(
      "MongoDB connection URL is not defined in environment variables."
    );
  }

  try {
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB");

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
