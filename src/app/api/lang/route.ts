import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { lang, scope = "session" } = await req.json(); // lang: "en" | "es"
  const res = NextResponse.json({ ok: true });

  // session cookie = no expires/maxAge
  res.cookies.set("lang", lang, {
    path: "/",
    sameSite: "lax",
    ...(scope === "persistent" ? { maxAge: 60 * 60 * 24 * 365 } : {}), // optional 1yr
  });

  return res;
}
