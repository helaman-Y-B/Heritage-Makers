"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";
import GoogleAuthButton from "./GoogleAuthButton";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

<<<<<<< HEAD
=======
    // Placeholder: email/password auth is NOT implemented yet.
    // This does NOT create a session. It only logs the payload.
>>>>>>> f6fb371 (Add Google auth UI, Providers, and auth nav button)
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

<<<<<<< HEAD
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: payload.email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }

      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
=======
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
>>>>>>> f6fb371 (Add Google auth UI, Providers, and auth nav button)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Email
        <input
          className={styles.input}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </label>

      <label className={styles.label}>
        Password
        <input
          className={styles.input}
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          minLength={6}
        />
      </label>

      <div className={styles.row}>
        <label className={styles.checkbox}>
          <input type="checkbox" name="remember" />
          Remember me
        </label>

        <a className={styles.link} href="#">
          Forgot password?
        </a>
      </div>

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

<<<<<<< HEAD
      {error && <p className={styles.error}>{error}</p>}
=======
      {/* Google sign-in directly under the Sign in button */}
      <div style={{ marginTop: 12 }}>
        <GoogleAuthButton />
      </div>
>>>>>>> f6fb371 (Add Google auth UI, Providers, and auth nav button)

      <p className={styles.footerText}>
        Don&apos;t have an account?{" "}
        <a className={styles.link} href="/create-account">
          Create one
        </a>
      </p>
    </form>
  );
}
