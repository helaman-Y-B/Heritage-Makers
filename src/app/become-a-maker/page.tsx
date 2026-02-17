"use client";
import Container from "@/components/layout/Container";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BecomeAMakerPage() {
  /**
   * Become a Maker form submission handler and webpage component.
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Gather form data into an object
    // We need to do that since if we only use formData
    // The code will run again and it will display the error component.
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      // Submit the form data to the API route
      const response = await fetch("/api/createMaker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Client error message
        setError(data?.error || "Failed to submit maker application");
        setLoading(false);
        return;
      }

      // Success: reset form and show success message
      setSuccess(true);
      form.reset();
      // Refresh so server components (header role badge, products permissions) update immediately.
      router.refresh();
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <section className={styles.hero}>
        <p className={styles.kicker}>Maker application</p>
        <h1 className={styles.title}>Bring your craft to Heritage Makers.</h1>
        <p className={styles.subtitle}>
          Tell us about your work, your process, and the kinds of products you
          create. We review applications to keep the marketplace curated and
          high quality.
        </p>
      </section>

      <section className={styles.formCard}>
        <h2 className={styles.formTitle}>Apply to become a maker</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Business or studio name
            <input className={styles.input} name="studioName" required />
          </label>
          <label className={styles.label}>
            What do you make?
            <input
              className={styles.input}
              name="craftType"
              placeholder="Textiles, pottery, jewelry..."
              required
            />
          </label>
          <label className={styles.label}>
            Tell us your story
            <textarea
              className={styles.textarea}
              name="story"
              rows={4}
              placeholder="Share your background and process"
              required
            />
          </label>
          <label className={styles.label}>
            Portfolio or shop link (optional)
            <input className={styles.input} name="shopLink" type="url" />
          </label>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>Application submitted successfully! We'll review it and be in touch.</p>}

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </section>
    </Container>
  );
}
