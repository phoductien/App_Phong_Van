import React, { useState, useEffect } from 'react';

export default function Blog({ user }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');

  const posts = [
    {
      id: 1,
      title: '10 Câu hỏi phỏng vấn React phổ biến nhất năm 2026',
      desc: 'Tổng hợp danh sách các câu hỏi phỏng vấn kỹ thuật React (Hooks, Virtual DOM, Render performance) đi kèm hướng dẫn trả lời ghi điểm tuyệt đối với Tech Lead.',
      category: 'Kỹ thuật / React',
      author: 'Nguyễn Văn A',
      role: 'Senior React Developer tại VNG',
      date: '15/07/2026',
      readTime: '6 phút đọc',
      icon: '⚛️',
      content: `### Giới thiệu về React 19 và Xu hướng Phỏng vấn 2026

React tiếp tục thống trị mảng Front-end với sự ra mắt chính thức của React 19. Trong năm 2026, các nhà tuyển dụng không còn chỉ hỏi về các khái niệm cơ bản như Lifecycle hay State nữa. Thay vào đó, họ tập trung vào khả năng tối ưu hiệu năng và sự hiểu biết về cơ chế Server-side. Dưới đây là 10 câu hỏi cốt lõi bạn chắc chắn sẽ gặp:

---

#### 1. React Server Components (RSC) là gì và khác gì với SSR truyền thống?
* **Trả lời**: RSC cho phép các component được render trực tiếp trên máy chủ và gửi dữ liệu dạng stream về client mà không cần chạy JS ở client. Khác với SSR truyền thống (render toàn bộ trang ra HTML ở server sau đó hydrate ở client), RSC cho phép kết hợp linh hoạt giữa Server Components và Client Components, giảm dung lượng bundle tải xuống đáng kể.

#### 2. Bạn giải thích thế nào về cơ chế render của Virtual DOM trong React?
* **Trả lời**: Virtual DOM là một bản sao gọn nhẹ của DOM thật bằng Javascript. Khi state thay đổi, React sẽ tạo ra một Virtual DOM mới và so sánh nó với bản cũ (quá trình Diffing). Sau đó, React chỉ cập nhật những phần thực sự thay đổi lên DOM thật thông qua quá trình Reconciliation.

#### 3. Làm thế nào để tối ưu hóa hiệu năng render, tránh re-render không cần thiết?
* **Trả lời**: 
  - Sử dụng **React.memo** để bao bọc các component tĩnh.
  - Sử dụng hook **useMemo** để ghi nhớ các phép toán phức tạp.
  - Sử dụng hook **useCallback** để ghi nhớ định nghĩa hàm tránh tạo lại khi re-render.
  - Tách nhỏ State hoặc di chuyển State xuống component con gần nhất cần sử dụng.

#### 4. Hook \`use\` mới trong React 19 hoạt động như thế nào?
* **Trả lời**: Hook \`use\` cho phép đọc dữ liệu từ một Promise hoặc một Context trực tiếp trong vòng lặp hoặc câu lệnh rẽ nhánh (\`if\`). Đây là bước đột phá vì trước đây các hooks chỉ được khai báo ở cấp cao nhất của component.

#### 5. Sự khác biệt giữa \`useEffect\` và \`useLayoutEffect\` là gì?
* **Trả lời**: 
  - \`useEffect\` chạy bất đồng bộ **sau khi** trình duyệt đã vẽ giao diện (paint), phù hợp cho việc gọi API, subscribe sự kiện.
  - \`useLayoutEffect\` chạy đồng bộ **trước khi** trình duyệt vẽ giao diện lên màn hình, phù hợp khi cần tính toán kích thước phần tử DOM để tránh hiệu ứng giật màn hình (flicker).`,
      seedComments: [
        { name: 'Tấn Phát', content: 'Bài viết rất chi tiết, mình vừa đi phỏng vấn tuần trước gặp ngay câu hỏi về Server Components!', date: '16/07/2026' },
        { name: 'Minh Tuấn', content: 'React 19 ra mắt hook use và useActionState tiện thực sự, code clean đi rất nhiều.', date: '17/07/2026' }
      ]
    },
    {
      id: 2,
      title: 'Mẹo viết CV thu hút ánh nhìn của nhà tuyển dụng IT chỉ trong 6 giây',
      desc: 'Hướng dẫn cách sắp xếp bố cục thông tin dự án, từ khóa công nghệ (Keywords) và cách thể hiện số liệu kết quả để vượt qua bộ lọc quét CV tự động (ATS).',
      category: 'Kỹ năng / Viết CV',
      author: 'Trần Thị B',
      role: 'HR Manager tại FPT Software',
      date: '12/07/2026',
      readTime: '5 phút đọc',
      icon: '📄',
      content: `### Quy Tắc 6 Giây Và Bộ Lọc CV Tự Động (ATS)

Trung bình, một HR chỉ mất **6 giây** để quét nhanh một CV trước khi quyết định đọc tiếp hay bỏ qua. Đồng thời, các tập đoàn công nghệ lớn hiện nay đều sử dụng phần mềm quét CV tự động (Applicant Tracking System - ATS). Nếu CV của bạn không được tối ưu cấu trúc, bạn sẽ bị loại ngay từ vòng gửi xe.

---

#### 1. Định dạng CV chuẩn để vượt qua bộ lọc ATS
* **Không dùng bảng (Tables), biểu đồ hay hình vẽ phức tạp**: ATS đọc văn bản theo dòng từ trái qua phải. Nếu bạn chia cột bằng Table phức tạp, ATS sẽ quét lỗi ký tự.
* **Lưu file định dạng PDF hoặc DOCX**: Luôn đặt tên file rõ ràng, ví dụ: \`CV_NguyenVanA_ReactDeveloper.pdf\`.

#### 2. Viết dự án theo công thức STAR
Đừng chỉ liệt kê công việc bạn đã làm, hãy viết dự án theo cấu trúc:
* **S (Situation)**: Ngữ cảnh của dự án.
* **T (Task)**: Nhiệm vụ của bạn trong dự án đó.
* **A (Action)**: Bạn đã dùng công nghệ gì, làm thế nào để giải quyết vấn đề.
* **R (Result)**: Kết quả đạt được bằng **con số cụ thể** (ví dụ: Tăng tốc độ load trang 40%, giảm dung lượng ảnh 50%...).

#### 3. Tối ưu từ khóa công nghệ (Keywords Match)
* Đọc kỹ bản mô tả công việc (JD). Nếu JD yêu cầu \`Tailwind CSS\` và \`Redux Toolkit\`, hãy chắc chắn những từ khóa đó xuất hiện chính xác trong phần kỹ năng và mô tả dự án của bạn.`,
      seedComments: [
        { name: 'Khánh Vy', content: 'Quy tắc 6 giây quả thực rất đúng, CV trình bày quá dài dòng thường bị bỏ qua ngay.', date: '13/07/2026' },
        { name: 'Hải Đăng', content: 'Làm thế nào để làm nổi bật CV khi mình chưa có nhiều kinh nghiệm dự án thực tế vậy chị?', date: '14/07/2026' }
      ]
    },
    {
      id: 3,
      title: 'Quy trình ứng cứu sự cố bảo mật theo tiêu chuẩn NIST',
      desc: 'Tìm hiểu 6 bước xử lý sự cố an ninh thông tin chuẩn quốc tế giúp bạn tự tin trả lời phỏng vấn các vị trí Security Analyst hoặc SOC Engineer.',
      category: 'Bảo mật / DevOps',
      author: 'Phạm Đức C',
      role: 'Security Specialist tại Viettel Cyber Security',
      date: '08/07/2026',
      readTime: '8 phút đọc',
      icon: '🛡️',
      content: `### 6 Bước Ứng Cứu Sự Cố Chuẩn NIST (SP 800-61)

Khi phỏng vấn các vị trí như SOC Analyst, DevSecOps hay Security Engineer, câu hỏi tình huống: *"Khi hệ thống bị mã hóa dữ liệu hoặc bị tấn công DDoS, bạn sẽ làm gì đầu tiên?"* xuất hiện rất thường xuyên. Việc trả lời theo tiêu chuẩn NIST giúp bạn ghi điểm tuyệt đối vì tính chuyên nghiệp và khoa học.

---

#### Bước 1: Preparation (Chuẩn bị)
Thiết lập các công cụ giám sát, xây dựng kịch bản ứng phó sự cố (Playbooks) và đào tạo đội ngũ. Đây là bước quan trọng nhất trước khi có sự cố xảy ra.

#### Bước 2: Detection and Analysis (Phát hiện & Phân tích)
Giám sát các file log từ Web Server, tường lửa (Firewall), hệ thống SIEM để xác định xem sự cố có thực sự xảy ra hay không, mức độ ảnh hưởng và nguồn gốc cuộc tấn công.

#### Bước 3: Containment (Khoanh vùng / Cô lập)
Nhanh chóng ngắt kết nối các máy chủ bị nhiễm mã độc khỏi mạng nội bộ để ngăn chặn mã độc lây lan sang các phân vùng hệ thống khác (ví dụ: ngắt kết nối Internet của Server bị tấn công).

#### Bước 4: Eradication (Loại bỏ tác nhân)
Tìm kiếm và xóa bỏ hoàn toàn các mã độc, backdoor, tắt các tiến trình lạ và vá các lỗ hổng bảo mật mà hacker đã khai thác để đột nhập vào hệ thống.

#### Bước 5: Recovery (Khôi phục)
Khôi phục dữ liệu từ các bản sao lưu sạch (Clean Backups), kiểm tra tính toàn vẹn của hệ thống và đưa máy chủ hoạt động bình thường trở lại.

#### Bước 6: Post-Incident Activity (Tổng kết & Rút kinh nghiệm)
Viết báo cáo chi tiết về nguyên nhân, thiệt hại và các bài học kinh nghiệm để cập nhật lại kịch bản phòng thủ, tránh lặp lại sự cố tương tự.`,
      seedComments: [
        { name: 'Thế Hùng', content: 'Bài viết rất hữu ích cho các bạn làm hướng SOC Analyst, quy trình chuẩn chỉnh!', date: '09/07/2026' }
      ]
    },
    {
      id: 4,
      title: 'Hành trình từ Intern đến Mid-level developer sau 1 năm',
      desc: 'Những kỹ năng mềm quan trọng, phương pháp tự học công nghệ mới và cách giao tiếp hiệu quả giúp bạn thăng tiến vượt bậc trong môi trường doanh nghiệp.',
      category: 'Sự nghiệp / Phát triển',
      author: 'Lê Hoàng Minh',
      role: 'Tech Lead tại VNG Corporation',
      date: '05/07/2026',
      readTime: '7 phút đọc',
      icon: '📈',
      content: `### Làm Thế Nào Để Bứt Phá Nhanh Trong Năm Đầu Sự Nghiệp?

Nhiều lập trình viên mới ra trường thường loay hoay trong công việc lặp đi lặp lại và không thể thăng tiến. Để rút ngắn thời gian từ vị trí Thực tập sinh lên Lập trình viên trung cấp (Mid-level) từ 3 năm xuống 1 năm, bạn cần tập trung vào các chiến lược sau:

---

#### 1. Chủ động học hỏi và nhận trách nhiệm (Ownership)
* Thay vì chỉ đợi phân công việc, hãy chủ động đề xuất giải quyết các bug tồn đọng hoặc tối ưu hóa các module cũ.
* Thể hiện tinh thần trách nhiệm cao: Khi nhận một task, hãy hoàn thành trọn vẹn cả việc viết tài liệu (docs) và unit test đi kèm.

#### 2. Kỹ năng giao tiếp và đặt câu hỏi thông minh
* Đừng hỏi ngay khi gặp lỗi. Hãy dành ít nhất 15-30 phút tự nghiên cứu, tìm kiếm trên Google/StackOverflow.
* Khi hỏi đàn anh hoặc Tech Lead, hãy trình bày rõ: *Em gặp lỗi này, em đã thử giải quyết bằng cách A và B nhưng vẫn chưa được, nhờ anh xem giúp.*

#### 3. Tiếp nhận phản hồi tích cực từ Code Reviews
* Code Review là cơ hội tuyệt vời để bạn học hỏi. Hãy xem kỹ từng bình luận góp ý của các lập trình viên nhiều kinh nghiệm và ghi chép lại để tránh mắc lỗi tương tự ở các pull request sau.`,
      seedComments: [
        { name: 'Quốc Bảo', content: 'Kỹ năng đặt câu hỏi thông minh cực kỳ quan trọng, nhiều bạn mới vào cứ thấy lỗi là hỏi ngay mà chưa tự tìm hiểu.', date: '06/07/2026' }
      ]
    },
    {
      id: 5,
      title: 'System Design: Thiết kế hệ thống chịu tải hàng triệu người dùng',
      desc: 'Tổng quan kiến trúc phân tán cơ bản bao gồm Load Balancer, Caching (Redis), Database Sharding và Message Queue giúp bạn tự tin trong các vòng phỏng vấn thiết kế hệ thống.',
      category: 'Kiến trúc / Hệ thống',
      author: 'Hoàng Ngọc Lâm',
      role: 'Solution Architect tại NVIDIA Vietnam',
      date: '02/07/2026',
      readTime: '10 phút đọc',
      icon: '🖥️',
      content: `### Kiến Trúc Hệ Thống Phân Tán Cho Quy Mô Triệu User

Thiết kế hệ thống (System Design) là vòng phỏng vấn khó khăn và mang tính quyết định nhất đối với các vị trí Senior Developer trở lên. Dưới đây là các viên gạch nền móng để bạn vẽ bản thiết kế kiến trúc chuẩn xác:

---

#### 1. Load Balancer (Bộ cân bằng tải)
* Đóng vai trò là cổng đón tiếp request và phân phối đều lượng truy cập đến các cụm máy chủ Web (Web Servers) chạy song song ở phía sau, tránh tình trạng một server bị quá tải sập nguồn.

#### 2. Cơ chế Caching (Bộ nhớ đệm với Redis/Memcached)
* Lưu trữ các dữ liệu thường xuyên được đọc nhưng ít khi thay đổi (ví dụ: thông tin cấu hình hệ thống, danh mục sản phẩm) ở RAM để phản hồi ngay lập tức, giảm thiểu áp lực truy vấn trực tiếp xuống Database.

#### 3. Database Sharding & Replication
* **Replication**: Chia tách CSDL thành 1 server Master (chuyên ghi) và nhiều server Slave (chuyên đọc) để tăng tốc độ phản hồi.
* **Sharding**: Phân mảnh cơ sở dữ liệu theo chiều ngang, chia một bảng dữ liệu khổng lồ thành nhiều phần nhỏ nằm trên nhiều máy chủ vật lý khác nhau.

#### 4. Message Queue (Hàng đợi tin nhắn - Kafka/RabbitMQ)
* Hỗ trợ xử lý bất đồng bộ các tác vụ nặng (như gửi email xác nhận thanh toán, xử lý hình ảnh/video). Web server chỉ cần ném tác vụ vào hàng đợi và phản hồi khách hàng ngay, việc xử lý chi tiết sẽ do các Worker xử lý ngầm ở phía sau.`,
      seedComments: [
        { name: 'Anh Quân', content: 'Bài viết đúc kết rất súc tích. Vòng System Design thường chấm điểm tư duy giải quyết vấn đề thực tế hơn là học thuộc lòng.', date: '03/07/2026' }
      ]
    },
    {
      id: 6,
      title: 'Làm thế nào để đàm phán lương (Salary Negotiation) tự tin khi phỏng vấn',
      desc: 'Mẹo tâm lý, cách chuẩn bị mức lương sàn phù hợp và trả lời thông minh câu hỏi "Mức lương mong muốn của bạn là bao nhiêu?" từ nhà tuyển dụng.',
      category: 'Kỹ năng / Đàm phán',
      author: 'Nguyễn Thị Hồng',
      role: 'Head of Talent Acquisition tại VNG',
      date: '28/06/2026',
      readTime: '5 phút đọc',
      icon: '💵',
      content: `### Bí Quyết Deal Lương Tự Tin Không Bị Hớ

Nhiều ứng viên kỹ thuật xuất sắc trong chuyên môn nhưng lại rất lúng túng khi thương lượng thu nhập ở vòng cuối cùng. Dưới đây là chiến lược đàm phán lương thông minh dựa trên tư duy đôi bên cùng có lợi (Win - Win):

---

#### 1. Nghiên cứu kỹ mức lương thị trường trước phỏng vấn
* Hãy khảo sát mức thu nhập trung bình cho số năm kinh nghiệm và vị trí tương đương qua các trang tuyển dụng uy tín hoặc hỏi ý kiến từ bạn bè cùng ngành. Xác định rõ **Mức lương sàn** (mức tối thiểu bạn chấp nhận) và **Mức lương kỳ vọng**.

#### 2. Tránh là người đầu tiên đưa ra con số cụ thể
* Khi nhà tuyển dụng hỏi: *"Mức lương mong muốn của bạn là bao nhiêu?"*, bạn có thể khéo léo phản hồi: *"Tôi muốn tìm hiểu thêm về khối lượng công việc, chế độ đãi ngộ chi tiết của công ty để đưa ra con số phù hợp. Không biết ngân sách cho vị trí này của công ty là bao nhiêu?"*

#### 3. Tập trung vào giá trị bạn mang lại cho doanh nghiệp
* Khi đưa ra mức đề xuất, hãy liên kết trực tiếp với năng lực của bạn: *"Với kinh nghiệm tối ưu hóa hệ thống tải lớn ở dự án cũ giúp tiết kiệm 30% chi phí hạ tầng, tôi kỳ vọng mức thu nhập khoảng X triệu để cống hiến trọn vẹn tại vị trí này."*`,
      seedComments: [
        { name: 'Ngọc Mai', content: 'Bí quyết đàm phán lương rất thực tế, chuẩn bị tâm lý tự tin và hiểu giá trị bản thân là quyết định hết 80% thành công rồi.', date: '29/06/2026' }
      ]
    }
  ];

  // Load and merge comments from localStorage
  useEffect(() => {
    if (selectedPost) {
      const storageKey = `x_blog_comments_${selectedPost.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        setComments(selectedPost.seedComments || []);
        localStorage.setItem(storageKey, JSON.stringify(selectedPost.seedComments || []));
      }
    }
  }, [selectedPost]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Use current logged-in user name or custom name input
    const authorName = user?.full_name || commentName.trim() || 'Người dùng ẩn danh';
    
    const newCommentObj = {
      name: authorName,
      content: newComment.trim(),
      date: new Date().toLocaleDateString('vi-VN')
    };

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    setNewComment('');
    
    // Clear custom name input after use
    if (!user) {
      setCommentName('');
    }

    // Save to localStorage
    if (selectedPost) {
      localStorage.setItem(`x_blog_comments_${selectedPost.id}`, JSON.stringify(updatedComments));
    }
  };

  if (selectedPost) {
    return (
      <div className="py-6 sm:py-10 font-sans bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition duration-150 mb-6 cursor-pointer"
          >
            ← Quay lại Blog
          </button>

          {/* Article Header */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 rounded-full mb-3">
              {selectedPost.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {selectedPost.title}
            </h1>
            
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl">{selectedPost.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedPost.author}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedPost.role}</p>
              </div>
              <div className="ml-auto text-xs text-slate-400 text-right">
                <span>{selectedPost.date}</span>
                <span className="mx-1">&middot;</span>
                <span>{selectedPost.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-sm transition duration-300">
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {selectedPost.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('###')) {
                  return <h3 key={index} className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2 border-b pb-2 border-slate-100 dark:border-slate-750">{paragraph.replace('###', '').trim()}</h3>;
                }
                if (paragraph.startsWith('####')) {
                  return <h4 key={index} className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-1">{paragraph.replace('####', '').trim()}</h4>;
                }
                if (paragraph.startsWith('*')) {
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1.5 my-2">
                      {paragraph.split('\n').map((li, liIndex) => (
                        <li key={liIndex} className="text-slate-600 dark:text-slate-350">
                          {li.replace(/^\*\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={index}>{paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
              })}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-sm transition duration-300">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              💬 Bình luận ({comments.length})
            </h3>

            {/* Comments List */}
            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">Chưa có bình luận nào cho bài viết này. Hãy là người đầu tiên!</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 transition duration-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-250">{comment.name}</span>
                      <span className="text-xs text-slate-400">{comment.date}</span>
                    </div>
                    <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-4 pt-4 border-t border-slate-150 dark:border-slate-700/60">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Viết bình luận của bạn:</h4>
              
              {!user && (
                <div>
                  <input
                    type="text"
                    placeholder="Tên của bạn..."
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    required
                    className="w-full sm:w-1/2 px-4 py-2 text-sm rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              )}

              <div>
                <textarea
                  rows="3"
                  placeholder={user ? `Đang bình luận dưới tên: ${user.full_name}...` : "Nội dung bình luận..."}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition duration-150 cursor-pointer"
                >
                  Gửi bình luận
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 font-sans bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            Blog Chia Sẻ Kinh Nghiệm
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-500 dark:text-slate-400">
            Cập nhật các mẹo phỏng vấn, hướng dẫn viết CV và kiến thức công nghệ thực tế từ chuyên gia.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="mt-12 max-w-lg mx-auto grid gap-6 lg:grid-cols-3 lg:max-w-none">
          {posts.map((post) => (
            <div
              key={post.title}
              onClick={() => setSelectedPost(post)}
              className="flex flex-col rounded-2xl shadow-sm border border-slate-200 dark:border-slate-750/80 overflow-hidden bg-white dark:bg-slate-850 hover:shadow-md hover:translate-y-[-2px] transition duration-200 cursor-pointer group"
            >
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xl">{post.icon}</span>
                  </div>
                  <div className="block mt-4">
                    <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
                      {post.title}
                    </p>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {post.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex-shrink-0">
                    <span className="inline-block h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-center leading-9 text-base shadow-inner select-none">
                      👤
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-bold text-slate-850 dark:text-slate-250">
                      {post.author}
                    </p>
                    <div className="flex space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{post.date}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
