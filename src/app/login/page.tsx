import type { Metadata } from "next";
import LoginForm from "./_components/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="border border-[var(--color-border)] px-8 py-10">
          <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-6">
            admin access
          </p>
          <h1 className="text-xl font-bold text-[var(--color-foreground)] mb-8">
            DevLog
          </h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
