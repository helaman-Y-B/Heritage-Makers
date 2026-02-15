import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with Google to manage your account and access member features."
    >
      <LoginForm />
    </AuthShell>
  );
}
