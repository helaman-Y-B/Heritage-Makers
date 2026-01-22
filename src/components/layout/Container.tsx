import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        maxWidth: "var(--container)",
        margin: "0 auto",
        padding: "0 1.25rem",
      }}
    >
      {children}
    </div>
  );
}
