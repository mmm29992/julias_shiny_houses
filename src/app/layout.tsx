// app/layout.tsx
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import LangProvider from "./components/i18n/LangProvider";
export const metadata: Metadata = { title: "Julia’s Shiny Houses" };
import "./globals.css";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⬇️ await both
  const c = await cookies();
  const h = await headers();

  const cookieLang = c.get("lang")?.value as "en" | "es" | undefined;
  const accept = h.get("accept-language") || "";
  const fallback = accept.toLowerCase().startsWith("es") ? "es" : "en";
  const initialLang =
    cookieLang === "es" || cookieLang === "en" ? cookieLang : fallback;

  return (
    <html lang={initialLang}>
      <body>
        <LangProvider initialLang={initialLang}>{children}</LangProvider>
      </body>
    </html>
  );
}
