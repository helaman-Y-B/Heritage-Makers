"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  currentUser: { role: "admin" | "seller" | "buyer" } | null;
};

const ROLE_LABELS = {
  admin: "Admin",
  seller: "Maker",
  buyer: "Buyer",
} as const;

export default function AuthStatus({ currentUser }: Props) {
  const router = useRouter();
  const { itemCount } = useCart();

  async function handleLogout() {
    /**
     * Uses NextAuth sign-out so Google/session cookies are cleared consistently.
     */
    await signOut({ callbackUrl: "/login" });
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
          Cart ({itemCount})
        </Link>
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
