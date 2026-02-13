"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountSchema, CreateAccountInput } from "@/lib/auth/validationSchema";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./CreateAccountForm.module.css";

export default function CreateAccountForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateAccountInput>({
      resolver: zodResolver(createAccountSchema),
    });

    console.log("Form errors:", errors);

  const onSubmit = async (data: CreateAccountInput) => {
    setLoading(true);
    setError(null);

    try {
      // Creates a new user by sending a POST request to the /api/users endpoint with the form data as JSON.
      // Data retruns as JSON and if the response is not ok, an error is thrown.

      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to create user");
      }

      // After successfully creating the user, it sends another POST request to the /api/auth/login endpoint to log the user in using their email and password.
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
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
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.grid2}>
        <label className={styles.label}>
          First name
          <input className={styles.input} {...register("firstName")} name="firstName" required />
          {errors.firstName && <p className={styles.error}>{errors.firstName.message}</p>}
        </label>

        <label className={styles.label}>
          Last name
          <input className={styles.input} {...register("lastName")} name="lastName" required />
          {errors.lastName && <p className={styles.error}>{errors.lastName.message}</p>}
        </label>
      </div>

      <label className={styles.label}>
        Email
        <input
          className={styles.input}
          {...register("email")}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
      </label>

      <label className={styles.label}>
        Password
        <input
          className={styles.input}
          {...register("password")}
          type="password"
          name="password"
          required
          autoComplete="new-password"
          minLength={6}
          placeholder="Minimum 6 characters"
        />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
      </label>

      <label className={styles.label}>
        Confirm password
        <input
          className={styles.input}
          {...register("confirmPassword")}
          type="password"
          name="confirmPassword"
          required
          autoComplete="new-password"
          minLength={6}
        />
        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
      </label>

      <fieldset className={styles.roleGroup}>
        <legend className={styles.roleLegend}>Join as</legend>
        <div className={styles.roleOptions}>
          <label className={styles.roleOption}>
            <input
              {...register("role")}
              type="radio"
              value="buyer"
              name="role"
              defaultChecked
              required
            />
            {errors.role && <p className={styles.error}>{errors.role.message}</p>}
            Buyer
            <span className={styles.roleHint}>Shop and place orders</span>
          </label>
          <label className={styles.roleOption}>
            <input
              {...register("role")}
              type="radio"
              name="role"
              value="seller"
              required
            />
            {errors.role && <p className={styles.error}>{errors.role.message}</p>}
            Maker
            <span className={styles.roleHint}>Sell your handmade products</span>
          </label>
        </div>
      </fieldset>

      <label className={styles.checkbox}>
        <input type="checkbox" {...register("terms")} name="terms" required />
        {errors.terms && <p className={styles.error}>{errors.terms.message}</p>}
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
