"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const date_helper_1 = require("../../utils/date.helper");
class ReportService {
    async getSummary(role) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalBooks, booksThisMonth, availableBooksAgg, activeBorrows, overdueCount, totalFinesAgg] = await Promise.all([
            db_1.default.book.count({ where: { isArchived: false } }),
            db_1.default.book.count({
                where: {
                    isArchived: false,
                    createdAt: { gte: firstDayOfMonth }
                }
            }),
            db_1.default.book.aggregate({
                where: { isArchived: false },
                _sum: { availableQuantity: true }
            }),
            db_1.default.borrowItem.count({
                where: { status: { in: ['BORROWING', 'OVERDUE'] } }
            }),
            db_1.default.borrowItem.count({
                where: {
                    status: { in: ['BORROWING', 'OVERDUE'] },
                    borrowRecord: { dueDate: { lt: now } }
                }
            }),
            db_1.default.borrowItem.aggregate({
                _sum: { fineAmount: true }
            })
        ]);
        return {
            totalBooks,
            booksDelta: booksThisMonth,
            availableBooks: availableBooksAgg._sum.availableQuantity || 0,
            activeBorrows,
            overdueCount,
            totalFines: role === 'ADMIN' ? (totalFinesAgg._sum.fineAmount || 0) : null
        };
    }
    async getLowStockBooks(threshold = 3) {
        return db_1.default.book.findMany({
            where: {
                isArchived: false,
                availableQuantity: { lt: threshold }
            },
            select: {
                id: true,
                title: true,
                availableQuantity: true,
                totalQuantity: true,
                callNumber: true
            },
            orderBy: { availableQuantity: 'asc' },
            take: 10
        });
    }
    async getBorrowTrends(range = '7d') {
        const days = range === '30d' ? 30 : 7;
        // Using raw query for efficient date truncation in PostgreSQL
        const trends = await db_1.default.$queryRaw `
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
    async getTopBooks(limit = 5) {
        const topBooks = await db_1.default.book.findMany({
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
    async getOverdueItems() {
        const now = new Date();
        const overdueItems = await db_1.default.borrowItem.findMany({
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
            const diffTime = Math.max(0, now.getTime() - dueDate.getTime());
            const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return {
                id: item.id,
                bookTitle: item.book.title,
                readerName: item.borrowRecord.user.name,
                borrowDate: item.borrowedAt.toISOString(),
                dueDate: item.borrowRecord.dueDate.toISOString(),
                daysOverdue
            };
        });
    }
    async getMonthlyReport(yearMonth) {
        const { start, end } = date_helper_1.DateHelper.getMonthRange(yearMonth);
        const [totalBorrows, totalReturns, overdueCases, finesAgg, topBooksRaw] = await Promise.all([
            // 1. Borrows in month
            db_1.default.borrowRecord.count({
                where: { createdAt: { gte: start, lte: end } }
            }),
            // 2. Returns in month
            db_1.default.borrowItem.count({
                where: { returnedAt: { gte: start, lte: end } }
            }),
            // 3. Overdue triggered in month (handled by queryRaw below for accuracy)
            Promise.resolve(0),
            // 4. Fines collected from items returned in this month
            db_1.default.borrowItem.aggregate({
                where: { returnedAt: { gte: start, lte: end }, fineAmount: { gt: 0 } },
                _sum: { fineAmount: true }
            }),
            // 5. Top books borrowed in this month
            db_1.default.book.findMany({
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
        const overdueResult = await db_1.default.$queryRaw `
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
    async getInventoryReport() {
        const [totalBooksAgg, categories] = await Promise.all([
            db_1.default.book.aggregate({
                where: { isArchived: false },
                _sum: { totalQuantity: true, availableQuantity: true }
            }),
            db_1.default.category.findMany({
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
    async getReaderActivityReport() {
        const [topReadersRaw, blockedCount] = await Promise.all([
            db_1.default.user.findMany({
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
            db_1.default.user.count({
                where: { role: 'READER', status: 'BLOCKED' }
            })
        ]);
        // Readers with active overdues
        const riskyReadersRaw = await db_1.default.borrowItem.findMany({
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
    async getFineReport() {
        const [finesAgg] = await Promise.all([
            db_1.default.borrowItem.aggregate({
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
            unpaid: 0 // Placeholder
        };
    }
    // --- LIBRARIAN COMMAND CENTER (V2) METHODS ---
    async getDailyOperations() {
        const { start, end } = date_helper_1.DateHelper.getTodayRange();
        const operations = await db_1.default.borrowItem.findMany({
            where: {
                OR: [
                    { borrowedAt: { gte: start, lte: end } },
                    { returnedAt: { gte: start, lte: end } }
                ]
            },
            include: {
                book: { select: { title: true } },
                borrowRecord: { include: { user: { select: { name: true } } } }
            },
            orderBy: { updatedAt: 'desc' }
        });
        return operations.map(op => ({
            id: op.id,
            type: op.returnedAt && op.returnedAt >= start && op.returnedAt <= end ? 'RETURN' : 'BORROW',
            bookTitle: op.book.title,
            readerName: op.borrowRecord.user.name,
            timestamp: op.returnedAt && op.returnedAt >= start && op.returnedAt <= end ? op.returnedAt : op.borrowedAt
        }));
    }
    async getActionableOverdue() {
        const now = new Date();
        const overdueItems = await db_1.default.borrowItem.findMany({
            where: {
                status: { in: ['BORROWING', 'OVERDUE'] },
                borrowRecord: { dueDate: { lt: now } }
            },
            include: {
                book: { select: { title: true } },
                borrowRecord: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            },
            orderBy: {
                borrowRecord: { dueDate: 'asc' }
            }
        });
        return overdueItems.map(item => {
            const dueDate = new Date(item.borrowRecord.dueDate);
            const diffTime = Math.max(0, now.getTime() - dueDate.getTime());
            const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const estimatedFine = daysOverdue * 5000;
            return {
                borrowItemId: item.id,
                bookTitle: item.book.title,
                readerName: item.borrowRecord.user.name,
                readerPhone: null, // User model does not have a phone field
                dueDate: item.borrowRecord.dueDate,
                daysOverdue,
                estimatedFine
            };
        });
    }
    async getCollectionHealth() {
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        const [totalBooks, booksSummary, deadStockRaw, bestSellersRaw] = await Promise.all([
            db_1.default.book.count({ where: { isArchived: false } }),
            db_1.default.book.aggregate({
                where: { isArchived: false },
                _sum: {
                    totalQuantity: true,
                    availableQuantity: true
                }
            }),
            // Dead stock: books not borrowed in last 6 months
            db_1.default.book.findMany({
                take: 10,
                where: {
                    isArchived: false,
                    borrowItems: {
                        none: {
                            borrowedAt: { gte: sixMonthsAgo }
                        }
                    }
                },
                select: {
                    id: true,
                    title: true,
                    author: true,
                    borrowItems: {
                        select: { borrowedAt: true },
                        orderBy: { borrowedAt: 'desc' },
                        take: 1
                    }
                }
            }),
            // Best sellers: most borrowed books
            db_1.default.book.findMany({
                take: 10,
                where: { isArchived: false },
                select: {
                    id: true,
                    title: true,
                    _count: { select: { borrowItems: true } }
                },
                orderBy: { borrowItems: { _count: 'desc' } }
            })
        ]);
        const totalCopies = booksSummary._sum.totalQuantity || 0;
        const availableCopies = booksSummary._sum.availableQuantity || 0;
        const borrowedCopies = Math.max(0, totalCopies - availableCopies);
        const counts = {
            available: availableCopies,
            borrowed: borrowedCopies,
            lost: 0,
            damaged: 0
        };
        return {
            generatedAt: now,
            totalBooks,
            statusBreakdown: counts,
            deadStock: deadStockRaw.map(b => ({
                id: b.id,
                title: b.title,
                author: b.author,
                lastBorrowedAt: b.borrowItems[0]?.borrowedAt || null
            })),
            bestSellers: bestSellersRaw.map(b => ({
                id: b.id,
                title: b.title,
                borrowCount: b._count.borrowItems
            }))
        };
    }
    async getFinancialLedger() {
        const { start, end } = date_helper_1.DateHelper.getTodayRange();
        const fineEntries = await db_1.default.borrowItem.findMany({
            where: {
                returnedAt: { gte: start, lte: end },
                fineAmount: { gt: 0 }
            },
            include: {
                book: { select: { title: true } },
                borrowRecord: { include: { user: { select: { name: true } } } }
            },
            orderBy: { returnedAt: 'desc' }
        });
        return fineEntries.map(entry => ({
            id: entry.id,
            readerName: entry.borrowRecord.user.name,
            bookTitle: entry.book.title,
            amount: entry.fineAmount || 0,
            date: entry.returnedAt
        }));
    }
}
exports.ReportService = ReportService;
