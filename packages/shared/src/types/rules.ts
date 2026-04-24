/**
 * Định nghĩa chuẩn cho kết quả của một Rule.
 * ok: true - Hợp lệ
 * ok: false - Vi phạm, kèm mã lỗi (string) và thông tin chi tiết (nếu có)
 */
export type RuleResult = 
  | { ok: true } 
  | { ok: false; code: string; details?: any };

/**
 * Định nghĩa một Rule là một hàm nhận vào context T và trả về RuleResult.
 */
export type Rule<T> = (input: T) => RuleResult;


