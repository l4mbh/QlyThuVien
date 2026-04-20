# 🎨 DESIGN: Standardized Generic DataTable & Pagination

Ngày tạo: 2026-04-20
Dựa trên: [BRIEF_TABLE_STANDARD.md](../docs/BRIEF_TABLE_STANDARD.md)

---

## 1. Cấu trúc dữ liệu (Database & API)

### 🚀 Response Pattern
Mọi API danh sách phải trả về cấu trúc:
```typescript
interface ApiResponse<T> {
  data: {
    items: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  };
  code: number;
}
```

### 🚀 Backend Helper: `paginate`
Vị trí: `backend/src/utils/pagination.helper.ts`
Chức năng: Nhận Prisma Model và các options (where, page, limit) để thực hiện `findMany` và `count` trong 1 transaction.

---

## 2. Thiết kế Component (Frontend)

### 🏗️ Generic DataTable<T>
Sử dụng: `@tanstack/react-table`

**Props chính:**
- `columns`: ColumnDef<T>[]
- `fetchData`: (params: QueryParams) => Promise<ApiResponse<T[]>>
- `searchPlaceholder`: string
- `showExport?: boolean` (default: false)
- `showImport?: boolean` (default: false)
- `onDelete?: (id: string) => void`
- `onBulkDelete?: (ids: string[]) => void`

### 🏗️ Pagination Component
Hiển thị: [First] [Prev] [1] [2] [3] [...] [Next] [Last]

---

## 3. Luồng hoạt động (Logic Flow)

1. **Initial Load**: Component gọi `fetchData` với `page=1, limit=10`.
2. **Search**: Sử dụng `useDebounce` hook (500ms). Khi search thay đổi, reset `page=1`.
3. **Pagination**: Khi click trang mới, update state `page` -> Kích hoạt `useEffect` gọi lại `fetchData`.
4. **Selection**: Lưu `rowSelection` state. Nếu `Object.keys(rowSelection).length > 0` -> Hiện thanh `BulkActionToolbar`.

---

## 4. Checklist Kiểm Tra (Acceptance Criteria)

- [ ] API trả về đầy đủ metadata phân trang.
- [ ] DataTable render đúng cột và dữ liệu.
- [ ] Tìm kiếm hoạt động mượt mà với debounce.
- [ ] Chuyển trang load đúng dữ liệu tiếp theo.
- [ ] Chọn nhiều dòng và thực hiện xóa hàng loạt thành công.
- [ ] Nút Export/Import ẩn/hiện linh hoạt qua props.
