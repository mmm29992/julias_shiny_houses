import mongoose from "mongoose";

let isConnected = 0; // 0=off, 1=on

export async function connectDB(uri = process.env.MONGO_URI as string) {
  if (!uri) throw new Error("MONGO_URI is not set");

  if (isConnected) return mongoose.connection;

  // Mongoose 8: sensible defaults; no extra options needed.
  await mongoose.connect(uri);

  isConnected = 1;

  mongoose.connection.on("connected", () => {
    console.log("[db] connected:", mongoose.connection.name);
  });

  mongoose.connection.on("error", (err) => {
    console.error("[db] connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] disconnected");
    isConnected = 0;
  });

  return mongoose.connection;
}

export async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = 0;
}
