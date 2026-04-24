# 💡 BRIEF: System Settings Module (LibMgnt)

**Ngày tạo:** 2026-04-24
**Trạng thái:** Brainstorming Completed

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
- Các Business Rules (Borrow limits, Fines, Notification days) đang bị hardcode trong source code.
- Muốn thay đổi rule phải sửa code, build và deploy lại, gây mất thời gian và rủi ro.
- Thiếu giao diện quản lý tập trung cho Admin để kiểm soát vận hành.

## 2. GIẢI PHÁP ĐỀ XUẤT
Xây dựng module **System Settings** tập trung, cho phép thay đổi cấu hình hệ thống ngay tại runtime thông qua Database và Admin UI.

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Primary:** Super Admin (Quản lý toàn bộ rule).
- **Secondary:** Librarian (Xem và điều chỉnh một số rule vận hành cơ bản).

## 4. TÍNH NĂNG (PHÂN THEO PHASE)

### 🚀 MVP (Phase 1 - Core Settings):
- [ ] Table `system_settings` (key-value pair).
- [ ] Backend Setting Service với In-memory Cache.
- [ ] Enum-based keys cho Type-safety.
- [ ] Thay thế hardcode cho: Borrow Limit, Fine per day, Due soon days.

### 🎁 Phase 2 (Notification Routing):
- [ ] Table `notification_settings` riêng biệt.
- [ ] Cấu hình Role nào nhận loại Notification nào (Enabled/Disabled).
- [ ] Tích hợp vào Notification Service hiện tại.

### 💭 Phase 3 (Advanced):
- [ ] Feature Flags (Bật/tắt tính năng mượn/trả/phạt).
- [ ] Audit Log cho mỗi lần thay đổi settings.
- [ ] Admin UI với các input type phù hợp (Number, Toggle, Select).

## 5. ƯỚC TÍNH KỸ THUẬT
- **Độ phức tạp:** Trung bình (Cần chú ý phần Cache đồng bộ).
- **Rủi ro:** Settings sai có thể làm sai lệch logic tính toán phí phạt (Cần validation chặt).

## 6. BƯỚC TIẾP THEO
→ Chạy `/plan` để thiết kế DB Schema chi tiết và API Contract.
