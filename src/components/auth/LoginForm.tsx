"use client";

import styles from "./LoginForm.module.css";
import GoogleAuthButton from "./GoogleAuthButton";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  /**
   * Google login entry point with pre-login role selection.
   * Users choose a role, then we validate authorization after Google sign-in.
   */
  const params = useSearchParams();
  const error = params.get("error");
  const requestedRole = params.get("as");

  /**
   * This component renders a login form and handles the login process.
   * It manages loading and error states, and upon successful login,
   * it redirects the user to the products page and refreshes the router.
   */
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Extract form data and convert it to a payload object
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      // Send a POST request to the login API endpoint with the email and password
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: payload.email, password: payload.password }),
      });
      // If the response is not OK, attempt to parse the error message and throw an error
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }

      router.push("/products");
      router.refresh();
    } catch (err) {
      // If an error occurs, set the error state to display the error message
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      // Regardless of success or failure, set loading to false to re-enable the form
      setLoading(false);
    } }

  return (
    <>
    <div className={styles.form}>
      {error === "role_not_allowed" && requestedRole ? (
        <div className={styles.callout}>
          <p className={styles.calloutTitle}>Role not authorized</p>
          <p className={styles.calloutText}>
            Your email is not authorized to sign in as <strong>{requestedRole}</strong>. Please pick a different role.
          </p>
        </div>
      ) : null}

      <p className={styles.footerText}>
        Choose how you want to sign in. If your email is authorized for that role, Google sign-in will continue.
      </p>

      <div className={styles.roleGrid}>
        <GoogleAuthButton role="buyer" label="Sign in as Buyer" />
        <GoogleAuthButton role="seller" label="Sign in as Maker" />
        <GoogleAuthButton role="admin" label="Sign in as Admin" />
      </div>

      <p>You can also use a created account:</p>
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

      <p className={styles.footerText}>
        Don&apos;t have an account?{" "}
        <a className={styles.link} href="/create-account">
          Create one
        </a>
      </p>
    </form>

      <p className={styles.footerText}>
        First Google sign-in creates your account as a buyer. Maker/admin access is granted by role in the database.
      </p>
    </div>
    </>
  );
}

