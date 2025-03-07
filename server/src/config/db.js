import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: "majority",
    };

    cachedConnection.promise = mongoose.connect(process.env.MONGO_URI, opts);
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
    console.log("✅ MongoDB connected");
    return cachedConnection.conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;
