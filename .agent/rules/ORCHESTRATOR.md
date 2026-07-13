# Bộ Điều Phối (ORCHESTRATOR.md)

Tài liệu này định nghĩa cơ chế phối hợp giữa **Bộ câu hỏi (Question Bank)**, **AI Chatbot (Interviewer ảo)**, và **Interviewer thực tế (Con người)**.

## Sơ Đồ Hoạt Động (Workflow Diagram)
1. **Thiết lập Đề thi (Interviewer)**:
   * Interviewer tạo/chỉnh sửa bộ câu hỏi mẫu (JSON format, 10 câu hỏi) qua hệ thống hoặc để AI tự động tạo gợi ý.
   * Lưu trữ bộ đề này trong bảng `question_banks` của Supabase.
2. **Khai mạc phiên (AI Chatbot)**:
   * Khi ứng viên (Candidate) bắt đầu, hệ thống tải bộ câu hỏi tương thích với Công ty/Vị trí/Cấp độ.
   * AI Chatbot lấy câu hỏi theo chỉ số hiện tại (`current_question_index`).
3. **Vòng lặp Phỏng Vấn (Cơ chế xoay vòng)**:
   * **AI** đưa ra câu hỏi thứ `i`.
   * **Candidate** nhập câu trả lời (`receive answer`).
   * **AI** phân tích, chấm điểm sơ bộ và ghi chú độ chính xác (`check answer`).
   * Cập nhật lịch sử hội thoại (`chat_history`) và tăng chỉ số câu hỏi (`current_question_index`).
4. **Bàn giao kết quả (Human Interviewer)**:
   * Sau khi hoàn thành đủ số câu hỏi (10 câu), toàn bộ phiên phỏng vấn (`chat_history`, kết quả chấm điểm) được lưu lại.
   * Interviewer thực tế truy cập Dashboard để xem đánh giá chi tiết, đưa ra quyết định tuyển dụng cuối cùng.
