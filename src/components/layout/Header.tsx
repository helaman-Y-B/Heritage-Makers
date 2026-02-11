import Link from "next/link";
import Container from "./Container";
import Navigation from "./Navigation";
import AuthNavButton from "../auth/AuthNavButton";

export default function Header() {
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

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Navigation />
            <AuthNavButton />
          </div>
        </div>
      </Container>
    </header>
  );
}
