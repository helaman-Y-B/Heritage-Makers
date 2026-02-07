"use client";

import { signIn } from "next-auth/react";

export default function GoogleAuthButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
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
