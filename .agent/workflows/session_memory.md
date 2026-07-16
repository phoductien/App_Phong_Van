# BỘ NHỚ PHIÊN PHÁT TRIỂN (SESSION_MEMORY) - CẬP NHẬT: 16/07/2026 14:55

## 1. TIẾN ĐỘ HIỆN TẠI
- **Phase đang chạy**: Phase 5 - Đóng Gói, Deploy & Hướng Dẫn Vận Hành [Đã Hoàn Thành Toàn Bộ]
- **Task đang thực hiện**: Tích hợp cào JD cho nhà tuyển dụng, hoàn thành đồng bộ vai trò đăng nhập & menu điều hướng.

## 2. CẤU TRÚC THƯ MỤC THỰC TẾ ĐÃ TRIỂN KHAI
- `docs/PHASE_1_ARCHITECTURE.md`: Tài liệu cấu trúc hệ thống, port và sơ đồ luồng dữ liệu.
- `docs/PHASE_2_DATABASE_SCHEMA.md`: Định nghĩa bảng, ERD, chính sách RLS và SQL trigger.
- `docs/PHASE_3_UI_COMPONENTS.md`: Đặc tả giao diện Tailwind CSS (Auth, Candidate Dashboard) và Cloudscape UI.
- `docs/PHASE_4_AI_INTEGRATION.md`: Thiết kế thuật toán cào JD, Prompt chấm điểm, anti-derailment và xoay vòng vai trò hội đồng.
- `.agent/skills/save_checkpoint.md`: Kỹ năng lưu trữ mốc checkpoint Git của AI.
- `.agent/rules/PLAN.md`: Cập nhật lộ trình 5 Phase chi tiết của dự án X-Interview.

## 3. CẤU HÌNH & THIẾT LẬP MÔI TRƯỜNG
- **Database**: Mock Local DB hoạt động mặc định trên RAM của server Express; hỗ trợ kết nối PostgreSQL Supabase thông qua biến môi trường.
- **Biến môi trường**: `PORT`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY` (được cấu hình trong tệp `.env` của backend).

## 4. CÁC BUG / VẤN ĐỀ CHƯA GIẢI QUYẾT
- Không có. Tất cả các tài liệu giai đoạn đã được tạo lập thành công và kiểm tra cấu trúc thư mục hợp lệ.
