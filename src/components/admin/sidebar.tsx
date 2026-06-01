"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Articles", href: "/admin/articles" },
  { label: "New Article", href: "/admin/articles/new" },
] as const;

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-[220px] shrink-0 min-h-screen border-r border-[var(--color-border)] flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-[var(--color-border)]">
        <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-1">
          admin
        </p>
        <p className="text-sm font-bold text-[var(--color-foreground)] tracking-tight">
          DevLog
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {NAV.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={[
              "flex items-center pl-[22px] pr-6 py-2.5 text-2xs font-mono uppercase tracking-widest transition-colors border-l-2",
              isActive(href)
                ? "text-[var(--color-foreground)] border-[var(--color-foreground)]"
                : "text-[var(--color-muted)] border-transparent hover:text-[var(--color-foreground)]",
            ].join(" ")}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* User / Sign out */}
      <div className="px-6 py-6 border-t border-[var(--color-border)]">
        <p className="text-2xs font-mono text-[var(--color-muted)] truncate mb-3">
          {userEmail}
        </p>
        <button
          onClick={() => void signOut({ callbackUrl: "/login" })}
          className="text-2xs font-mono text-[var(--color-muted)] hover:text-[var(--color-foreground)] uppercase tracking-widest transition-colors"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
