"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./CreateAccountForm.module.css";

export default function CreateAccountForm() {
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
      // Creates a new user by sending a POST request to the /api/users endpoint with the form data as JSON.
      // Data retruns as JSON and if the response is not ok, an error is thrown.

      if (payload.password !== payload.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create user");
      }

      // After successfully creating the user, it sends another POST request to the /api/auth/login endpoint to log the user in using their email and password.
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: payload.email, password: payload.password }),
      });

      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
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

      <fieldset className={styles.roleGroup}>
        <legend className={styles.roleLegend}>Join as</legend>
        <div className={styles.roleOptions}>
          <label className={styles.roleOption}>
            <input
              type="radio"
              name="role"
              value="buyer"
              defaultChecked
              required
            />
            Buyer
            <span className={styles.roleHint}>Shop and place orders</span>
          </label>
          <label className={styles.roleOption}>
            <input type="radio" name="role" value="seller" required />
            Maker
            <span className={styles.roleHint}>Sell your handmade products</span>
          </label>
        </div>
      </fieldset>

      <label className={styles.checkbox}>
        <input type="checkbox" name="terms" required />
        I agree to the{" "}
        <Link className={styles.inlineLink} href="/terms">
          terms
        </Link>
      </label>

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.footerText}>
        Already have an account?{" "}
        <a className={styles.link} href="/login">
          Sign in
        </a>
      </p>
    </form>
  );
}
