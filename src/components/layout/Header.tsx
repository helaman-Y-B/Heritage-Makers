import Link from "next/link";
import Container from "./Container";
import Navigation from "./Navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";

const ROLE_LABELS = {
  admin: "Admin",
  seller: "Maker",
  buyer: "Buyer",
} as const;

export default function Header() {
  const currentUser = getCurrentUser();
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 0",
            gap: "1rem",
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: 800,
              letterSpacing: "0.3px",
              color: "var(--hm-accent-700)",
              textDecoration: "none",
            }}
          >
            Heritage Makers
          </Link>

          <Navigation />

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
            {currentUser ? (
              <Link
                href="/api/auth/logout"
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
                Logout
              </Link>
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
        </div>
      </Container>
    </header>
  );
}
