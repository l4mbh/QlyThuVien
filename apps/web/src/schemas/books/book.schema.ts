import { z } from "zod";

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  author: z.string().min(1, "Author is required").max(100),
  isbn: z.string().min(10, "ISBN must be at least 10 characters").max(13),
  totalQuantity: z.number().min(0, "Quantity must be at least 0"),
  categoryId: z.string().min(1, "Category is required"),
  callNumber: z.string().min(1, "Call number is required"),
  coverUrl: z.string().optional(),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

export const isbnSchema = z.object({
  isbn: z.string().min(10, "ISBN must be at least 10 characters").max(13),
});

