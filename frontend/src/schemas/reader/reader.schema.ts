import * as z from "zod";

export const readerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  borrowLimit: z.number()
    .min(1, "Borrow limit must be at least 1")
    .max(20, "Borrow limit cannot exceed 20"),
});

export type ReaderFormValues = z.infer<typeof readerSchema>;
