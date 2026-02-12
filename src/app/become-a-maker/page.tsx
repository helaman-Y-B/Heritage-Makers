"use client";
import Container from "@/components/layout/Container";
import styles from "./page.module.css";

/*export const metadata = {
  title: "Become a Maker | Heritage Makers",
};*/

export default function BecomeAMakerPage() {
  /*
    For error handling, we need to fisrt make the form submission work.
    Then we can add error handling logic to display the Error component
    when something goes wrong during form submission.

    The error would for when the form fails to submit, either due to
    network issues or server-side validation errors.

    Error message: "An error occurred" + specific error details.
  */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
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
            alert(data?.error || "Failed to submit maker application");
            return;
          }
        // Alert success and reset form
        alert("Application submitted successfully!");
        // Reset the form after successful submission
        form.reset();
        // Client error message
      } catch (err) {
        alert("Failed to submit application.");
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
            <input className={styles.input} name="shopLink" />
          </label>
          <button className={styles.button} type="submit">
            Submit application
          </button>
        </form>
      </section>
    </Container>
  );
}

