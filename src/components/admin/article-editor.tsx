"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  createArticle,
  updateArticle,
  publishArticle,
  unpublishArticle,
} from "@/actions/articles";

interface InitialData {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
}

export default function ArticleEditor({ initialData }: { initialData?: InitialData }) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tags, setTags] = useState(initialData?.tags.join(", ") ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    initialData?.status ?? "DRAFT",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Insert tab as 2 spaces in the textarea
  const handleEditorKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Tab") return;
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = content.substring(0, start) + "  " + content.substring(end);
      setContent(next);
      requestAnimationFrame(() => {
        el.selectionStart = start + 2;
        el.selectionEnd = start + 2;
      });
    },
    [content],
  );

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    setSavedMessage(null);

    const input = {
      title,
      excerpt: excerpt.trim() || undefined,
      content,
      tags: tags.trim() || undefined,
    };

    if (isEditing) {
      const result = await updateArticle(initialData.id, input);
      if (!result.success) {
        setError(result.error);
      } else {
        setSavedMessage("Saved.");
        setTimeout(() => setSavedMessage(null), 2000);
      }
    } else {
      const result = await createArticle(input);
      if (!result.success) {
        setError(result.error);
      } else {
        router.push(`/admin/articles/${result.data.id}`);
      }
    }

    setIsSaving(false);
  }

  async function handleTogglePublish() {
    if (!isEditing) {
      setError("Save the article before publishing.");
      return;
    }
    setIsToggling(true);
    setError(null);

    const result =
      status === "PUBLISHED"
        ? await unpublishArticle(initialData.id)
        : await publishArticle(initialData.id);

    if (!result.success) {
      setError(result.error);
    } else {
      setStatus(status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
    }
    setIsToggling(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <span
            className={`text-2xs font-mono uppercase tracking-widest px-2 py-0.5 border ${
              status === "PUBLISHED"
                ? "border-[var(--color-foreground)] text-[var(--color-foreground)]"
                : "border-[var(--color-border)] text-[var(--color-muted)]"
            }`}
          >
            {status}
          </span>
          {savedMessage && (
            <span className="text-2xs font-mono text-[var(--color-muted)]">{savedMessage}</span>
          )}
          {error && (
            <span className="text-2xs font-mono text-red-400">{error}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePublish}
            disabled={isToggling || isSaving}
            className="text-2xs font-mono uppercase tracking-widest border border-[var(--color-border)] text-[var(--color-muted)] px-3 py-1.5 hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)] transition-colors disabled:opacity-40"
          >
            {isToggling
              ? "..."
              : status === "PUBLISHED"
              ? "Unpublish"
              : "Publish"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isToggling}
            className="text-2xs font-mono uppercase tracking-widest border border-[var(--color-foreground)] text-[var(--color-foreground)] px-3 py-1.5 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-colors disabled:opacity-40"
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-8 py-5 border-b border-[var(--color-border)] flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="w-full bg-transparent text-2xl font-bold text-[var(--color-foreground)] placeholder:text-[var(--color-border)] outline-none"
        />
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt (optional)"
          className="w-full bg-transparent text-sm font-mono text-[var(--color-muted)] placeholder:text-[var(--color-border)] outline-none"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          className="w-full bg-transparent text-xs font-mono text-[var(--color-muted)] placeholder:text-[var(--color-border)] outline-none"
        />
      </div>

      {/* Split editor */}
      <div className="flex flex-1 min-h-0 divide-x divide-[var(--color-border)]">
        {/* Markdown input */}
        <div className="flex-1 flex flex-col min-w-0">
          <p className="px-8 py-2 text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest border-b border-[var(--color-border)]">
            Markdown
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleEditorKeyDown}
            placeholder="Write your article in Markdown..."
            spellCheck={false}
            className="flex-1 resize-none bg-transparent text-sm font-mono text-[var(--color-foreground)] placeholder:text-[var(--color-border)] outline-none px-8 py-6 leading-relaxed"
          />
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          <p className="px-8 py-2 text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-background)]">
            Preview
          </p>
          <div className="px-8 py-6 prose-admin">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
