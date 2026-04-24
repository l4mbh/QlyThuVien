export interface DashboardSummary {
  totalBooks: number;
  booksDelta?: number; // Change in total books this month
  availableBooks: number;
  activeBorrows: number;
  overdueCount: number;
  totalFines: number | null;
  unpaidFines?: number; // Optional for admin insights
}

export interface LowStockBook {
  id: string;
  title: string;
  availableQuantity: number;
  totalQuantity: number;
  callNumber: string | null;
}

export interface BorrowTrend {
  date: string;
  count: number;
}

export interface TopBook {
  id: string;
  title: string;
  author: string;
  borrowCount: number;
}

export interface OverdueDetail {
  id: string;
  bookTitle: string;
  readerName: string;
  borrowDate: string;
  dueDate: string;
  daysOverdue: number;
}

// --- NEW REPORT TYPES ---

export interface MonthlyReport {
  period: string; // YYYY-MM
  generatedAt: Date;
  summary: {
    totalBorrows: number;
    totalReturns: number;
    returnRate: number;
    overdueCases: number;
    overdueRate: number;
    totalFinesCollected: number;
  };
  topBooks: TopBook[];
}

export interface InventoryReport {
  generatedAt: Date;
  totalBooks: number;
  available: number;
  borrowed: number;
  byCategory: {
    categoryId: string;
    categoryName: string;
    count: number;
  }[];
}

export interface ReaderActivityReport {
  generatedAt: Date;
  topReaders: {
    id: string;
    name: string;
    email: string;
    borrowCount: number;
  }[];
  riskyReaders: {
    id: string;
    name: string;
    overdueCount: number;
    lastOverdueAt: Date;
  }[];
  nearLimitReaders: {
    id: string;
    name: string;
    currentBorrows: number;
  }[];
  blockedReadersCount: number;
}

export interface FineReport {
  generatedAt: Date;
  totalFines: number;
  paid: number;
  unpaid: number;
}

// --- LIBRARIAN COMMAND CENTER (V2) ---

export interface DailyOperation {
  id: string;
  type: 'BORROW' | 'RETURN';
  bookTitle: string;
  readerName: string;
  timestamp: Date;
}

export interface ActionableOverdue {
  borrowItemId: string;
  bookTitle: string;
  readerName: string;
  readerPhone: string | null;
  dueDate: Date;
  daysOverdue: number;
  estimatedFine: number;
}

export interface CollectionHealth {
  generatedAt: Date;
  totalBooks: number;
  statusBreakdown: {
    available: number;
    borrowed: number;
    lost: number;
    damaged: number;
  };
  deadStock: {
    id: string;
    title: string;
    author: string;
    lastBorrowedAt: Date | null;
  }[];
  bestSellers: {
    id: string;
    title: string;
    borrowCount: number;
  }[];
}

export interface FinancialLedgerEntry {
  id: string;
  readerName: string;
  bookTitle: string;
  amount: number;
  date: Date;
}

