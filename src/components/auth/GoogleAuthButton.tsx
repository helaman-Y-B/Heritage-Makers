"use client";

import { signIn } from "next-auth/react";
import { Role } from "@/lib/auth/roles";

type Props = {
  role: Role;
  label: string;
};

export default function GoogleAuthButton({ role, label }: Props) {
  /**
   * Starts Google OAuth with a callback that applies the requested role.
   * The server validates whether the signed-in email is allowed to use that role.
   */
  return (
    <button
      type="button"
      onClick={() =>
        signIn(
          "google",
          { callbackUrl: `/auth/role?as=${encodeURIComponent(role)}` },
          { prompt: "select_account" },
        )
      }
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #ccc",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}
