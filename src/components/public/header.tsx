import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="max-w-2xl mx-auto px-6 py-6 flex items-end justify-between">
        <Link href="/" className="group">
          <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-0.5 group-hover:text-[var(--color-foreground)] transition-colors">
            devlog
          </p>
          <p className="text-sm font-bold text-[var(--color-foreground)]">
            AI &amp; Programming
          </p>
        </Link>

        <nav>
          <Link
            href="/"
            className="text-2xs font-mono text-[var(--color-muted)] hover:text-[var(--color-foreground)] uppercase tracking-widest transition-colors"
          >
            Articles
          </Link>
        </nav>
      </div>
    </header>
  );
}
