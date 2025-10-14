import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  uid: string;
  email: string;
  role: string;
  name?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const raw = req.cookies?.jsh_session as string | undefined;
  if (!raw) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(raw, JWT_SECRET) as AuthUser;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
