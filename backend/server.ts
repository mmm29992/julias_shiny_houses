// src/server.ts
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import quotesRoutes from "./routes/quotes";
import { connectDB, disconnectDB } from "./config/db";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const ORIGIN = process.env.ORIGIN || "http://localhost:3000";

// ✅ So secure cookies work behind a proxy (Render/Vercel, nginx, etc.)
app.set("trust proxy", 1);

// ✅ JSON body (bump limit if you send larger payloads)
app.use(express.json({ limit: "2mb" }));

// ✅ Cookies
app.use(cookieParser());

// ✅ CORS with credentials so browser will send/receive cookies
app.use(
  cors({
    origin: ORIGIN, // e.g. http://localhost:3000 in dev; set env in prod
    credentials: true, // allow cookie auth
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routers
app.use("/auth", authRoutes);
app.use("/quotes", quotesRoutes);

// Simple ping
app.get("/", (_req, res) => res.send("OK"));

async function start() {
  try {
    await connectDB(); // uses process.env.MONGO_URI

    // DB health check
    app.get("/health/db", (_req, res) => {
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

    // 404 fallback (optional)
    app.use((_req, res) => res.status(404).json({ error: "Not found" }));

    // Error handler (optional)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use(
      (
        err: any,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ) => {
        console.error("[unhandled]", err);
        res.status(500).json({ error: "Server error" });
      }
    );

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
