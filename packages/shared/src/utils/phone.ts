/**
 * Normalize phone number to international format (+84...)
 * Rules:
 * - Remove spaces, dots, dashes, parentheses
 * - 0912345678 -> +84912345678
 * - 912345678 -> +84912345678
 * - 84912345678 -> +84912345678
 */
export const normalizePhone = (phone: string): string => {
  if (!phone) return "";

  // Remove all non-digit characters except '+'
  let cleaned = phone.replace(/[^\d+]/g, "");

  // If starts with '0', replace with '+84'
  if (cleaned.startsWith("0")) {
    return "+84" + cleaned.substring(1);
  }

  // If starts with '84' but no '+', add '+'
  if (cleaned.startsWith("84") && !cleaned.startsWith("+")) {
    return "+" + cleaned;
  }

  // If it's just 9 digits (local VN number without leading 0)
  if (/^\d{9}$/.test(cleaned)) {
    return "+84" + cleaned;
  }

  // If already starts with '+84', return as is
  if (cleaned.startsWith("+84")) {
    return cleaned;
  }

  // Default: if no plus and doesn't match above, assume it needs +84
  if (!cleaned.startsWith("+") && cleaned.length >= 9) {
    return "+84" + cleaned;
  }

  return cleaned;
};
