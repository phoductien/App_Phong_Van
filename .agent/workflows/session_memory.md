# Quản Lý Trạng Thái Phiên (session_memory.md)

Tài liệu này hướng dẫn cách lưu trữ và duy trì trạng thái phiên phỏng vấn (context) của ứng viên nhằm đảm bảo AI Chatbot luôn nhớ ngữ cảnh trong suốt quá trình hội thoại.

## Cấu Trúc Bộ Nhớ Phiên (Session State Schema)

Mỗi phiên phỏng vấn hoạt động được đại diện bởi một đối tượng trạng thái lưu trong cơ sở dữ liệu `interview_sessions`:

```json
{
  "session_id": "uuid-v4-string",
  "candidate_info": {
    "id": "uuid-profile-id",
    "full_name": "Nguyễn Văn A",
    "email": "candidate@example.com"
  },
  "selected_cv": {
    "cv_id": "cv-uuid",
    "file_url": "https://supabase-storage-url.com/cv.pdf"
  },
  "target_company": "NVIDIA",
  "target_position": "DevOps",
  "level": "medium",
  "question_bank": [
    { "id": 1, "text": "Câu hỏi 1..." },
    { "id": 2, "text": "Câu hỏi 2..." }
  ],
  "current_question_index": 0,
  "chat_history": [
    {
      "role": "ai",
      "content": "Chào bạn, hãy giới thiệu sơ lược về dự án CI/CD gần đây nhất bạn làm?",
      "timestamp": "2026-07-13T14:30:00Z"
    },
    {
      "role": "candidate",
      "content": "Tôi đã setup Gitlab CI cho dự án React app deploy lên AWS S3...",
      "timestamp": "2026-07-13T14:31:00Z"
    },
    {
      "role": "ai_evaluation",
      "score": 8,
      "feedback": "Trả lời tốt các bước setup cơ bản, cần bổ sung cách tối ưu cache Docker build.",
      "timestamp": "2026-07-13T14:31:05Z"
    }
  ]
}
```

## Quy Trình Cập Nhật Bộ Nhớ (Memory Synced Workflow)

1.  **Đọc trạng thái (Fetch State)**:
    *   Trước khi gửi phản hồi mới cho ứng viên, API Backend truy vấn thông tin phiên hiện tại từ bảng `interview_sessions` bằng `session_id`.
    *   Hệ thống truyền tải toàn bộ thông tin ngữ cảnh này (đặc biệt là lịch sử chat và vị trí tuyển dụng) vào Prompt hệ thống cho AI.

2.  **Ghi nhớ & Cập nhật (State Persist)**:
    *   Sau khi ứng viên trả lời và AI chấm điểm/phản hồi, backend sẽ đẩy thêm tin nhắn mới vào mảng `chat_history`.
    *   Cập nhật `current_question_index` lên giá trị mới.
    *   Đồng bộ hóa dữ liệu xuống bảng `interview_sessions` của Supabase.

3.  **Tránh Hiện Tượng Quên Ngữ Cảnh (Context Retention Rules)**:
    *   AI Chatbot không được phép tự do trò chuyện lan man ngoài chủ đề phỏng vấn.
    *   Nếu ứng viên cố tình chuyển chủ đề, AI cần lịch sự nhắc nhở và đưa cuộc hội thoại quay về câu hỏi hiện tại.
