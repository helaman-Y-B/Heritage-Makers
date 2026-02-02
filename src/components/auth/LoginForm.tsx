"use client";

import { useState } from "react";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Placeholder: connect to real auth later (Week 5).
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    console.log("LOGIN payload:", payload);

    // Fake delay so you can see the loading state
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
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

      <p className={styles.footerText}>
        Don&apos;t have an account?{" "}
        <a className={styles.link} href="/create-account">
          Create one
        </a>
      </p>
    </form>
  );
}
