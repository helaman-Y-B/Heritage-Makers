"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthNavButton() {
  const { status } = useSession();
  const router = useRouter();

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

  async function handleLogout() {
    // End NextAuth session first, then clear app-specific cookies.
    await signOut({ redirect: false }).catch(() => null);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.refresh();
    router.push("/login");
  }

  if (status === "authenticated") {
    return (
      <button
        type="button"
        onClick={handleLogout}
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
