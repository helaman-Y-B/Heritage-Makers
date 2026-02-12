"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 600);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Contact Heritage Makers</p>
        <h1 className={styles.title}>Let&apos;s talk about your ideas.</h1>
        <p className={styles.subtitle}>
          Whether you have a question about an order, want to partner with us, or are
          interested in becoming a maker, we&apos;re here to help.
        </p>
      </section>

      <section className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Send a message</h2>
            <p className={styles.formSubtitle}>
              We typically respond within 1-2 business days.
            </p>
          </div>

          <div className={styles.columns}>
            <label className={styles.label}>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={styles.input}
                required
              />
            </label>
            <label className={styles.label}>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={styles.input}
                required
              />
            </label>
          </div>

          <label className={styles.label}>
            Subject
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What can we help with?"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us a bit about what you need."
              rows={6}
              className={styles.textarea}
              required
            />
          </label>

          {status === "error" && (
            <p className={styles.error}>Please fill out Name, Email, and Message.</p>
          )}

          {status === "sent" && (
            <p className={styles.success}>Message sent. Thank you!</p>
          )}

          <button className={styles.button} type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
        </form>

        <aside className={styles.infoCard}>
          <h2 className={styles.infoTitle}>Contact details</h2>
          <p className={styles.infoText}>
            Reach out for support, partnerships, or maker applications. We&apos;re happy
            to connect.
          </p>

          <div className={styles.infoList}>
            <div>
              <span className={styles.infoLabel}>Email</span>
              <p className={styles.infoValue}>support@heritagemakers.com</p>
            </div>
            <div>
              <span className={styles.infoLabel}>Phone</span>
              <p className={styles.infoValue}>+1 (208) 555-0134</p>
            </div>
            <div>
              <span className={styles.infoLabel}>Hours</span>
              <p className={styles.infoValue}>Mon-Fri, 9:00am-5:00pm MT</p>
            </div>
            <div>
              <span className={styles.infoLabel}>Location</span>
              <p className={styles.infoValue}>Boise, Idaho</p>
            </div>
          </div>

          <div className={styles.note}>
            For maker applications, include a link to your portfolio or shop.
          </div>
        </aside>
      </section>
    </main>
  );
}
