import { useEffect, useState } from "react";

/**
 * Hook để trì hoãn việc cập nhật giá trị (Debounce)
 * @param value Giá trị cần debounce
 * @param delay Thời gian trễ (ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
