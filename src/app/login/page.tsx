export const dynamic = "force-dynamic";

import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in with Google to manage your account and access member features.">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
