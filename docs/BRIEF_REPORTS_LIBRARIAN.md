# 💡 BRIEF: Librarian Command Center (Reports V2)

**Ngày tạo:** 2026-04-23
**Brainstorm cùng:** Antigravity & User

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Hệ thống báo cáo hiện tại mang tính kỹ thuật cao, chỉ hiển thị con số snapshot chung chung, không phục vụ trực tiếp cho các tác vụ hàng ngày của thủ thư. Thủ thư cần một công cụ thực tế hơn để vừa quản lý kho vừa vận hành lưu thông sách.

## 2. GIẢI PHÁP ĐỀ XUẤT
Chuyển đổi trang Reports thành **"Librarian Command Center"** chia làm 2 trục chính:
- **Trục Vận hành (Operational):** Trả lời câu hỏi "Hôm nay tôi phải xử lý cái gì?".
- **Trục Quản lý Kho (Collection):** Trả lời câu hỏi "Kho sách của tôi đang ở trạng thái nào?".

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Thủ thư (Librarian):** Người trực tiếp mượn/trả, quản lý kho và đối soát tài chính.
- **Quản lý thư viện (Admin):** Xem báo cáo tổng kết định kỳ.

## 4. TÍNH NĂNG CHI TIẾT

### 🚀 Trục 1: Vận hành (Operational Axis) - MVP
- **[ ] Daily Operations Table:** Danh sách các giao dịch mượn/trả trong ngày hôm nay.
- **[ ] Actionable Overdue List:** Bảng danh sách sách trễ hạn với đầy đủ thông tin liên hệ (Reader name, Phone) và số tiền phạt dự kiến.
- **[ ] Financial Reconciliation Ledger:** Nhật ký thu tiền phạt (Fine) chi tiết theo từng ngày để đối soát tiền mặt.

### 🚀 Trục 2: Quản lý Kho (Collection Axis) - MVP
- **[ ] Inventory Breakdown:** Thống kê chi tiết số lượng sách: Sẵn sàng (Available), Đang mượn (Borrowed), Báo mất (Lost), Đang sửa chữa (Damaged).
- **[ ] Stock Rotation (Health):** Danh sách sách "Best-sellers" (mượn nhiều) và "Dead Stock" (không ai mượn > 6 tháng).
- **[ ] Category Audit Chart:** Phân tích cơ cấu kho theo thể loại (đối soát với kế hoạch mua sắm).

### 🎁 Phase 2 (Nâng cao):
- **[ ] Smart Procurement:** Gợi ý mua sách dựa trên nhu cầu mượn thực tế.
- **[ ] Batch Action Overdue:** Gửi thông báo nhắc trả sách hàng loạt.

## 5. TIÊU CHUẨN UI/UX
- **Table-First:** Sử dụng DataTable cho mọi báo cáo danh sách.
- **Print-Friendly:** Mọi báo cáo đều phải có CSS `@media print` đẹp để in ra giấy A4.
- **Semantic Colors:** Sử dụng mã màu: Đỏ (Quá hạn nặng), Cam (Sắp quá hạn), Xanh (Hoàn thành).

## 6. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** Trung bình (Cần bổ sung một số API aggregates từ Backend).
- **Rủi ro:** Cần đảm bảo performance khi tính toán "Dead Stock" trên tập dữ liệu lớn.

## 7. BƯỚC TIẾP THEO
→ Chạy `/plan` để lên thiết kế chi tiết và chia Phases thực hiện.
