import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "./config/db";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 4000;

// simple ping
app.get("/", (_req, res) => res.send("OK"));

async function start() {
  try {
    await connectDB(); // uses process.env.MONGO_URI

    app.get("/health/db", (_req, res) => {
      // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
      const states = [
        "disconnected",
        "connected",
        "connecting",
        "disconnecting",
      ] as const;
      const state = states[mongoose.connection.readyState as 0 | 1 | 2 | 3];
      const ok = state === "connected";

      res.status(ok ? 200 : 503).json({
        ok,
        dbState: state,
        dbName: mongoose.connection.name,
        host: mongoose.connection.host,
        time: new Date().toISOString(),
      });
    });

    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
  } catch (e) {
    console.error("Failed to start:", e);
    process.exit(1);
  }
}
start();

// graceful shutdown
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});
