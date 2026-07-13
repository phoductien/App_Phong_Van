# Luồng Phỏng Vấn (interview_flow.md)

Tài liệu này định nghĩa cơ chế xoay vòng câu hỏi (10 câu) và tương tác phản hồi của AI Chatbot.

## Quy Trình Xoay Vòng Câu Hỏi (10 Câu)

1.  **Khởi tạo bộ đề**:
    *   Tải danh sách 10 câu hỏi từ đề thi đã chọn (`question_banks.questions`).
    *   Đặt `current_question_index = 0` và khởi tạo lịch sử trò chuyện rỗng.

2.  **Vòng lặp Hỏi - Đáp**:
    *   **Bước 2.1: Đưa ra câu hỏi**: AI Chatbot hiển thị câu hỏi hiện tại cho ứng viên.
        *   *Ví dụ*: `[Câu số 1/10]: Bạn hãy giải thích cơ chế hoạt động của React Virtual DOM?`
    *   **Bước 2.2: Nhận câu trả lời (Receive Answer)**: Ứng viên gửi câu trả lời dạng văn bản qua khung chat.
    *   **Bước 2.3: Đánh giá và chấm điểm (Check Answer)**:
        *   AI kiểm tra câu trả lời dựa trên đáp án mẫu hoặc kiến thức chuẩn của công nghệ đó.
        *   Chấm điểm câu trả lời trên thang điểm 10.
        *   Lưu trữ kết quả chấm điểm, phản hồi ngắn và câu trả lời của ứng viên vào `chat_history`.
    *   **Bước 2.4: Phản hồi & Chuyển câu**:
        *   AI đưa ra phản hồi ngắn gọn, khích lệ ứng viên (không cần giải thích quá dài dòng để tránh loãng phiên phỏng vấn).
        *   Tăng `current_question_index` thêm 1.
        *   Chuyển sang câu tiếp theo.

3.  **Kết thúc phiên**:
    *   Khi `current_question_index` đạt đến 10, AI Chatbot thông báo hoàn thành buổi phỏng vấn.
    *   Hệ thống tổng hợp tổng số điểm của 10 câu hỏi.
    *   Cập nhật trạng thái phiên phỏng vấn thành `completed` trong Supabase.
    *   Đưa ra lời cảm ơn và hướng dẫn ứng viên chờ phản hồi từ phía Interviewer thực tế.
