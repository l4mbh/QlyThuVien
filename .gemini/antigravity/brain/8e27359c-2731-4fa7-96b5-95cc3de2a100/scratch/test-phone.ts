// Logic copy từ packages/shared/src/utils/phone.ts để test nhanh
const normalizePhone = (phone: string): string => {
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

const testCases = [
  { input: '0912345678', expected: '+84912345678' },
  { input: '+84 912 345 678', expected: '+84912345678' },
  { input: '84912345678', expected: '+84912345678' },
  { input: '912345678', expected: '+84912345678' },
  { input: '0 9 1 2 3 4 5 6 7 8', expected: '+84912345678' },
  { input: '(091) 234-5678', expected: '+84912345678' },
];

console.log('🧪 Running Phone Normalization Tests...\n');

let passed = 0;
testCases.forEach(({ input, expected }, index) => {
  const result = normalizePhone(input);
  const status = result === expected ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} [${index + 1}] Input: "${input}" | Expected: "${expected}" | Result: "${result}"`);
  if (result === expected) passed++;
});

console.log(`\n📊 Summary: ${passed}/${testCases.length} tests passed.`);

if (passed === testCases.length) {
  console.log('\n🚀 ALL TESTS PASSED!');
} else {
  console.log('\n⚠️ SOME TESTS FAILED!');
  process.exit(1);
}
