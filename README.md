# 🚀 VietInterview AI — Hệ Thống Giả Lập Phỏng Vấn AI Thông Minh

**VietInterview AI** là nền tảng luyện tập phỏng vấn và đánh giá năng lực lập trình chuyên sâu dành cho ứng viên công nghệ, tích hợp trợ lý ảo thông minh (Google Gemini AI), giao diện đám mây cấp doanh nghiệp (Cloudscape Design System), và cơ sở dữ liệu thời gian thực (Supabase).

Dự án được tối ưu hóa theo mô hình **Fullstack Local-development** nhanh với Frontend React/Vite và Backend Node.js Express.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture Blueprint)

*   **Frontend:** React v18 + Vite + Cloudscape Design System (AWS UI) — chạy trực tiếp trên cổng `http://localhost:5173`.
*   **Backend API:** Node.js Express Server — chạy trực tiếp trên cổng `http://localhost:5000`.
*   **Database:** Supabase PostgreSQL + Supabase JS Client (Hỗ trợ cơ chế **Mock Local DB** tự động fallback khi không có kết nối).
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

### Bước 2: Khởi động Backend API Server
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
cd backend
npm install
npm start
```
Server backend sẽ chạy tại: **`http://localhost:5000`** 🚀

### Bước 3: Khởi động Frontend Client (React)
Mở một cửa sổ terminal mới độc lập:
```bash
cd frontend
npm install
npm run dev
```
Truy cập ngay trình duyệt tại địa chỉ mặc định: **`http://localhost:5173`** 🚀

---

## 🌟 Chức Năng Nổi Bật Giao Diện (VietInterview AI UI Replica)

Hệ thống được thiết kế tỉ mỉ mô phỏng giao diện của **VietInterview AI** với các phân hệ chính sau:

1.  **🏠 Trang chủ (Dashboard):** Xem chỉ số tổng hợp của ứng viên (Số phòng vấn đã thi, điểm số trung bình, hoạt động phỏng vấn gần đây) và danh sách việc làm đề xuất.
2.  **📖 Ngân hàng câu hỏi:** Tra cứu danh mục câu hỏi tuyển dụng chính thức của các tập đoàn (Viettel VCS, VNG, NVIDIA, FPT Smart Cloud, NCS...).
3.  **📹 Luyện tập phỏng vấn:** Cấu hình phòng phỏng vấn thử, tải lên CV ứng tuyển và lựa chọn Công ty/Vị trí mong muốn.
4.  **💼 Việc làm:** Giao diện chia đôi màn hình (Split-screen) liệt kê việc làm tuyển dụng bên trái và chi tiết mô tả công việc (JD) bên phải, hỗ trợ nút **"Phân tích CV"** và **"Luyện phỏng vấn"** ngay lập tức.
5.  **📄 Hồ sơ CV:** Hộp kéo thả tệp tải lên CV dạng PDF chuyên nghiệp, hiển thị danh sách CV đã lưu.
6.  **🏢 Dành cho Doanh nghiệp:** Cổng quản trị dành cho phỏng vấn viên tạo và thiết lập bộ đề thi 10 câu hỏi xoay vòng cho từng cấp độ.

---

## 🧪 Chế độ Trải nghiệm AI & Database

Dự án hỗ trợ chuyển đổi linh hoạt chế độ chạy thử để nhà phát triển không bị nghẽn:

### 1. Cơ sở dữ liệu thông minh (Smart Database Engine)
*   **Chế độ Mock (Offline):** Khi chưa cấu hình URL Supabase, backend sẽ tự khởi động một bộ nhớ cơ sở dữ liệu cục bộ trong RAM (`mockSessions`, `mockCompanies`, `mockQuestionBanks`). Mọi dữ liệu như tạo tài khoản Google, nộp CV và làm bài thi vẫn hoạt động mượt mà.
*   **Chế độ Supabase (Online):** Điền các cấu hình Supabase vào tệp backend `.env`. Các bảng dữ liệu được liên kết khóa ngoại chặt chẽ và tự động truy vấn thông qua tệp schema cấu trúc sẵn trong thư mục [supabase/schema.sql](file:///d:/ThucTapDN/App_Phong_Van/supabase/schema.sql).

### 2. Trình Đánh Giá Câu Trả Lời Bằng Gemini AI
*   Khi ứng viên trả lời câu hỏi trực tiếp trong phòng phỏng vấn, backend sẽ truyền tải **nội dung câu hỏi, câu trả lời, cấp độ kỹ năng** cùng **lịch sử đối thoại 6 tin nhắn gần nhất** vào Gemini API.
*   Gemini sẽ tiến hành chấm điểm chuyên môn (Hard Skills), kỹ năng mềm diễn đạt (Soft Skills), và mức độ tự tin (Confidence).
*   **Quy tắc chống lạc đề (Anti-derailment):** Nếu ứng viên trả lời không liên quan đến câu hỏi công nghệ hoặc nói chuyện phiếm ngoài lề, AI sẽ tự động chấm **0 điểm** cho câu hỏi đó và phản hồi lời nhắc nhở lịch sự hướng cuộc phỏng vấn trở lại chủ đề hiện tại.

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
        └── InterviewerDashboard.jsx # Bảng cấu hình quản trị đề thi của phỏng vấn viên
```
