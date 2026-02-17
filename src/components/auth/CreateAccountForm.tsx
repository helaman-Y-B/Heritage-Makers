"use client";

import GoogleAuthButton from "./GoogleAuthButton";
import styles from "./CreateAccountForm.module.css";

export default function CreateAccountForm() {
  /**
   * Google-only account creation flow.
   * User records are created after successful Google OAuth callback.
   */
  return (
    <div className={styles.form}>
      <p className={styles.footerText}>
        Use Google to create your Heritage Makers account.
      </p>
      <GoogleAuthButton role="buyer" label="Continue with Google" />
      <p className={styles.footerText}>
        New Google users start as buyers. Maker/admin access is assigned by role in the users table.
      </p>
    </div>
  );
}
