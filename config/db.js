import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

let cached = global.__finpilot_mongoose__;
if (!cached) cached = global.__finpilot_mongoose__ = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!MONGO_URI) throw new Error("MONGO_URI_missing");

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export { mongoose };

