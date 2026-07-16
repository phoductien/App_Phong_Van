# Tài Liệu Thiết Kế Cơ Sở Dữ Liệu (DATABASE_SCHEMA.md)

Tài liệu này đặc tả chi tiết cấu trúc các bảng cơ sở dữ liệu quan hệ, chính sách Row Level Security (RLS) bảo mật dữ liệu và mã lệnh SQL Trigger dùng trong hệ thống **X-Interview**.

---

## 1. Sơ Đồ Thực Thể Quan Hệ (Entity-Relationship Diagram - ERD)

```
+------------------------------------+
|             PROFILES               |
+------------------------------------+
| PK  id (UUID, auth.users)          |
|     email (VARCHAR)                |
|     role ('candidate'|'recruiter') |
|     full_name (VARCHAR)            |
|     created_at (TIMESTAMP)         |
+------------------------------------+
       |              |
       | 1            | 1
       |              |
       | 1..N         | 1..N
+------------------+  +------------------------------------+
|     CV_VAULT     |  |          QUESTION_BANKS            |
+------------------+  +------------------------------------+
| PK  id (UUID)    |  | PK  id (UUID)                      |
| FK  user_id (PF) |  | FK  interviewer_id (profiles)      |
|     file_url     |  | FK  company_id (companies)         |
|     uploaded_at  |  |     level ('ez'|'medium'|'hard')   |
+------------------+  |     title (VARCHAR)                |
       |              |     questions (JSONB)              |
       |              +------------------------------------+
       | 1                                | 1
       |                                  |
       | 0..N                             | 0..N
+----------------------------------------------------------+
|                   INTERVIEW_SESSIONS                     |
+----------------------------------------------------------+
| PK  id (UUID)                                            |
| FK  candidate_id (profiles)                              |
| FK  cv_id (cv_vault)                                     |
| FK  question_bank_id (question_banks)                    |
|     current_question_index (INT)                         |
|     chat_history (JSONB)                                 |
|     status ('ongoing'|'completed')                       |
|     created_at (TIMESTAMP)                               |
+----------------------------------------------------------+
```

---

## 2. Đặc Tả Chi Tiết Các Bảng (Table Schemas)

### Bảng 2.1: `profiles` (Hồ sơ người dùng)
*   **id**: UUID (Primary Key, liên kết `auth.users(id)`).
*   **email**: VARCHAR(255) (Unique, bắt buộc).
*   **role**: Enum ('candidate', 'recruiter') (Mặc định: 'candidate').
*   **full_name**: VARCHAR(255) (Tên đầy đủ hiển thị).
*   **created_at**: TIMESTAMP WITH TIME ZONE (Mặc định: `now()`).

### Bảng 2.2: `cv_vault` (Kho lưu trữ CV)
*   **id**: UUID (Primary Key, mặc định: `gen_random_uuid()`).
*   **user_id**: UUID (Foreign Key trỏ đến `profiles(id)`).
*   **file_url**: TEXT (Đường dẫn tải file PDF từ Supabase Storage).
*   **uploaded_at**: TIMESTAMP WITH TIME ZONE (Mặc định: `now()`).

### Bảng 2.3: `companies` (Doanh nghiệp tuyển dụng)
*   **id**: UUID (Primary Key).
*   **name**: VARCHAR(255) (Unique, tên công ty thực tế).
*   **industry_domain**: VARCHAR(255) (Lĩnh vực hoạt động).
*   **created_at**: TIMESTAMP WITH TIME ZONE.

### Bảng 2.4: `question_banks` (Ngân hàng đề thi)
*   **id**: UUID (Primary Key).
*   **interviewer_id**: UUID (Foreign Key trỏ đến `profiles(id)`).
*   **company_id**: UUID (Foreign Key trỏ đến `companies(id)`).
*   **level**: VARCHAR(50) (Nhận giá trị: `'ez'`, `'medium'`, `'hard'`).
*   **title**: VARCHAR(255) (Tiêu đề bộ đề).
*   **questions**: JSONB (Mảng lưu 10-15 câu hỏi xoay vòng).

### Bảng 2.5: `interview_sessions` (Phiên phỏng vấn thử)
*   **id**: UUID (Primary Key).
*   **candidate_id**: UUID (Foreign Key trỏ đến `profiles(id)`).
*   **cv_id**: UUID (Foreign Key trỏ đến `cv_vault(id)`).
*   **question_bank_id**: UUID (Foreign Key trỏ đến `question_banks(id)`).
*   **current_question_index**: INT (Số thứ tự câu hỏi hiện tại, mặc định: `0`).
*   **chat_history**: JSONB (Mảng lưu toàn bộ lịch sử đối thoại dạng stream giữa AI và ứng viên).
*   **status**: VARCHAR(50) (Trạng thái: `'ongoing'` hoặc `'completed'`).
*   **created_at**: TIMESTAMP WITH TIME ZONE.

---

## 3. Chính Sách Row Level Security (RLS)

Để bảo vệ thông tin ứng viên và quyền lợi của doanh nghiệp, Supabase RLS được cấu hình như sau:

1.  **Profiles RLS:**
    *   Người dùng chỉ được đọc (SELECT) và cập nhật (UPDATE) thông tin cá nhân của chính mình dựa trên `auth.uid() = id`.
2.  **CV Vault RLS:**
    *   Ứng viên chỉ được xem/thêm/xóa CV của chính họ (`auth.uid() = user_id`).
    *   Nhà tuyển dụng (profiles.role = 'recruiter') có quyền SELECT để xem CV khi ứng viên nộp bài thi phỏng vấn.
3.  **Question Banks RLS:**
    *   Tất cả mọi người dùng (SELECT) đều được đọc câu hỏi để phục vụ ôn tập.
    *   Chỉ người dùng có vai trò là `'recruiter'` mới có quyền INSERT/UPDATE/DELETE bộ đề thi.
4.  **Interview Sessions RLS:**
    *   Ứng viên chỉ được xem và cập nhật tiến trình câu hỏi trong các phiên thi của chính mình (`auth.uid() = candidate_id`).
    *   Nhà tuyển dụng có quyền SELECT để giám sát các phòng phỏng vấn trực tiếp hoặc đánh giá kết quả ứng viên.

---

## 4. SQL Trigger Đồng Bộ Tài Khoản Tự Động (Auth Sync Trigger)

Đoạn mã SQL sau được nạp vào Supabase để tự động đồng bộ khi một người dùng đăng ký tài khoản qua Supabase Auth:

```sql
-- Tạo function xử lý trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'candidate'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
