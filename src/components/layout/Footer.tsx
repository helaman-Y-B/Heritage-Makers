import Container from "./Container";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: "3rem" }}>
      <Container>
        <div style={{ padding: "1.5rem 0", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Heritage Makers • Built by Team Heritage Makers
        </div>
      </Container>
    </footer>
  );
}
