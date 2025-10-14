// src/app/components/LoginModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLang } from "./i18n/LangProvider";
// (keep useRouter ONLY if you still navigate after login)

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onSwitchToSignup?: () => void; // ✅ add this
};

async function api(path: string, init: RequestInit = {}) {
  /* unchanged */
}

const LoginModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToSignup, // ✅ destructure it
}) => {
  const { strings } = useLang();
  const cardRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErr(null);
      setPassword("");
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  function onBackdropClick(e: React.MouseEvent) {
    if (cardRef.current && !cardRef.current.contains(e.target as Node))
      onClose();
  }

  async function handleLogin(e: React.FormEvent) {
    /* unchanged */
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      onMouseDown={onBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        ref={cardRef}
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-white/60 backdrop-blur-xl border border-white/30 shadow-2xl p-8 animate-pop"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2
            id="login-title"
            className="text-4xl font-semibold text-gray-900 mb-1"
          >
            {strings.login.title}
          </h2>
          <p className="text-sm text-gray-600">{strings.login.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            ref={firstInputRef}
            type="email"
            placeholder={strings.login.email}
            autoComplete="email"
            className="w-full rounded-xl border border-gray-300 bg-white/60 px-4 py-2 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={strings.login.password}
            autoComplete="current-password"
            className="w-full rounded-xl border border-gray-300 bg-white/60 px-4 py-2 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {err && (
            <p className="text-sm text-red-600" role="alert" aria-live="polite">
              {err}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-2 font-medium transition disabled:opacity-60"
          >
            {loading ? `${strings.login.signin}...` : strings.login.signin}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-5">
          {strings.login.noAccount}{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onSwitchToSignup) onSwitchToSignup(); // ✅ switch modals, no routing
            }}
            className="text-green-600 hover:underline font-medium"
          >
            {strings.login.create}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
