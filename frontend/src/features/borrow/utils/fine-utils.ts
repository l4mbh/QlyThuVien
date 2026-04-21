import { isAfter } from "date-fns";

export const FINE_RATE_PER_DAY = 5000;

/**
 * Calculates overdue details for a given due date
 */
export const calculateOverdue = (dueDate: string | Date, returnedAt?: string | Date | null) => {
  const due = new Date(dueDate);
  const end = returnedAt ? new Date(returnedAt) : new Date();
  
  const isOverdue = isAfter(end, due);
  if (!isOverdue) return { isOverdue: false, days: 0, fine: 0 };

  // differenceInDays counts full days. For library, even 1 minute late counts as 1 day.
  // So we use a manual calculation or ensure we handle the "any part of a day" logic.
  const diffTime = end.getTime() - due.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    isOverdue: true,
    days,
    fine: days * FINE_RATE_PER_DAY,
  };
};

/**
 * Formats currency to VNĐ
 */
export const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
