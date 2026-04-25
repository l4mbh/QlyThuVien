import { api } from "@/services/api";
import { createBookApi } from "@qltv/shared";

// Base book service from shared factories
const baseBookService = createBookApi(api);

// Extend with any Admin-specific logic if needed, or just export
export const bookService = {
  ...baseBookService,
  // You can still keep the explicit types here if needed for better IDE support
  // but the logic is now shared.
};
