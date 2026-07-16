# Kỹ năng Lưu Trạng Thái Mốc Phát Triển (save_checkpoint.md)

Kỹ năng này hướng dẫn cách tạo Git Commit và ghi nhận nhật ký lưu trữ các mốc phát triển ổn định để đảm bảo dự án luôn trong trạng thái có thể khôi phục tốt.

---

## 1. Nguyên Tắc Checkpoint
*   **Không commit code lỗi**: Chỉ tạo checkpoint khi dự án đã build thành công (`npm run build` không lỗi) và các tính năng kiểm thử cơ bản hoạt động bình thường.
*   **Mô tả rõ ràng**: Tên commit và ghi nhận checkpoint phải ghi rõ tính năng hoặc lỗi đã giải quyết (Ví dụ: `feat: add custom Tailwind login page`, `fix: handle NullPointerException in CV parsing`).

---

## 2. Quy Trình Tạo Checkpoint
1.  **Bước 1: Kiểm tra lỗi**: Chạy lệnh build hoặc lint của dự án:
    ```bash
    npm run build
    ```
2.  **Bước 2: Stage file**: Thêm các file đã chỉnh sửa hoặc tạo mới vào Git stage:
    ```bash
    git add .
    ```
3.  **Bước 3: Commit**: Tạo commit cục bộ ghi nhận mốc checkpoint:
    ```bash
    git commit -m "[Mô tả thay đổi]"
    ```
4.  **Bước 4: Ghi nhận nhật ký**: Cập nhật file `.agent/workflows/session_memory.md` để ghi nhận Phase hiện tại và trạng thái kết nối.
