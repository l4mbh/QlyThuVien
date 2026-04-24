import type { Rule, RuleResult } from "../types/rules";


/**
 * Hàm thực thi danh sách các rules theo chuỗi (pipeline).
 * Sẽ dừng lại ở rule đầu tiên trả về kết quả không thành công (ok: false).
 * 
 * @param input Dữ liệu context cần kiểm tra
 * @param rules Mảng các rules thực thi
 * @returns RuleResult
 */
export const runRules = <T>(rules: Rule<T>[], input: T): RuleResult => {
  for (const rule of rules) {
    const result = rule(input);
    if (!result.ok) {
      return result;
    }
  }
  
  return { ok: true };
};

