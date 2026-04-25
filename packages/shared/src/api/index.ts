import { AxiosInstance } from 'axios';

export const createBookApi = (api: AxiosInstance) => ({
  list: (params?: any) => api.get('/books', { params }).then((res: any) => res.data),
  get: (id: string) => api.get(`/books/${id}`).then((res: any) => res.data),
  create: (data: any) => api.post('/books', data).then((res: any) => res.data),
  update: (id: string, data: any) => api.patch(`/books/${id}`, data).then((res: any) => res.data),
  delete: (id: string) => api.delete(`/books/${id}`).then((res: any) => res.data),
  bulkDelete: (ids: string[]) => api.delete('/books/bulk', { data: { ids } }).then((res: any) => res.data),
  fetchISBN: (isbn: string) => api.get(`/books/fetch-isbn/${isbn}`).then((res: any) => res.data),
  adjustInventory: (id: string, data: any) => api.post(`/books/${id}/inventory-adjustments`, data).then((res: any) => res.data),
  getInventoryLogs: (id: string) => api.get(`/books/${id}/inventory-logs`).then((res: any) => res.data),
});

export const createCategoryApi = (api: AxiosInstance) => ({
  list: (params?: any) => api.get('/categories', { params }).then((res: any) => res.data),
  get: (id: string) => api.get(`/categories/${id}`).then((res: any) => res.data),
  create: (data: any) => api.post('/categories', data).then((res: any) => res.data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data).then((res: any) => res.data),
  delete: (id: string) => api.delete(`/categories/${id}`).then((res: any) => res.data),
});

export const createBorrowApi = (api: AxiosInstance) => ({
  list: (params?: any) => api.get('/borrows', { params }).then((res: any) => res.data),
  getMyBorrowed: () => api.get('/borrows/my').then((res: any) => res.data),
  borrow: (data: { bookId: string; readerId: string }) => api.post('/borrows', data).then((res: any) => res.data),
  return: (id: string) => api.post(`/borrows/${id}/return`).then((res: any) => res.data),
});

export const createNotificationApi = (api: AxiosInstance) => ({
  getAll: (params?: any) => api.get('/notifications', { params }).then((res: any) => res.data),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`).then((res: any) => res.data),
  markAllAsRead: () => api.post('/notifications/mark-all-read').then((res: any) => res.data),
});
