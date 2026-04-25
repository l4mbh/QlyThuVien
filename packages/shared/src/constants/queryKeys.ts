/**
 * Centralized Query Keys for React Query
 * Following a hierarchical structure for efficient cache invalidation
 */
export const QUERY_KEYS = {
  BOOKS: {
    ALL: 'books',
    LIST: 'books_list',
    DETAIL: (id: string) => ['books_detail', id],
  },
  CATEGORIES: {
    ALL: 'categories',
    LIST: 'categories_list',
    DETAIL: (id: string) => ['categories_detail', id],
  },
  USERS: {
    ALL: 'users',
    LIST: 'users_list',
    DETAIL: (id: string) => ['users_detail', id],
  },
  PROFILE: {
    DETAIL: 'profile',
  },
  BORROWS: {
    ALL: 'borrows',
    LIST: 'borrows_list',
    DETAIL: (id: string) => ['borrows_detail', id],
    MY: ['borrows_my'],
  },
  NOTIFICATIONS: {
    ALL: 'notifications',
    LIST: 'notifications_list',
  },
  RESERVATIONS: {
    ALL: 'reservations',
    LIST: 'reservations_list',
    MY: ['reservations_my'],
  },
} as const;
