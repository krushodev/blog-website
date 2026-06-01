"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.error && (
        <p className="text-xs font-mono text-red-400 border border-red-900 px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-widest">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] font-mono text-sm px-3 py-2 outline-none focus:border-[var(--color-foreground)] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-widest">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] font-mono text-sm px-3 py-2 outline-none focus:border-[var(--color-foreground)] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 border border-[var(--color-foreground)] text-[var(--color-foreground)] font-mono text-sm px-4 py-2 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? "AUTHENTICATING..." : "SIGN IN →"}
      </button>
    </form>
  );
}
