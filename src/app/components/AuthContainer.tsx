// src/app/components/AuthContainer.tsx (new client component)
"use client";

import React, { useState } from "react";
import LoginModal from "./LoginModal";
import CreateAccountModal from "./CreateAccountModal";

export default function AuthContainer() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={() => {
          setShowLogin(false);
          // do post-login work if needed
        }}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setTimeout(() => setShowSignup(true), 120); // smooth swap
        }}
      />

      <CreateAccountModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSignupSuccess={() => {
          setShowSignup(false);
          // do post-signup work if needed
        }}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setTimeout(() => setShowLogin(true), 120); // smooth swap
        }}
      />

      {/* Example triggers (optional) */}
      {/* Put your header button(s) to open one of the modals */}
      {/* <button onClick={() => setShowLogin(true)}>Log in</button> */}
      {/* <button onClick={() => setShowSignup(true)}>Create account</button> */}
    </>
  );
}
