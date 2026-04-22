export interface DashboardSummary {
  totalBooks: number;
  availableBooks: number;
  activeBorrows: number;
  overdueCount: number;
  totalFines?: number | null;
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
  coverUrl?: string;
}

export interface OverdueDetail {
  borrowItemId: string;
  readerName: string;
  bookTitle: string;
  dueDate: string;
  daysLate: number;
  fineAmount: number;
}
