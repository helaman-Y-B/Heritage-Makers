"use client";

import styles from "./LoginForm.module.css";
import GoogleAuthButton from "./GoogleAuthButton";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  /**
   * Google login entry point with pre-login role selection.
   * Users choose a role, then we validate authorization after Google sign-in.
   */
  const params = useSearchParams();
  const error = params.get("error");
  const requestedRole = params.get("as");

  return (
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

      <p className={styles.footerText}>
        First Google sign-in creates your account as a buyer. Maker/admin access is granted by role in the database.
      </p>
    </div>
  );
}
