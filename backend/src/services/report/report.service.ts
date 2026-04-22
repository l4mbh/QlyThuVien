import prisma from "../../config/db/db";
import { DashboardSummary, BorrowTrend, TopBook, OverdueDetail } from "../../types/report/report.entity";

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
}
