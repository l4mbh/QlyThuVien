import prisma from "../../config/db/db";
import { 
  DashboardSummary, 
  BorrowTrend, 
  TopBook, 
  OverdueDetail,
  MonthlyReport,
  InventoryReport,
  ReaderActivityReport,
  FineReport
} from "../../types/report/report.entity";
import { DateHelper } from "../../utils/date.helper";

export class ReportService {
  async getSummary(role: string): Promise<DashboardSummary> {
    const now = new Date();

    const [
      totalBooks,
      availableBooksAgg,
      activeBorrows,
      overdueCount,
      totalFinesAgg
    ] = await Promise.all([
      prisma.book.count({ where: { isArchived: false } }),
      prisma.book.aggregate({
        where: { isArchived: false },
        _sum: { availableQuantity: true }
      }),
      prisma.borrowItem.count({
        where: { status: { in: ['BORROWING', 'OVERDUE'] } }
      }),
      prisma.borrowItem.count({
        where: {
          status: { in: ['BORROWING', 'OVERDUE'] },
          borrowRecord: { dueDate: { lt: now } }
        }
      }),
      prisma.borrowItem.aggregate({
        _sum: { fineAmount: true }
      })
    ]);

    return {
      totalBooks,
      availableBooks: availableBooksAgg._sum.availableQuantity || 0,
      activeBorrows,
      overdueCount,
      totalFines: role === 'ADMIN' ? (totalFinesAgg._sum.fineAmount || 0) : null
    };
  }

  async getBorrowTrends(range: string = '7d'): Promise<BorrowTrend[]> {
    const days = range === '30d' ? 30 : 7;
    
    // Using raw query for efficient date truncation in PostgreSQL
    const trends: any[] = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(DATE_TRUNC('day', "borrowedAt"), 'YYYY-MM-DD') as date,
        COUNT(*)::int as count
      FROM "borrow_items"
      WHERE "borrowedAt" >= CURRENT_DATE - ${days} * INTERVAL '1 day'
      GROUP BY DATE_TRUNC('day', "borrowedAt")
      ORDER BY date ASC
    `;

    return trends;
  }

  async getTopBooks(limit: number = 5): Promise<TopBook[]> {
    const topBooks = await prisma.book.findMany({
      take: limit,
      where: { isArchived: false },
      select: {
        id: true,
        title: true,
        author: true,
        coverUrl: true,
        _count: {
          select: { borrowItems: true }
        }
      },
      orderBy: {
        borrowItems: {
          _count: 'desc'
        }
      }
    });

    return topBooks.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl || undefined,
      borrowCount: book._count.borrowItems
    }));
  }

  async getOverdueItems(): Promise<OverdueDetail[]> {
    const now = new Date();
    const overdueItems = await prisma.borrowItem.findMany({
      take: 5,
      where: {
        status: { in: ['BORROWING', 'OVERDUE'] },
        borrowRecord: { dueDate: { lt: now } }
      },
      include: {
        book: { select: { title: true } },
        borrowRecord: { 
          include: { 
            user: { select: { name: true } }
          } 
        }
      },
      orderBy: {
        borrowRecord: { dueDate: 'asc' }
      }
    });

    return overdueItems.map(item => {
      const dueDate = new Date(item.borrowRecord.dueDate);
      const diffTime = Math.abs(now.getTime() - dueDate.getTime());
      const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        borrowItemId: item.id,
        readerName: item.borrowRecord.user.name,
        bookTitle: item.book.title,
        dueDate: item.borrowRecord.dueDate.toISOString(),
        daysLate,
        fineAmount: item.fineAmount || 0
      };
    });
  }

  async getMonthlyReport(yearMonth: string): Promise<MonthlyReport> {
    const { start, end } = DateHelper.getMonthRange(yearMonth);
    
    const [
      totalBorrows,
      totalReturns,
      overdueCases,
      finesAgg,
      topBooksRaw
    ] = await Promise.all([
      // 1. Borrows in month
      prisma.borrowRecord.count({
        where: { createdAt: { gte: start, lte: end } }
      }),
      // 2. Returns in month
      prisma.borrowItem.count({
        where: { returnedAt: { gte: start, lte: end } }
      }),
      // 3. Overdue triggered in month (handled by queryRaw below for accuracy)
      Promise.resolve(0),
      // 4. Fines collected from items returned in this month
      prisma.borrowItem.aggregate({
        where: { returnedAt: { gte: start, lte: end }, fineAmount: { gt: 0 } },
        _sum: { fineAmount: true }
      }),
      // 5. Top books borrowed in this month
      prisma.book.findMany({
        take: 5,
        select: {
          id: true,
          title: true,
          author: true,
          _count: {
            select: {
              borrowItems: {
                where: { borrowedAt: { gte: start, lte: end } }
              }
            }
          }
        },
        orderBy: {
          borrowItems: {
            _count: 'desc'
          }
        }
      })
    ]);

    // Prisma doesn't easily support cross-field comparison in 'where' for all versions
    // For overdue triggered in month, we might need a slightly different approach or raw query
    // But let's refine the logic: Overdue triggered in month means dueDate is in this month 
    // and (it is currently overdue OR it was returned late).
    
    // Recalculating overdueCases with 100% accurate raw SQL as requested
    const overdueResult: any[] = await prisma.$queryRaw`
      SELECT COUNT(*)::int as count
      FROM "borrow_items" bi
      JOIN "borrow_records" br ON bi."borrowRecordId" = br."id"
      WHERE br."dueDate" >= ${start} AND br."dueDate" <= ${end}
      AND (bi."returnedAt" IS NULL OR bi."returnedAt" > br."dueDate")
    `;
    const overdueTriggered = overdueResult[0]?.count || 0;

    const returnRate = totalBorrows > 0 ? (totalReturns / totalBorrows) : 0;
    const overdueRate = totalBorrows > 0 ? (overdueTriggered / totalBorrows) : 0;

    return {
      period: yearMonth,
      generatedAt: new Date(),
      summary: {
        totalBorrows,
        totalReturns,
        returnRate: Number(returnRate.toFixed(2)),
        overdueCases: overdueTriggered,
        overdueRate: Number(overdueRate.toFixed(2)),
        totalFinesCollected: finesAgg._sum.fineAmount || 0
      },
      topBooks: topBooksRaw.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        borrowCount: b._count.borrowItems
      }))
    };
  }

  async getInventoryReport(): Promise<InventoryReport> {
    const [totalBooksAgg, categories] = await Promise.all([
      prisma.book.aggregate({
        where: { isArchived: false },
        _sum: { totalQuantity: true, availableQuantity: true }
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { books: { where: { isArchived: false } } }
          }
        }
      })
    ]);

    const total = totalBooksAgg._sum.totalQuantity || 0;
    const available = totalBooksAgg._sum.availableQuantity || 0;

    return {
      generatedAt: new Date(),
      totalBooks: total,
      available: available,
      borrowed: total - available,
      byCategory: categories.map(c => ({
        categoryId: c.id,
        categoryName: c.name,
        count: c._count.books
      }))
    };
  }

  async getReaderActivityReport(): Promise<ReaderActivityReport> {
    const [topReadersRaw, blockedCount] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        where: { role: 'READER' },
        select: {
          id: true,
          name: true,
          email: true,
          _count: { select: { borrowRecords: true } }
        },
        orderBy: { borrowRecords: { _count: 'desc' } }
      }),
      prisma.user.count({
        where: { role: 'READER', status: 'BLOCKED' }
      })
    ]);

    // Readers with active overdues
    const riskyReadersRaw = await prisma.borrowItem.findMany({
      where: { status: 'OVERDUE' },
      select: {
        borrowRecord: {
          select: {
            user: {
              select: { id: true, name: true }
            },
            dueDate: true
          }
        }
      }
    });

    // Group and format risky readers
    const riskyMap = new Map();
    riskyReadersRaw.forEach(r => {
      const u = r.borrowRecord.user;
      if (!riskyMap.has(u.id)) {
        riskyMap.set(u.id, { id: u.id, name: u.name, overdueCount: 0, lastOverdueAt: r.borrowRecord.dueDate });
      }
      const entry = riskyMap.get(u.id);
      entry.overdueCount++;
      if (new Date(r.borrowRecord.dueDate) > new Date(entry.lastOverdueAt)) {
        entry.lastOverdueAt = r.borrowRecord.dueDate;
      }
    });

    return {
      generatedAt: new Date(),
      topReaders: topReadersRaw.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        borrowCount: r._count.borrowRecords
      })),
      riskyReaders: Array.from(riskyMap.values()),
      nearLimitReaders: [], // Future: logic for readers close to max books
      blockedReadersCount: blockedCount
    };
  }

  async getFineReport(): Promise<FineReport> {
    const [finesAgg] = await Promise.all([
      prisma.borrowItem.aggregate({
        _sum: { fineAmount: true }
      })
    ]);

    // Simplified for MVP: all recorded fineAmount in items is "total".
    // In a real system, we'd check payment status.
    const total = finesAgg._sum.fineAmount || 0;

    return {
      generatedAt: new Date(),
      totalFines: total,
      paid: total, // Placeholder
      unpaid: 0    // Placeholder
    };
  }
}
