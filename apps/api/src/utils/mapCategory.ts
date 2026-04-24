import categoryMap from '../config/category/categoryMap.json';

export interface CategoryMapItem {
  name: string;
  code: string;
}

export function mapCategory(externalCategory: string | undefined): CategoryMapItem {
  if (!externalCategory) {
    return { name: "Unknown", code: "000" };
  }

  const key = externalCategory.toLowerCase();
  const map = categoryMap as Record<string, CategoryMapItem>;

  for (const term in map) {
    if (key.includes(term)) {
      return map[term];
    }
  }

  return { name: "Unknown", code: "000" };
}

