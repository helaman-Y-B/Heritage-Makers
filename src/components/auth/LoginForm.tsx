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

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

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
          placeholder="********"
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

      {error && <p className={styles.error}>{error}</p>}
      <div style={{ marginTop: 12 }}>
        <GoogleAuthButton />
      </div>

      <p className={styles.footerText}>
        Don&apos;t have an account?{" "}
        <a className={styles.link} href="/create-account">
          Create one
        </a>
      </p>
    </form>
  );
}
