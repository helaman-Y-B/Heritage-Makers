// src/components/auth/GoogleAuthButton.tsx
"use client";

import { signIn } from "next-auth/react";

export default function GoogleAuthButton() {
  return (
    <button
      type="button"
      // === SC START ===
      // SC: After Google auth, redirect to our route that sets the custom "hm_user" cookie.
      onClick={() => signIn("google", { callbackUrl: "/api/auth/hm-sync" })}
      // === SC END ===
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #ccc",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      Continue with Google
    </button>
  );
}
