import { z } from "zod";

export const ArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  excerpt: z.string().max(500, "Excerpt must be under 500 characters").optional(),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;
