import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

function signJWT(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function setSessionCookie(res: Response, token: string) {
  res.cookie("jsh_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      preferredLanguage = "en",
    } = req.body || {};

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (existing)
      return res.status(409).json({ error: "Email already in use" });

    const user = new User({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      phone: String(phone).trim(),
      role: "client",
      preferredLanguage: preferredLanguage === "es" ? "es" : "en",
      passwordHash: "",
    });

    await user.setPassword(String(password));
    await user.save();

    const token = signJWT({
      uid: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });
    setSessionCookie(res, token);

    return res.status(201).json({ user: user.toSafeObject() });
  } catch (err) {
    console.error("[auth/register]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Missing email or password" });

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (!user || !(await user.verifyPassword(String(password)))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signJWT({
      uid: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });
    setSessionCookie(res, token);

    return res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error("[auth/login]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /auth/me
router.get("/me", (req: Request, res: Response) => {
  try {
    const raw = req.cookies?.jsh_session as string | undefined;
    if (!raw) return res.status(401).json({ error: "No session" });
    const payload = jwt.verify(raw, JWT_SECRET) as {
      uid: string;
      email: string;
      role: string;
      name?: string;
    };
    return res.json({ user: payload });
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }
});

// POST /auth/logout
router.post("/logout", (_req: Request, res: Response) => {
  res.cookie("jsh_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  return res.json({ ok: true });
});

export default router;
