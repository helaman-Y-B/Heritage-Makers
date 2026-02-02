"use client";

import { useState } from "react";
import styles from "./CreateAccountForm.module.css";

export default function CreateAccountForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    console.log("CREATE ACCOUNT payload:", payload);

    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid2}>
        <label className={styles.label}>
          First name
          <input className={styles.input} name="firstName" required />
        </label>

        <label className={styles.label}>
          Last name
          <input className={styles.input} name="lastName" required />
        </label>
      </div>

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
          autoComplete="new-password"
          minLength={6}
          placeholder="Minimum 6 characters"
        />
      </label>

      <label className={styles.label}>
        Confirm password
        <input
          className={styles.input}
          type="password"
          name="confirmPassword"
          required
          autoComplete="new-password"
          minLength={6}
        />
      </label>

      <label className={styles.checkbox}>
        <input type="checkbox" name="terms" required />I agree to the terms
      </label>

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className={styles.footerText}>
        Already have an account?{" "}
        <a className={styles.link} href="/login">
          Sign in
        </a>
      </p>
    </form>
  );
}
