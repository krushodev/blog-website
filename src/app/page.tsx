export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full border-structural py-16 px-12">
        <p className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-6">
          v0.1.0 — system online
        </p>
        <h1 className="text-4xl font-bold text-[var(--color-foreground)] leading-tight mb-4">
          DevLog
        </h1>
        <p className="text-[var(--color-muted)] text-base font-mono">
          High-signal content on AI &amp; software engineering.
        </p>
        <div className="mt-12 h-px bg-[var(--color-border)]" />
        <p className="mt-6 text-xs text-[var(--color-muted)] font-mono">
          PHASE 1 — CORE INFRASTRUCTURE ✓
        </p>
      </div>
    </main>
  );
}
