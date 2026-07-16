# Lộ Trình Phát Triển X-Interview (PLAN.md)

Tài liệu này vạch ra các giai đoạn phát triển và tích hợp của Nền tảng Phỏng vấn thông minh X-Interview.

## Các Giai Đoạn Phát Triển

### Phase 1: Thiết Kế Kiến Trúc & Tạo Tài Liệu Kỹ Thuật [Đã hoàn thành Docs]
*   [x] Khởi tạo các tài liệu kỹ thuật cốt lõi: `docs/PHASE_1_ARCHITECTURE.md`, `docs/PHASE_2_DATABASE_SCHEMA.md`, `docs/PHASE_3_UI_COMPONENTS.md`, `docs/PHASE_4_AI_INTEGRATION.md`.
*   [ ] Thiết lập cấu hình `.agent/skills/save_checkpoint.md` quản lý mã nguồn.

### Phase 2: Thiết Kế Cơ Sở Dữ Liệu & Cấu Hình Bảo Mật (Supabase & RLS) [Đã hoàn thành]
*   [x] Cập nhật bảng cơ sở dữ liệu Supabase, thêm Postgres Triggers tự động đồng bộ profiles từ `auth.users`.
*   [x] Cấu hình chi tiết các chính sách Row Level Security (RLS) bảo vệ thông tin ứng viên và đề thi doanh nghiệp.

### Phase 3: Phát Triển Dashboard Vai Trò & Trang Đăng Nhập Custom (Tailwind CSS)
*   [ ] Dựng trang Đăng ký / Đăng nhập hoàn toàn bằng Tailwind CSS thuần (hỗ trợ ẩn/hiện mật khẩu, chọn vai trò).
*   [ ] Phát triển Dashboard Ứng viên (Candidate) hiển thị 4 stats cards, Banner lớn, bộ lọc tìm kiếm và bảng việc làm gợi ý.
*   [ ] Hoàn thiện Dashboard Nhà tuyển dụng (Recruiter) dạng Tab chứa bảng theo dõi phòng live, quản lý CV vault, xem webcam phân tích biểu cảm.
*   [ ] Bổ sung các trang bổ trợ: Pricing (Gói dịch vụ), Blog (Tin tức).

### Phase 4: AI Engine, Tính năng Smart Scraping & Phòng Phỏng Vấn (Role Rotation)
*   [ ] Xây dựng API `/api/crawl-jd` tải và bóc tách tự động link tuyển dụng thực tế bằng Cheerio & Gemini.
*   [ ] Xây dựng phòng phỏng vấn Tailwind CSS chat bubble, hỗ trợ đếm giờ và polling kích hoạt mở khóa phòng thi từ HR.
*   [ ] Tích hợp API `/api/interview/chat` chấm điểm tự động, chống trả lời lạc đề (anti-derailment) và xoay vòng vai trò hội đồng phỏng vấn (Tech Lead, HR, PM).

### Phase 5: Đóng Gói, Deploy & Hướng Dẫn Vận Hành
*   [ ] Kiểm tra biên dịch sản phẩm (`npm run build`).
*   [ ] Cập nhật tệp hướng dẫn vận hành hệ thống `README.md`.
*   [ ] Triển khai ứng dụng lên nền tảng cloud Vercel & Render.

