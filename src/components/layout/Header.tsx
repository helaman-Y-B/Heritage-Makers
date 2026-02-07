import Link from "next/link";
import Container from "./Container";
import Navigation from "./Navigation";
<<<<<<< HEAD
import { getCurrentUser } from "@/lib/auth/currentUser";
import AuthStatus from "./AuthStatus";
=======
import AuthNavButton from "../auth/AuthNavButton";
>>>>>>> f6fb371 (Add Google auth UI, Providers, and auth nav button)

export default async function Header() {
  const currentUser = await getCurrentUser();
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

<<<<<<< HEAD
          <Navigation />

          <AuthStatus currentUser={currentUser} />
=======
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Navigation />
            <AuthNavButton />
          </div>
>>>>>>> f6fb371 (Add Google auth UI, Providers, and auth nav button)
        </div>
      </Container>
    </header>
  );
}
