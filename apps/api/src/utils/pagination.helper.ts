import { PaginatedData } from "@qltv/shared";

/**
 * Helper vạn năng để phân trang cho Prisma Models
 * @param model Prisma Model Delegate (vd: prisma.category)
 * @param args Các tham số findMany (where, include, orderBy...)
 * @param pagination Object chứa page và limit
 */
export async function paginate<T>(
  model: any,
  args: any = {},
  pagination: { page: number; limit: number }
): Promise<PaginatedData<T>> {
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const skip = (safePage - 1) * safeLimit;

  const [total, items] = await Promise.all([
    model.count({ where: args.where }),
    model.findMany({
      ...args,
      skip,
      take: safeLimit,
    }),
  ]);

  return {
    items,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

