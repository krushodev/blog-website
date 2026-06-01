import { prisma } from "@/lib/prisma";
import type { ArticleStatus } from "@prisma/client";

export async function getArticlesForAdmin() {
  return prisma.article.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      tags: true,
      publishedAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({ where: { id } });
}

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" as ArticleStatus },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      tags: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" as ArticleStatus },
  });
}
