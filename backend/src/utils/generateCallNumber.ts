import prisma from '../config/db/db';

export async function generateCallNumber(
  author: string,
  publishedYear: number | string,
  categoryCode: string
): Promise<string> {
  const authorCode = author.slice(0, 3).toUpperCase();
  const year = publishedYear || new Date().getFullYear();
  const base = `${categoryCode}.${authorCode}${year}`;

  // Count existing books with same base to create suffix
  const count = await prisma.book.count({
    where: { callNumber: { startsWith: base } },
  });

  const suffix = count > 0 ? String.fromCharCode(65 + count - 1) : '';
  return base + suffix;
}
