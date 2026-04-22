export interface DashboardSummary {
  totalBooks: number;
  availableBooks: number;
  activeBorrows: number;
  overdueCount: number;
  totalFines: number | null;
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
