import { z } from "zod";

/**
 * Schema for creating a new borrow record
 * POS-style: Single modal with reader selection and multiple books
 */
export const borrowFormSchema = z.object({
  userId: z.string().uuid().optional(),
  phone: z.string().optional(),
  
  bookIds: z.array(z.string().uuid()).min(1, "Please add at least one book to the cart"),
  
  dueDate: z.date().refine((date) => date > new Date(), {
    message: "Due date must be in the future",
  }),
}).refine(data => data.userId || data.phone, {
  message: "Please select a reader or enter a phone number",
  path: ["phone"]
});

/**
 * Schema for returning a single book item
 */
export const returnBookSchema = z.object({
  borrowItemId: z.string().uuid("Invalid borrow item ID"),
});

export type BorrowFormValues = z.infer<typeof borrowFormSchema>;
export type ReturnBookValues = z.infer<typeof returnBookSchema>;

