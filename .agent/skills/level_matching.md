# Quy Tắc Đánh Giá Cấp Độ (level_matching.md)

Tài liệu này hướng dẫn phân loại mức độ khó của câu hỏi tương ứng với cấp độ nghề nghiệp của ứng viên.

## Ma Trận Phân Loại Cấp Độ

| Cấp độ ứng tuyển | Mức độ câu hỏi | Đặc tả nội dung câu hỏi |
| :--- | :--- | :--- |
| **Intern / Fresher** | **Dễ (ez)** | - Khái niệm cơ bản, định nghĩa, cú pháp ngôn ngữ.<br>- Các câu lệnh cơ bản, vòng đời component (lifecycle).<br>- Tư duy giải thuật đơn giản. |
| **Junior** | **Trung bình (medium)** | - Xử lý lỗi (troubleshooting) trong dự án thực tế.<br>- Tối ưu hóa hiệu năng cơ bản, quản lý trạng thái (state management).<br>- Tích hợp API, bảo mật cơ bản (OWASP Top 10). |
| **Senior** | **Khó (hard)** | - Thiết kế kiến trúc hệ thống (system architecture, scalability).<br>- Tối ưu hóa sâu hiệu năng, quản lý tài nguyên, bất đồng bộ phức tạp.<br>- Xử lý sự cố nghiêm trọng, bảo mật chuyên sâu, thiết kế hệ thống phân tán. |

## Ví Dụ Cụ Thể Theo Từng Vị Trí

### 1. Full Stack / Backend (VNG Corporation / FPT Software)
*   **ez**: Giải thích sự khác nhau giữa `var`, `let`, `const` hoặc `GET` và `POST`.
*   **medium**: Thiết kế RESTful API xử lý việc phân trang và lọc dữ liệu. Giải thích cơ chế Middleware trong Express.
*   **hard**: Thiết kế hệ thống cache sử dụng Redis kết hợp cơ sở dữ liệu để chịu tải cao (high concurrency), giải thích cách chống Cache Penetration/Stampede.

### 2. Security / SOC (Viettel Cyber Security / NCS Group)
*   **ez**: OWASP Top 10 là gì? Nêu ví dụ về lỗi SQL Injection.
*   **medium**: Cách phát hiện và giảm thiểu (mitigate) một cuộc tấn công DDoS ở tầng ứng dụng (Layer 7).
*   **hard**: Thiết kế quy trình phản ứng sự cố (Incident Response) khi phát hiện mã độc tống tiền (Ransomware) trong hệ thống nội bộ doanh nghiệp.

### 3. DevOps / Tester (NVIDIA Vietnam / FPT Smart Cloud)
*   **ez**: Docker container là gì? Cách viết một Dockerfile cơ bản.
*   **medium**: Viết cấu hình pipeline CI/CD (GitHub Actions/Jenkins) để build, test và deploy tự động lên Kubernetes.
*   **hard**: Thiết kế hệ thống mạng High Availability trên Cloud, tối ưu hóa băng thông mạng và khắc phục sự cố nghẽn cổ chai (Network Bottleneck) khi dữ liệu truyền qua GPU Cluster.
