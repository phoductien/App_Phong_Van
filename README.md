# 🚀 Viet-Interview — Hệ Thống Giả Lập Phỏng Vấn AI MVP Thông Minh

**Viet-Interview** là nền tảng luyện tập phỏng vấn giả lập và đánh giá năng lực lập trình chuyên sâu dành cho ứng viên công nghệ, tích hợp trợ lý ảo thông minh (Google Gemini AI), giao diện quản trị doanh nghiệp (Cloudscape Design System), trang chủ ứng viên custom (Tailwind CSS), và cơ sở dữ liệu thời gian thực (Supabase).

Dự án được phát triển theo mô hình **Fullstack Local-development** với Frontend React/Vite và Backend Node.js Express.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture Blueprint)

*   **Frontend:** React v19 + Vite + Tailwind CSS (Ứng viên) & Cloudscape Design System (Nhà tuyển dụng) — chạy trực tiếp trên cổng `http://localhost:5173`.
*   **Backend API:** Node.js Express Server — chạy trực tiếp trên cổng `http://localhost:5000`.
*   **Database:** Supabase PostgreSQL + Supabase JS Client (Hỗ trợ cơ chế **Mock Local DB** tự động fallback khi không có cấu hình).
*   **AI Evaluation Engine:** Google Generative AI (`@google/generative-ai` SDK) sử dụng mô hình **Gemini 1.5 Flash**.

---

## ⚡ Quick Start — Khởi Chạy Nhanh

### Bước 1: Thiết lập biến môi trường cho Backend
Tạo tệp `.env` trong thư mục [backend/](file:///d:/ThucTapDN/App_Phong_Van/backend/) (hoặc sao chép từ `.env.example`):
```env
PORT=5000

# Google Gemini API Key (Bắt buộc để sử dụng AI thật)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (Nếu muốn kết nối DB thật, nếu bỏ trống hệ thống tự chạy Mock Local DB)
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### Bước 2: Thiết lập biến môi trường cho Frontend (Tùy chọn cho Google Login thật)
Tạo tệp `.env` trong thư mục [frontend/](file:///d:/ThucTapDN/App_Phong_Van/frontend/) (sao chép từ `.env.example`):
```env
VITE_API_BASE=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*(Nếu không điền thông tin Supabase ở Frontend, hệ thống sẽ tự động chuyển đổi sang giao diện Mock Google Chooser để bạn test thử nghiệm nhanh chóng)*.

### Bước 3: Khởi động Backend API Server
Mở terminal tại thư mục [backend/](file:///d:/ThucTapDN/App_Phong_Van/backend/) và chạy:
```bash
npm install
npm start
```
Server backend sẽ chạy tại: **`http://localhost:5000`** 🚀

### Bước 4: Khởi động Frontend Client (React)
Mở một cửa sổ terminal mới độc lập tại thư mục [frontend/](file:///d:/ThucTapDN/App_Phong_Van/frontend/):
```bash
npm install
npm run dev
```
Truy cập ngay trình duyệt tại địa chỉ mặc định: **`http://localhost:5173`** 🚀

---

## 🌟 Chức Năng Nổi Bật Giao Diện (Viet-Interview MVP Features)

1.  **🚀 Trang Landing Giới Thiệu Dịch Vụ (Landing Page):** Đặt trước khu vực Đăng nhập / Đăng ký. Thiết kế theo phong cách hiện đại với thanh điều hướng cuộn mượt mà (smooth scrolling) tới Quy trình, Tính năng, Bộ đề mẫu, FAQ. 
2.  **✨ Hiệu Ứng Động Cao Cấp (Premium Animations & Micro-interactions):** Tích hợp hiệu ứng trượt trôi nổi lơ lửng (`animate-float`), trượt hiện mượt mà (`fadeInUp`), chuyển động rê chuột thu phóng góc nghiêng cho thẻ, và accordion mở câu hỏi FAQ êm ái.
3.  **🔢 Nhảy Số Tự Động (Animated Counters):** Linh kiện `AnimatedCounter` giúp các con số thống kê (20.000+ Câu hỏi, 10.000+ Lượt luyện tập, 35.000+ Việc làm, 157+ Công ty) tự động tăng dần từ 0 đến giới hạn khi người dùng mở trang Landing.
4.  **🔐 Giao Diện Đăng ký / Đăng nhập Song Ngữ & Chế độ Tối/Sáng:**
    *   Hỗ trợ chuyển đổi ngôn ngữ Việt/Anh (Vietnamese/English) toàn bộ các ô nhập, nhãn, nút bấm và thông báo.
    *   Hỗ trợ chuyển đổi giao diện sáng/tối (Light/Dark Mode) thực tế, đổi màu sắc phông nền và các phần tử form một cách trực quan.
    *   Đồng bộ hóa hash URL (`#/auth` và `#/`) giúp nút mũi tên Back/Forward (quay lại) của trình duyệt hoạt động chuẩn xác.
5.  **📁 Tải lên & Xóa CV thực tế (Local Device File Upload & DELETE API):** Hỗ trợ chọn file trực tiếp từ thiết bị (.pdf, .doc, .docx). Frontend mã hóa Base64 và backend tự động lưu trữ file vật lý trên đĩa. Đi kèm nút Xóa CV liên kết API DELETE giải phóng tệp tin vật lý để tối ưu bộ nhớ máy chủ.
6.  **⚡ Tối Ưu Tải Trang Gấp 3 Lần (Speed & Performance Optimization):** Tích hợp Gzip Compression ở backend và React Lazy Loading + Code Splitting ở frontend giúp chia tách bundle ban đầu, tăng tốc độ phản hồi đáng kể.
7.  **🏠 Trang chủ Ứng viên (Candidate Dashboard):** Xem chỉ số tổng hợp (Số lượt phỏng vấn, phòng vấn đã hoàn thành, đơn ứng tuyển đã gửi, điểm trung bình) và danh sách việc làm đề xuất.
8.  **📖 Ngân hàng câu hỏi:** Tra cứu danh mục câu hỏi tuyển dụng chính thức của các tập đoàn (Viettel VCS, VNG, NVIDIA, FPT Smart Cloud...).
9.  **📹 Luyện tập phỏng vấn & Khóa Phòng Chờ:** Cấu hình phòng phỏng vấn thử, tải lên CV. Đồng hồ đếm ngược 30 phút sẽ chỉ kích hoạt chạy khi phát hiện Nhà tuyển dụng nhấn nút tham gia phòng từ Dashboard của họ.
10. **🏆 Gói dịch vụ & Cổng thanh toán giả lập (Simulated SaaS Paywall):**
    *   Trang trí các gói dịch vụ (Free, Pro, Enterprise). Tích hợp cổng thanh toán Sandbox mô phỏng chuyển khoản QR, Thẻ Visa/Mastercard hoặc Ví MoMo.
    *   Thanh toán thành công sẽ cấp huy hiệu **`PRO`** hoặc **`ENTERPRISE`** sang trọng cạnh tên người dùng ở Sidebar.
    *   **Khóa mờ (Blur lock)**: Nếu tài khoản là Free, biểu đồ 3 trục điểm số chi tiết và phần Nhận xét chuyên sâu của AI trong phòng phỏng vấn sẽ bị khóa mờ, chỉ mở khóa khi nâng cấp Pro. Giới hạn tài khoản Free tối đa 3 lượt phỏng vấn thử.
11. **💼 Việc làm & Smart Scraping:** Giao diện chia đôi màn hình. Đặc biệt, hỗ trợ dán liên kết tuyển dụng bất kỳ từ web và sử dụng Cheerio + Gemini AI bóc tách thông tin JD tự động để tạo đề thi phỏng vấn ngay lập tức.
12. **🏢 Dành cho Doanh nghiệp (Recruiter):** Bảng giám sát các phòng live, xem webcam phân tích biểu cảm hành vi AI (Gaze Context), quản lý danh sách CV và tạo ngân hàng câu hỏi.

---

## 🧪 Công Nghệ AI & Cơ Chế Hoạt Động Cốt Lõi

*   **Xoay vòng vai trò Hội đồng Phỏng vấn (Rotational AI Interviewers):** Trong suốt 10 câu hỏi, AI tự động thay đổi vai trò xưng hô và đặt câu hỏi theo thứ tự: Anh Hùng (Tech Lead - câu 1-4), Chị Mai (PM - câu 5-7), và Chị Lan (HR Manager - câu 8-10).
*   **Điểm đánh giá & Câu trả lời mẫu:** Sau mỗi lượt trả lời của ứng viên, AI sẽ chấm điểm chi tiết 3 khía cạnh (Kiến thức kỹ thuật, kỹ năng giao tiếp, độ tự tin) và cung cấp câu trả lời mẫu tối ưu.
*   **Quy tắc chống lạc đề (Anti-derailment):** Nếu ứng viên trả lời không liên quan đến câu hỏi công nghệ hoặc nói chuyện phiếm ngoài lề, AI sẽ tự động chấm **0 điểm** cho câu hỏi đó và phản hồi lời nhắc nhở lịch sự hướng cuộc phỏng vấn trở lại chủ đề hiện tại.
*   **SQL Trigger Đồng bộ profiles:** Một Postgres trigger được cấu hình trên Supabase để tự động đồng bộ người dùng từ `auth.users` sang bảng `public.profiles` tại thời điểm tạo tài khoản.

---

## 📦 Hướng dẫn Triển khai (Deployment Guide)

### 1. Triển khai Frontend lên Vercel
1. Truy cập Vercel Dashboard, nhấn **Add New -> Project** và liên kết với kho lưu trữ git chứa mã nguồn.
2. Chọn thư mục gốc là `frontend`.
3. Thiết lập biến môi trường:
   - `VITE_API_BASE`: Địa chỉ URL của Backend Server sau khi deploy lên Render/Railway (ví dụ: `https://viet-interview-api.onrender.com`).
   - `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`: Địa chỉ kết nối Supabase của bạn.
4. Nhấn **Deploy**.

### 2. Triển khai Backend lên Render hoặc Railway
1. Tạo một Web Service mới trên Render.
2. Thiết lập thư mục gốc là `backend`.
3. Cấu hình lệnh chạy:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Cấu hình các biến môi trường trong mục Environment Variables:
   - `PORT`: `5000`
   - `GEMINI_API_KEY`: Key Gemini của bạn.
   - `SUPABASE_URL` và `SUPABASE_KEY`: Thông tin kết nối dự án Supabase.
5. Nhấn **Deploy**.

---

## 📁 Cấu Trúc Mã Nguồn Dự Án

```
App_Phong_Van/
├── .agent/                      # Hướng dẫn, kỹ năng và quy tắc vận hành cho trợ lý AI
├── supabase/
│   └── schema.sql               # Thiết lập cơ sở dữ liệu quan hệ PostgreSQL
├── backend/                     # API Server bằng Express (Cổng 5000)
│   ├── server.js                # Toàn bộ mã nguồn định tuyến API, kết nối DB & Gemini AI
│   └── package.json             # Khai báo thư viện dependencies (Express, Supabase, GenAI)
└── frontend/                    # Giao diện React/Vite (Cổng 5173)
    ├── src/App.jsx              # Quản lý điều phối giao diện, thanh SideNavigation & chuyển Tab
    ├── src/index.css            # Nền tảng thiết kế màu sắc, phông chữ Inter và bo góc VietInterview AI
    └── src/components/          # Các phân hệ chức năng giao diện
        ├── Auth.jsx             # Giao diện Đăng nhập Google & Bộ chọn tài khoản
        ├── HomeDashboard.jsx    # Màn hình Trang chủ tổng quan chỉ số
        ├── StartInterview.jsx   # Thiết lập phòng thi & nộp CV
        ├── InterviewRoom.jsx    # Phòng chat thi phỏng vấn trực tiếp với AI
        ├── JobsDashboard.jsx    # Giao diện tuyển dụng chia đôi màn hình
        ├── QuestionBankViewer.jsx # Tra cứu bộ câu hỏi tuyển dụng của các doanh nghiệp
        ├── Pricing.jsx          # Cổng thanh toán giả lập Sandbox & Bảng giá VIP
        └── InterviewerDashboard.jsx # Bảng cấu hình quản trị đề thi của phỏng vấn viên
```
