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

## ⚡ Quick Start — Khởi Chạy Nhanh Trong 1 Bước

Bạn chỉ cần mở terminal tại thư mục gốc của dự án và chạy duy nhất lệnh sau để tự động cấu hình các tệp tin `.env` và cài đặt thư viện (`npm install`) cho cả frontend và backend:

```bash
node setup.js
```

Sau khi quá trình cài đặt tự động hoàn tất, bạn thực hiện tiếp:

1. Mở file `backend/.env` và điền `GEMINI_API_KEY` của bạn để sử dụng AI thật.
2. Khởi chạy Backend và Frontend ở 2 terminal riêng biệt:
   * **Terminal 1 (Backend API):**
     ```bash
     cd backend
     npm start
     ```
   * **Terminal 2 (Frontend Client):**
     ```bash
     cd frontend
     npm run dev
     ```
3. Truy cập địa chỉ mặc định **`http://localhost:5173`** 🚀 trên trình duyệt để trải nghiệm ứng dụng!

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

## ⚠️ Quy Tắc Đẩy Code Quan Trọng Cho Đội Ngũ (Git & Deployment Rules)

> [!WARNING]
> Để tránh xung đột mã nguồn và bảo đảm hệ thống deploy tự động chạy ổn định, các lập trình viên cần tuân thủ nghiêm ngặt các quy tắc sau:
>
> 1. **Không push trực tiếp lên nhánh `main`**: 
>    * Mọi thành viên tuyệt đối không đẩy code trực tiếp lên nhánh `main`. 
>    * Hãy tạo nhánh tính năng riêng (ví dụ: `feature/ten-tinh-nang`) và tạo **Pull Request (PR)** để được phê duyệt trước khi gộp vào `main`.
> 2. **Phải đồng bộ cả 2 Remote Repository khi đẩy code**:
>    * Dự án sử dụng 2 remote song song: **Private Repo (`origin`)** trỏ tới Vercel/Render để deploy tự động và **Public Repo (`public_repo`)** để chia sẻ công khai.
>    * Khi push thay đổi lên `main` (sau khi PR được gộp), bạn **bắt buộc** phải chạy lệnh đẩy lên cả 2 remote để tránh làm lệch nhánh và cập nhật thay đổi trực tiếp lên web:
>      ```bash
>      git push origin main
>      git push public_repo main --force
>      ```
> 3. **Tối ưu hóa Token & Gộp Commit (Dành cho AI Agents)**:
>    * Để tiết kiệm tài nguyên và chi phí, AI Agent nên hoàn thành tất cả các chỉnh sửa và cập nhật tài liệu bộ nhớ phiên làm việc (`.agent/workflows/session_memory.md`) trước.
>    * Chỉ thực hiện một lần gộp `git commit` và `git push` duy nhất lên cả 2 remote ở cuối phiên làm việc thay vì chạy commit/push lặp đi lặp lại sau mỗi chỉnh sửa nhỏ.
>

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
│   ├── .env.example             # File cấu hình biến môi trường mẫu của backend
│   └── package.json             # Khai báo thư viện dependencies (Express, Supabase, GenAI)
├── frontend/                    # Giao diện React/Vite (Cổng 5173)
│   ├── .env.example             # File cấu hình biến môi trường mẫu của frontend
│   ├── src/App.jsx              # Quản lý điều phối giao diện, thanh SideNavigation & chuyển Tab
│   ├── src/index.css            # Nền tảng thiết kế màu sắc, phông chữ Inter và bo góc VietInterview AI
│   └── src/components/          # Các phân hệ chức năng giao diện
│       ├── Auth.jsx             # Giao diện Đăng nhập Google & Bộ chọn tài khoản
│       ├── HomeDashboard.jsx    # Màn hình Trang chủ tổng quan chỉ số
│       ├── StartInterview.jsx   # Thiết lập phòng thi & nộp CV
│       ├── InterviewRoom.jsx    # Phòng chat thi phỏng vấn trực tiếp với AI
│       ├── JobsDashboard.jsx    # Giao diện tuyển dụng chia đôi màn hình
│       ├── QuestionBankViewer.jsx # Tra cứu bộ câu hỏi tuyển dụng của các doanh nghiệp
│       ├── Pricing.jsx          # Cổng thanh toán giả lập Sandbox & Bảng giá VIP
│       └── InterviewerDashboard.jsx # Bảng cấu hình quản trị đề thi của phỏng vấn viên
└── setup.js                     # Kịch bản khởi tạo dự án tự động (tạo .env & npm install)
```
