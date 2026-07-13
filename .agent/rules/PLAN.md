# Lộ Trình Phát Triển (PLAN.md)

Tài liệu này vạch ra các giai đoạn phát triển và tích hợp của Nền tảng Phỏng vấn thông minh.

## Các Giai Đoạn Phát Triển

### Giai Đoạn 1: Thiết Lập Môi Trường & Cơ Sở Dữ Liệu
*   [ ] Thiết lập cơ sở dữ liệu Supabase với các bảng: `profiles`, `cv_vault`, `companies`, `question_banks`, `interview_sessions`.
*   [ ] Thiết lập cấu hình `.agent/` để dẫn dắt AI hoạt động đúng nghiệp vụ.

### Giai Đoạn 2: Xây Dựng API Backend (Node.js/Express)
*   [ ] Kết nối Supabase bằng `@supabase/supabase-client`.
*   [ ] Viết API quản lý CV ứng viên: Tải lên, truy xuất danh sách CV đã lưu.
*   [ ] Viết API quản lý bộ đề câu hỏi: Lưu trữ, truy vấn câu hỏi theo Công ty/Cấp độ.
*   [ ] Viết API quản lý phiên phỏng vấn: Khởi tạo phiên, lưu lịch sử, cập nhật chỉ số câu hỏi hiện tại.

### Giai Đoạn 3: Phát Triển Giao Diện (React + Cloudscape Design)
*   [ ] Tích hợp Cloudscape Design cho Layout, Form và container chính.
*   [ ] Tạo màn hình **Bắt đầu phỏng vấn**: Chọn CV từ hồ sơ, Chọn Công ty & Vị trí mục tiêu.
*   [ ] Tạo màn hình **Phòng phỏng vấn (Interview Room)**: Giao diện Chatbot tương tác thời gian thực, hiển thị tiến trình (câu hỏi X/10).

### Giai Đoạn 4: Trí Tuệ Nhân Tạo & Điều Phối
*   [ ] Tích hợp prompt mẫu cho AI để chấm điểm, nhận xét câu trả lời của ứng viên từng câu.
*   [ ] Xử lý CV tự động (CV Parsing) để gợi ý công ty/lĩnh vực phù hợp.

### Giai Đoạn 5: Triển Khai & Kiểm Thử
*   [ ] Đưa ứng dụng lên Vercel (Monorepo setup hoặc Serverless functions).
*   [ ] Kiểm thử toàn trình (E2E Test) từ bước đăng nhập, tạo đề, phỏng vấn đến xem báo cáo chấm điểm.
