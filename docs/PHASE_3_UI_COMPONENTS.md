# Tài Liệu Giao Diện & Component Người Dùng (UI_COMPONENTS.md)

Tài liệu này đặc tả chi tiết giao diện người dùng, cấu trúc các component giao diện bằng Tailwind CSS và Cloudscape Design System trong hệ thống **X-Interview**.

---

## 1. Màn Hình Đăng Ký / Đăng Nhập (Tailwind CSS Auth Page)

Trang đăng nhập và đăng ký được thiết kế hoàn toàn bằng Tailwind CSS để đảm bảo tính mỹ thuật hiện đại, bám sát mockup thực tế:

### 1.1. Luồng Giao Diện Đăng Ký (Sign Up Form)
*   **Tiêu đề lớn:** "Tạo tài khoản" (font-bold, text-slate-800, text-2xl).
*   **Phụ đề:** "Đăng ký để bắt đầu sử dụng X-interview" (text-sm, text-slate-500).
*   **Trường Họ và tên:** Ô input nhập họ và tên ứng viên có icon User ở đầu, placeholder "Nguyễn Văn A".
*   **Trường Email:** Ô input nhập địa chỉ email có icon Thư (Envelope) ở đầu, placeholder "name@example.com".
*   **Hàng Mật khẩu & Xác nhận:** Chia làm 2 cột bằng nhau trên cùng một hàng ngang:
    *   Cột 1: Nhập mật khẩu. Icon ổ khóa ở đầu, icon Con mắt (Eye) ở cuối hỗ trợ ẩn/hiện mật khẩu.
    *   Cột 2: Nhập lại mật khẩu để kiểm tra trùng khớp. Icon tương tự.
*   **Checkbox Điều khoản:** Chọn đồng ý với Điều khoản sử dụng của X-Interview.
*   **Nút Đăng ký chính:** Nút bấm màu tím chủ đạo (`bg-indigo-600 hover:bg-indigo-700`), bo góc tròn đầy đặn (`rounded-xl`), có icon Đăng ký kế bên chữ.
*   **Nút phụ đăng ký Google:** Phía dưới cùng, ngăn cách bởi dòng text "Hoặc đăng ký với".

### 1.2. Luồng Giao Diện Đăng Nhập (Sign In Form)
*   **Tiêu đề chính:** "Đăng nhập" (text-2xl, font-bold).
*   **Phụ đề:** "Nhập thông tin đăng nhập để truy cập tài khoản của bạn".
*   **Trường Email:** Icon thư ở đầu.
*   **Trường Mật khẩu:** Icon ổ khóa đầu, icon con mắt ẩn/hiện ở cuối, tích hợp liên kết "Quên mật khẩu?" màu tím nổi bật ngay phía trên góc phải của nhãn.
*   **Checkbox Ghi nhớ:** Lựa chọn ghi nhớ thông tin đăng nhập.
*   **Nút Đăng nhập chính:** Màu tím nổi bật, kích hoạt đăng nhập.
*   **Nút phụ đăng nhập Google:** Đăng nhập thông qua tài khoản Google giả lập hoặc thật.

---

## 2. Thanh Sidebar & Routing Điều Hướng (Sidebar Navigation & Routing)

Ứng dụng chia hai khu vực làm việc (workspace) riêng biệt phụ thuộc vào vai trò người dùng được chọn:

### 2.1. Chế độ Ứng Viên (Candidate Sidebar Workspace)
*   **🏠 Trang chủ:** Dẫn đến `/dashboard`.
*   **📖 Ngân hàng câu hỏi:** Dẫn đến `/questions`.
*   **📹 Luyện tập phỏng vấn:** Dẫn đến `/interview/setup`.
*   **💼 Việc làm:** Dẫn đến `/jobs`.
*   **🏆 Gói dịch vụ:** Dẫn đến `/pricing`.
*   **📄 Hồ sơ CV:** Dẫn đến `/cv-vault`.
*   **📝 Blog:** Dẫn đến `/blog`.
*   **Khối CTA chuyển đổi vai trò:** Hộp màu tím đặc trưng ở dưới cùng sidebar ghi rõ: *"Dành cho Doanh nghiệp / Phỏng vấn ứng viên với AI"*. Khi click sẽ lập tức chuyển sang chế độ Recruiter và điều hướng về `/recruiter/dashboard`.

### 2.2. Chế độ Nhà tuyển dụng (Recruiter Sidebar Workspace)
*   **🏢 Trang chủ Quản trị:** Dẫn đến `/recruiter/dashboard`.
*   **📝 Đăng tin tuyển dụng:** Dẫn đến `/recruiter/jobs/new`.
*   **📚 Ngân hàng câu hỏi tuyển dụng:** Dẫn đến `/recruiter/questions`.
*   **👥 Danh sách ứng viên:** Dẫn đến `/recruiter/candidates`.
*   **Khối CTA chuyển đổi vai trò:** Nút *"Chế độ: Ứng viên 👤"* để chuyển đổi nhanh ngược lại chế độ ứng viên.

---

## 3. Candidate Dashboard Layout (Dashboard Ứng Viên)

Được thiết kế hiện đại bằng Tailwind CSS, bao gồm:
*   **Khối Lời Chào:** "Chào mừng trở lại, Đức Tiến!" kèm phụ đề ngắn mô tả hành trình.
*   **4 Thẻ Thống Kê Chỉ Số (Cards Grid):**
    1.  *Tổng số phỏng vấn:* Số phiên phỏng vấn đã bắt đầu.
    2.  *Phòng vấn đã hoàn thành:* Số phiên phỏng vấn đã trả lời đủ 10 câu hỏi và có điểm đánh giá.
    3.  *Đơn ứng tuyển đã gửi:* Số lượng đơn xin việc ứng viên đã gửi CV đến các đối tác.
    4.  *Điểm trung bình:* Điểm số trung bình (%) của tất cả các buổi thi.
*   **Khung Banner Lớn Trải Nghiệm:** Nền xanh tím chuyển sắc có tiêu đề *"Giả lập phỏng vấn thực tế"* và nút hành động *"Bắt đầu ngay ->"* bắt mắt kích thích ứng viên ôn tập.
*   **Thanh Tìm Kiếm & Lọc Nhanh:** Ô nhập tìm kiếm tài nguyên kết hợp 2 thẻ Select lọc nhanh theo Danh mục công việc và Độ khó.
*   **Danh Sách Hoạt Động Gần Đây:** Bảng hiển thị các phòng thi gần nhất kèm lịch sử điểm số.
*   **Danh Sách Việc Làm Gợi Ý (Sidebar phải):** Các tin tuyển dụng IT phù hợp nhất, đi kèm mức lương thỏa thuận và hình thức làm việc (Từ xa / Văn phòng).

---

## 4. Recruiter Dashboard Layout (Dashboard Nhà Tuyển Dụng)

Giao diện quản trị viên doanh nghiệp sử dụng **Cloudscape Design System** (tùy biến CSS chủ đạo màu tím) để tối ưu hiển thị dữ liệu lớn:
*   **Trang Thống Kê Tổng Quan:** Biểu đồ lượng ứng viên tham gia, số chiến dịch hoạt động, tỷ lệ CV khớp yêu cầu.
*   **Trang Giám Sát Trực Tuyến (Live Monitor):** Theo dõi thời gian thực phòng phỏng vấn của ứng viên, hiển thị trạng thái chờ HR tham gia và nút kích hoạt bắt đầu thi.
*   **Mock Webcam Video Recorder:** Giao diện mô phỏng webcam ghi hình ứng viên lúc làm bài thi, kèm đồ họa AI phân tích biểu cảm mắt (Gaze Context), phân tích giọng nói (Voice Tone) và khung nhận xét hành vi chuyên sâu.
