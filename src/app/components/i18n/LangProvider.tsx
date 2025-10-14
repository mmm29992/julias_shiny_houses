"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ui, type Lang, type Strings } from "./strings";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  strings: Strings;
};

const LangContext = createContext<Ctx | null>(null);

export default function LangProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    const saved = sessionStorage.getItem("lang") as Lang | null;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    sessionStorage.setItem("lang", l);
    fetch("/api/lang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: l, scope: "session" }),
    }).catch(() => {});
  };

  const strings: Strings = ui[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, strings }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
