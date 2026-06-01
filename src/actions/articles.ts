"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ArticleSchema } from "@/lib/validations/article";
import { toSlug } from "@/lib/utils/slug";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = toSlug(title);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createArticle(
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireAuth();
    const parsed = ArticleSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const { title, excerpt, content, tags } = parsed.data;
    const slug = await uniqueSlug(title);
    const tagList = parseTags(tags);

    const article = await prisma.article.create({
      data: { slug, title, excerpt, content, tags: tagList },
      select: { id: true, slug: true },
    });

    revalidatePath("/admin/articles");
    return { success: true, data: article };
  } catch (err) {
    return { success: false, error: toMessage(err) };
  }
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateArticle(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireAuth();
    const parsed = ArticleSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const { title, excerpt, content, tags } = parsed.data;
    const slug = await uniqueSlug(title, id);
    const tagList = parseTags(tags);

    const article = await prisma.article.update({
      where: { id },
      data: { slug, title, excerpt, content, tags: tagList },
      select: { id: true, slug: true },
    });

    revalidatePath("/admin/articles");
    revalidatePath(`/blog/${slug}`);
    return { success: true, data: article };
  } catch (err) {
    return { success: false, error: toMessage(err) };
  }
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteArticle(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const article = await prisma.article.delete({
      where: { id },
      select: { slug: true },
    });

    revalidatePath("/admin/articles");
    revalidatePath(`/blog/${article.slug}`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: toMessage(err) };
  }
}

// ─── Publish / Unpublish ─────────────────────────────────────────────────────

export async function publishArticle(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const article = await prisma.article.update({
      where: { id },
      data: { status: "PUBLISHED", publishedAt: new Date() },
      select: { slug: true },
    });

    revalidatePath("/admin/articles");
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: toMessage(err) };
  }
}

export async function unpublishArticle(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const article = await prisma.article.update({
      where: { id },
      data: { status: "DRAFT", publishedAt: null },
      select: { slug: true },
    });

    revalidatePath("/admin/articles");
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: toMessage(err) };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseTags(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function toMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred";
}
