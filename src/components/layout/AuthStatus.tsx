"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
/* SC: Added useEffect to persist/clear per-user cart key in localStorage */


type Props = {
  currentUser: { id: string; role: "admin" | "seller" | "buyer" } | null;
  /* SC: Added id so cart can be scoped per user */
};

const ROLE_LABELS = {
  admin: "Admin",
  seller: "Maker",
  buyer: "Buyer",
} as const;

export default function AuthStatus({ currentUser }: Props) {
  const router = useRouter();

  /* SC: Persist per-user cart key so carts don't get shared across accounts */
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("cartUserKey", currentUser.id);
    } else {
      localStorage.removeItem("cartUserKey");
    }
  }, [currentUser]);
  /* SC: End per-user cart key */

  async function handleLogout() {
    // Use NextAuth signOut to reliably clear auth session cookies.
    await signOut({ redirect: false });
    // Clear app-specific cookies used outside NextAuth.
    await fetch("/api/auth/logout", { method: "POST" });

    /* SC: Clear per-user cart key on logout */
    localStorage.removeItem("cartUserKey");
    /* SC: End clear per-user cart key */

    router.push("/login");
    router.refresh();
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {currentUser && (
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "var(--hm-accent-700)",
            border: "1px solid var(--border)",
            padding: "0.25rem 0.6rem",
            borderRadius: "999px",
            background: "var(--surface)",
            whiteSpace: "nowrap",
          }}
        >
          Role: {ROLE_LABELS[currentUser.role]}
        </span>
      )}
      {currentUser?.role === "buyer" ? (
        <Link
          href="/cart"
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--hm-accent-700)",
            border: "1px solid var(--border)",
            padding: "0.3rem 0.7rem",
            borderRadius: "999px",
            background: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          Cart 
        </Link> //SC
      ) : null}
      {currentUser ? (
        <button
          onClick={handleLogout}
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--hm-accent-700)",
            border: "1px solid var(--border)",
            padding: "0.3rem 0.7rem",
            borderRadius: "999px",
            background: "#fff",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
          type="button"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/login"
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--hm-accent-700)",
            border: "1px solid var(--border)",
            padding: "0.3rem 0.7rem",
            borderRadius: "999px",
            background: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          Login
        </Link>
      )}
    </div>
  );
}
/* SC: End localStorage user scoping for cart */
