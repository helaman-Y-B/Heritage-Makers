"use client";

import { useState } from "react";

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

    // Validación mínima
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      return;
    }

    // Sin backend: solo simulamos envío
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 600);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>Contact</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        Questions, feedback, or partnership ideas? Send us a message and we’ll get back to you.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            padding: 24,
            background: "#fff",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows={6}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {status === "error" && (
            <p style={{ color: "#b00020", marginTop: 12 }}>
              Please fill out Name, Email, and Message.
            </p>
          )}

          {status === "sent" && (
            <p style={{ color: "#0a7a28", marginTop: 12 }}>
              Message sent. Thank you!
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              marginTop: 16,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: status === "sending" ? "#f2f2f2" : "#2f2a3a",
              color: status === "sending" ? "#777" : "#fff",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
        </form>

        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            padding: 24,
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: 22, marginBottom: 10 }}>Contact info</h2>
          <p style={{ color: "#555", marginBottom: 12 }}>
            Heritage Makers — supporting local artisans and heritage-inspired handmade goods.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#333" }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Email:</strong> support@heritagemakers.example
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Phone:</strong> (000) 000-0000
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Hours:</strong> Mon–Fri, 9:00am–5:00pm
            </li>
          </ul>

          <p style={{ marginTop: 14, color: "#555" }}>
            (These are placeholders—replace with your team’s real contact details if required.)
          </p>
        </div>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  outline: "none",
};
