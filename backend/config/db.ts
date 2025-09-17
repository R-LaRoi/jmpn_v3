import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoURI, {
      // These options are no longer needed in newer versions of mongoose
      // but you can add them if you're using an older version
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Type assertion to handle the unknown error type
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to connect to MongoDB: ${errorMessage}`);
    process.exit(1);
  }
};

export default connectDB;