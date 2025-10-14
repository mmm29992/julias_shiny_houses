// src/app/components/CreateAccountModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLang } from "./i18n/LangProvider";
import { ui } from "./i18n/strings";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: () => void;
  next?: string | null;
  onSwitchToLogin?: () => void; // optional callback to open Login modal
};

async function api(path: string, init: RequestInit = {}) {
  const normalized = path.startsWith("/api/")
    ? path
    : path.startsWith("/")
    ? `/api${path}`
    : `/api/${path}`;

  const res = await fetch(normalized, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = (j && (j.error || j.message)) || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({}));
}

export default function CreateAccountModal({
  isOpen,
  onClose,
  onSignupSuccess,
  next = null,
  onSwitchToLogin,
}: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { lang } = useLang();
  const copy = ui[lang].signup;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node))
        onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  function handleGoToLogin() {
    onClose();
    if (typeof onSwitchToLogin === "function") onSwitchToLogin();
  }

  const validate = () => {
    if (password.length < 8) {
      setErr(copy.shortPw);
      return false;
    }
    if (password !== confirm) {
      setErr(copy.mismatch);
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      setErr(null);
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          password,
          next,
        }),
      });
      setOkMsg(copy.success);
      onSignupSuccess();
    } catch (e: any) {
      setErr(e?.message || copy.genericErr);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Scroll container for small screens */}
      <div className="relative max-h-[100svh] w-full overflow-y-auto">
        <div className="h-[6svh]" />

        {/* Card */}
        <div
          ref={cardRef}
          onMouseDown={(e) => e.stopPropagation()}
          className={`
            relative mx-auto w-[92%] max-w-[460px]
            rounded-2xl border border-white/25
            bg-gradient-to-b from-white/80 to-white/55
            shadow-[0_10px_40px_rgba(0,0,0,0.30)]
            backdrop-blur-xl
            ring-1 ring-black/5
            p-6 sm:p-7
            animate-pop
          `}
        >
          {/* subtle glow */}
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-white/60 to-transparent opacity-60" />

          {/* Close pill */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              group absolute right-3 top-3
              inline-flex items-center gap-1
              rounded-full border border-slate-200/70 bg-white/80
              px-3 py-1 text-xs font-medium text-slate-600
              hover:bg-white shadow-sm
            "
          >
            <span>Close</span>
            <span className="transition group-hover:rotate-90">×</span>
          </button>

          {/* Header */}
          <div className="relative mb-5 text-center">
            <h2
              id="signup-title"
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
            >
              {copy.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{copy.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-1.5">
              <label
                htmlFor="su-name"
                className="text-sm font-medium text-slate-800"
              >
                {copy.name}
              </label>
              <input
                id="su-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full rounded-xl
                  border border-slate-200/70
                  bg-white/70 hover:bg-white/90
                  px-3 py-2
                  placeholder:text-slate-400
                  outline-none
                  focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-300
                "
              />
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="su-email"
                className="text-sm font-medium text-slate-800"
              >
                {copy.email}
              </label>
              <input
                id="su-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full rounded-xl
                  border border-slate-200/70
                  bg-white/70 hover:bg-white/90
                  px-3 py-2
                  placeholder:text-slate-400
                  outline-none
                  focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-300
                "
              />
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="su-phone"
                className="text-sm font-medium text-slate-800"
              >
                {copy.phone}
              </label>
              <input
                id="su-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="
                  w-full rounded-xl
                  border border-slate-200/70
                  bg-white/70 hover:bg-white/90
                  px-3 py-2
                  placeholder:text-slate-400
                  outline-none
                  focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-300
                "
              />
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="su-password"
                className="text-sm font-medium text-slate-800"
              >
                {copy.password}
              </label>
              <div className="relative">
                <input
                  id="su-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full rounded-xl
                    border border-slate-200/70
                    bg-white/70 hover:bg-white/90
                    px-3 py-2 pr-16
                    placeholder:text-slate-400
                    outline-none
                    focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-300
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2
                    rounded-md border border-slate-200/70 bg-white/70
                    px-2.5 py-1 text-xs font-medium text-slate-600
                    hover:bg-white shadow-sm
                  "
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="su-confirm"
                className="text-sm font-medium text-slate-800"
              >
                {copy.confirm}
              </label>
              <input
                id="su-confirm"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="
                  w-full rounded-xl
                  border border-slate-200/70
                  bg-white/70 hover:bg-white/90
                  px-3 py-2
                  placeholder:text-slate-400
                  outline-none
                  focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-300
                "
              />
            </div>

            <p className="text-[11px] text-slate-500">{copy.tos}</p>

            {err && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            )}
            {okMsg && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {okMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="
                w-full rounded-xl
                bg-gradient-to-b from-emerald-500 to-emerald-600
                text-white font-medium
                px-4 py-2.5
                shadow-[0_6px_20px_rgba(16,185,129,0.35)]
                hover:from-emerald-500 hover:to-emerald-700
                active:translate-y-[1px]
                disabled:opacity-60
              "
            >
              {submitting ? "Creating…" : copy.create}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center text-sm text-slate-600">
            {copy.haveAcct}{" "}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="font-medium text-emerald-700 hover:underline"
            >
              {copy.login}
            </button>
          </div>
        </div>

        <div className="h-[6svh]" />
      </div>
    </div>
  );
}
