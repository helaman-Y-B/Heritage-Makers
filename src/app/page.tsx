export default function Home() {
  return (
    <main style={{ padding: "3rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Heritage Makers</h1>

      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Marketplace for handcrafted items — UI foundation check.
      </p>

      <section
        style={{
          padding: "1.5rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
        }}
      >
        <h2>Color Palette Preview</h2>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <ColorBox label="Gray 100" color="var(--hm-gray-100)" />
          <ColorBox label="Gray 200" color="var(--hm-gray-200)" />
          <ColorBox label="Gray 300" color="var(--hm-gray-300)" />
          <ColorBox label="Accent 500" color="var(--hm-accent-500)" />
          <ColorBox label="Accent 700" color="var(--hm-accent-700)" />
        </div>
      </section>
    </main>
  );
}

function ColorBox({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ width: "140px" }}>
      <div
        style={{
          height: "60px",
          background: color,
          borderRadius: "10px",
          border: "1px solid var(--border)",
        }}
      />
      <small>{label}</small>
    </div>
  );
}
