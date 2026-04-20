import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  code: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
