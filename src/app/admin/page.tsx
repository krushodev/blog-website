import { auth } from "@/auth";
import { signOut } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[var(--color-background)] p-12">
      <div className="max-w-2xl">
        <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-4">
          panel de administración
        </p>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Dashboard</h1>
        <p className="text-sm font-mono text-[var(--color-muted)] mb-8">
          Sesión: {session?.user?.email}
        </p>
        <div className="h-px bg-[var(--color-border)] mb-8" />
        <p className="text-xs font-mono text-[var(--color-muted)]">
          PHASE 3 — AUTH ✓ — Panel en Fase 5
        </p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="text-xs font-mono text-[var(--color-muted)] border border-[var(--color-border)] px-3 py-1 hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            SIGN OUT
          </button>
        </form>
      </div>
    </main>
  );
}
