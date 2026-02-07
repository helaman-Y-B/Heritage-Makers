"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthNavButton() {
  const { status } = useSession();

  // While session is loading, keep UI stable
  if (status === "loading") {
    return (
      <span
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          fontWeight: 700,
          opacity: 0.7,
          whiteSpace: "nowrap",
        }}
      >
        Loading...
      </span>
    );
  }

  if (status === "authenticated") {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          fontWeight: 700,
          cursor: "pointer",
          background: "transparent",
          color: "var(--text)",
          whiteSpace: "nowrap",
        }}
      >
        Sign out
      </button>
    );
  }

  return (
    <Link
      href="/login"
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        textDecoration: "none",
        fontWeight: 700,
        color: "var(--text)",
        background: "transparent",
        whiteSpace: "nowrap",
      }}
    >
      Sign in
    </Link>
  );
}
