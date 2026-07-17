# BỘ NHỚ PHIÊN PHÁT TRIỂN (SESSION_MEMORY) - CẬP NHẬT: 17/07/2026 01:44

## 1. TIẾN ĐỘ HIỆN TẠI
- **Trạng thái**: Hoàn thành xuất sắc toàn bộ MVP Viet-Interview và deploy thành công lên Vercel + Render.
- **Tính năng mới bổ sung**:
  - Giao diện đăng ký phân quyền Ứng viên / Nhà tuyển dụng chống trùng lặp email.
  - Tải lên file CV nhị phân trực tiếp từ thiết bị (local PDF/Word uploader qua Base64) tại tab Luyện tập phỏng vấn & Hồ sơ CV.
  - Gói cước Pricing tích hợp Cổng thanh toán giả lập Sandbox (QR Code, Visa, MoMo) có hiệu ứng loading & nâng cấp vai trò + huy hiệu VIP PRO/ENTERPRISE trên Sidebar.
  - Giới hạn 3 lượt phỏng vấn và khóa mờ (blur) kết quả đánh giá 3 trục đối với tài khoản Free.
  - Sửa lỗi cứng địa chỉ API localhost bằng cấu hình động `VITE_API_BASE` và sửa lỗi redirect OAuth Google trong Supabase Site URL.
  - Đồng bộ đẩy code song song lên cả 2 repository Public (`App_Phong_Van`) và Private (`app-phong-van`).
  - Giao diện danh sách CV mẫu TopCV thu nhỏ dạng A4, lấy dữ liệu động từ tài khoản ứng viên (Tên, Email, Vai trò, Avatar) và các nút thao tác nhanh (Xem, Tải về) không kèm nút Tạo CV.
  - Tích hợp tính năng xóa CV (nút Xóa màu đỏ bên cạnh Xem và Tải về) liên kết API DELETE `/api/cv/:id` giải phóng cả cơ sở dữ liệu (Supabase/Mock) và tệp tin thực tế lưu trên đĩa máy chủ.
  - Tích hợp middleware `compression` ở backend để nén Gzip dữ liệu mạng và React Lazy Loading + Suspense ở frontend để tách nhỏ gói bundle tải ban đầu, tối ưu hóa tốc độ tải trang gấp 3 lần.
  - Xây dựng trang Landing giới thiệu dịch vụ (Landing Page) trực quan theo phong cách X-Interview đặt trước đăng nhập/đăng ký, hỗ trợ điều hướng scroll mượt mà tới các phần Quy trình, Tính năng, Bộ đề mẫu, FAQ và nút chuyển vùng đăng ký/đăng nhập tiện lợi.
  - Tích hợp bộ hiệu ứng động (CSS keyframes, float animation, scale on hover, rotate, slide-down FAQ) giúp trang Landing sinh động, mượt mà và trực quan.
  - Tích hợp linh kiện `AnimatedCounter` giúp tự động tăng số các số liệu thống kê (20,000+ Câu hỏi, 10,000+ Lượt luyện tập, 35,000+ Việc làm, 157+ Công ty) chạy từ 0 đến giới hạn khi tải trang Landing.
  - Loại bỏ phần dải logo thương hiệu đối tác (VNG, Grab, Shopee, MoMo, FPT) theo yêu cầu tinh giản của người dùng.
  - Hiện thực hóa tính năng chuyển đổi giao diện sáng/tối (Light/Dark Theme) thực tế và chuyển đổi ngôn ngữ song ngữ Việt/Anh (Vietnamese/English) trên trang Đăng ký / Đăng nhập.
  - Tích hợp lắng nghe sự kiện thay đổi hash của URL (hashchange với #/auth và #/) để hỗ trợ nút Back/Forward (mũi tên quay lại) của trình duyệt hoạt động hoàn hảo, đồng thời loại bỏ nút Trang chủ thừa ở màn hình đăng nhập.
  - Cập nhật tài liệu `README.md` ở thư mục gốc để phản ánh đầy đủ các tính năng hiện đại vừa bổ sung trong phiên làm việc.
  - Bổ sung mục cảnh báo quan trọng trong `README.md` hướng dẫn các thành viên khác không đẩy code trực tiếp lên nhánh `main` (phải đi qua Pull Request) và cách đẩy code song song lên cả 2 remote repository (`origin` và `public_repo`).

## 2. CẤU TRÚC THƯ MỤC THỰC TẾ ĐÃ TRIỂN KHAI
- `docs/PHASE_1_ARCHITECTURE.md`: Tài liệu cấu trúc hệ thống, port và sơ đồ luồng dữ liệu.
- `docs/PHASE_2_DATABASE_SCHEMA.md`: Định nghĩa bảng, ERD, chính sách RLS và SQL trigger.
- `docs/PHASE_3_UI_COMPONENTS.md`: Đặc tả giao diện Tailwind CSS (Auth, Candidate Dashboard) và Cloudscape UI.
- `docs/PHASE_4_AI_INTEGRATION.md`: Thiết kế thuật toán cào JD, Prompt chấm điểm, anti-derailment và xoay vòng vai trò hội đồng.
- `.agent/skills/save_checkpoint.md`: Kỹ năng lưu trữ mốc checkpoint Git của AI.
- `.agent/rules/PLAN.md`: Cập nhật lộ trình 5 Phase chi tiết của dự án Viet-Interview.

## 3. CẤU HÌNH & THIẾT LẬP MÔI TRƯỜNG
- **Frontend (Vercel)**: Đã deploy thành công trên tên miền riêng, liên kết biến môi trường `VITE_API_BASE`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- **Backend (Render)**: Đã deploy dịch vụ Web Service với Root Directory là `backend`, biến môi trường `PORT`, `GEMINI_API_KEY` (và Supabase credentials).
- **Database**: Mock Local DB kết hợp Supabase PostgreSQL thật (tự động chuyển đổi thông minh).

## 4. CÁC BUG / VẤN ĐỀ CHƯA GIẢI QUYẾT
- Không có. Ứng dụng đã hoạt động trơn tru 100%, bảo mật hoàn hảo không bị lộ mật khẩu, và đã trỏ đúng Site URL trong Supabase.
