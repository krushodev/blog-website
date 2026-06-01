export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between">
        <p className="text-2xs font-mono text-[var(--color-muted)]">
          © {new Date().getFullYear()} DevLog
        </p>
        <p className="text-2xs font-mono text-[var(--color-muted)]">
          AI &amp; Programming
        </p>
      </div>
    </footer>
  );
}
