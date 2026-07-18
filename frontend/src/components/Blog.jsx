import React, { useState, useEffect } from 'react';

export default function Blog({ user }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');

  const posts = [
    {
      id: 1,
      title: 'Những câu hỏi thường gặp khi phỏng vấn React JS và đáp án (Phần 1)',
      desc: 'Tìm hiểu bộ câu hỏi phỏng vấn React JS tuyển chọn từ cơ bản đến nâng cao bao gồm Virtual DOM, State, Props, Lifecycle và Redux.',
      category: 'Kỹ thuật / React',
      author: 'Nguyễn Văn Hùng',
      role: 'Viblo Author / Software Engineer',
      date: '14/06/2022',
      readTime: '5 phút đọc',
      icon: '⚛️',
      sourceUrl: 'https://viblo.asia/p/nhung-cau-hoi-thuong-gap-khi-phong-van-react-js-va-dap-an-phan-1-E375zN035V7',
      content: `### 1. ReactJS là gì? Nó hoạt động thế nào?
* **Trả lời**: React là một thư viện JavaScript mã nguồn mở được phát triển bởi Facebook, dùng để xây dựng giao diện người dùng (UI) dạng Single Page Application (SPA). React hoạt động dựa trên cơ chế Component-driven architecture (thiết kế theo thành phần) và sử dụng luồng dữ liệu một chiều (one-way data binding).

### 2. Các tính năng chính của ReactJS là gì?
* **Trả lời**:
  - **Virtual DOM**: Bản sao nhẹ của DOM thật giúp tối ưu hóa hiệu năng cập nhật giao diện.
  - **JSX**: Cú pháp mở rộng của Javascript cho phép viết mã HTML trực tiếp trong file JS.
  - **Components**: Các khối xây dựng giao diện độc lập, có thể tái sử dụng.
  - **Unidirectional Data Flow**: Luồng dữ liệu một chiều giúp dễ kiểm soát và gỡ lỗi.

### 3. Sự khác nhau giữa State và Props là gì?
* **Trả lời**:
  - **State**: Là dữ liệu nội bộ của chính component đó, có thể thay đổi được trong suốt vòng đời của component thông qua các hàm cập nhật (như \`setState\` hoặc hàm từ \`useState\`).
  - **Props**: Viết tắt của Properties, là dữ liệu được truyền từ component cha xuống component con. Props là read-only (chỉ đọc) và component con không thể thay đổi trực tiếp giá trị của props nhận được.

### 4. Vòng đời (Lifecycle) của Component trong React
* **Trả lời**: Vòng đời của một component gồm 3 giai đoạn chính:
  - **Mounting**: Khởi tạo và đưa component vào DOM (gồm các hàm constructor, render, \`componentDidMount\` hoặc hook \`useEffect\` chạy 1 lần).
  - **Updating**: Cập nhật khi state hoặc props thay đổi (gồm các hàm render, \`componentDidUpdate\`).
  - **Unmounting**: Loại bỏ component khỏi DOM (gồm hàm \`componentWillUnmount\` để dọn dẹp bộ nhớ).`,
      seedComments: [
        { name: 'Tấn Phát', content: 'Bài viết rất chi tiết, đúng những câu hỏi kinh điển khi phỏng vấn React!', date: '16/07/2026' },
        { name: 'Minh Tuấn', content: 'Cần ôn thêm phần useEffect cleanup nữa là đủ bộ.', date: '17/07/2026' }
      ]
    },
    {
      id: 2,
      title: 'Những chú ý khi viết CV cho dân IT',
      desc: 'Tổng hợp kinh nghiệm đắt giá khi làm CV ngành công nghệ thông tin: cấu trúc chuẩn, cách mô tả kỹ năng và kinh nghiệm dự án chuyên nghiệp.',
      category: 'Kỹ năng / Viết CV',
      author: 'Đào Văn Hải',
      role: 'Viblo Author / Team Leader',
      date: '12/03/2021',
      readTime: '4 phút đọc',
      icon: '📄',
      sourceUrl: 'https://viblo.asia/p/nhung-chu-y-khi-viet-cv-cho-dan-it-Do754MOa5M6',
      content: `### Những Lưu Ý Quan Trọng Khi Viết CV IT

CV chính là chiếc vé thông hành đầu tiên giúp bạn tiếp cận nhà tuyển dụng IT. Dưới đây là những lưu ý quan trọng để viết một CV chuẩn chỉnh, thu hút và vượt qua bộ lọc hồ sơ:

---

#### 1. Tránh chấm điểm kỹ năng dạng thanh phần trăm (Progress Bar)
* Việc tự chấm điểm bản thân như "Java: 80%" hay "React: 4/5 sao" là rất thiếu cơ sở khoa học và dễ gây điểm trừ trong mắt các Senior Developer phỏng vấn bạn. Thay vào đó, hãy phân nhóm kỹ năng rõ ràng theo các mức độ:
  - **Làm chủ (Proficient / Strong)**: Kỹ năng bạn nắm cực vững và tự tin giải đáp sâu.
  - **Có kinh nghiệm (Prior Experience / Familiar)**: Các công nghệ bạn đã sử dụng trong dự án thực tế.
  - **Đang tìm hiểu (Learning / Exposure)**: Các công nghệ bạn mới tiếp cận.

#### 2. Mô tả dự án rõ ràng, có chiều sâu kỹ thuật
Đối với mỗi dự án bạn đã tham gia, hãy trình bày đủ các thông tin:
* **Mô tả dự án**: Dự án làm về sản phẩm gì, dành cho ai.
* **Số lượng thành viên**: Quy mô đội ngũ giúp nhà tuyển dụng hình dung môi trường làm việc của bạn.
* **Công nghệ sử dụng (Stack)**: Liệt kê rõ framework, thư viện chính.
* **Vai trò và Đóng góp của bạn**: Trình bày chi tiết các công việc cụ thể bạn đã giải quyết (Ví dụ: Thiết kế cơ sở dữ liệu, tối ưu hóa tốc độ load trang, viết APIs...).

#### 3. Chú ý lỗi chính tả tên công nghệ
* Đây là một lỗi rất ngớ ngẩn nhưng lại cực kỳ phổ biến. Hãy kiểm tra kỹ xem bạn viết đúng chính tả các từ khóa công nghệ chưa: Viết \`GitHub\` chứ không phải \`Github\`, \`JavaScript\` chứ không phải \`Javascript\`, \`React Native\` chứ không phải \`Reactnative\`...`,
      seedComments: [
        { name: 'Khánh Vy', content: 'Mình ghét nhất mấy CV tự chấm điểm 8/10 kỹ năng mà hỏi câu cơ bản không trả lời được.', date: '13/07/2026' },
        { name: 'Hải Đăng', content: 'Bài viết chia sẻ rất thực tế cho sinh viên chuẩn bị ra trường.', date: '14/07/2026' }
      ]
    },
    {
      id: 3,
      title: 'Tìm hiểu về quy trình ứng cứu sự cố an ninh thông tin - NIST SP 800-61',
      desc: 'Phân tích 6 bước ứng phó sự cố bảo mật theo tiêu chuẩn quốc tế giúp bạn chuẩn bị tốt cho các câu hỏi phỏng vấn SOC Analyst/DevOps.',
      category: 'Bảo mật / DevOps',
      author: 'Phạm Minh Tuấn',
      role: 'Viblo Author / Cloud Security Engineer',
      date: '28/11/2023',
      readTime: '8 phút đọc',
      icon: '🛡️',
      sourceUrl: 'https://viblo.asia/p/tim-hieu-ve-quy-trinh-ung-cuu-su-co-an-ninh-thong-tin-nist-800-61-gDDO2da8ZJ1',
      content: `### Quy Trình Ứng Cứu Sự Cố Theo Tiêu Chuẩn NIST

Tiêu chuẩn NIST SP 800-61 (Computer Security Incident Handling Guide) của Mỹ là một trong những tài liệu hướng dẫn ứng phó sự cố bảo mật uy tín và được áp dụng rộng rãi nhất trên thế giới hiện nay. Quy trình gồm 4 giai đoạn chính khép kín:

---

#### Giai đoạn 1: Preparation (Chuẩn bị)
Xây dựng chính sách bảo mật, thành lập đội ứng cứu sự cố (CSIRT), trang bị các công cụ giám sát (SIEM, EDR) và thực hiện đánh giá rủi ro định kỳ cho hệ thống.

#### Giai đoạn 2: Detection and Analysis (Phát hiện và Phân tích)
Giám sát các nguồn log sự kiện để phát hiện sớm các dấu hiệu tấn công bất thường. Phân tích các mối nguy hại để xác định loại tấn công (Phishing, Malware, DDoS...), mức độ ảnh hưởng và lập báo cáo sự cố.

#### Giai đoạn 3: Containment, Eradication, and Recovery (Cô lập, Loại bỏ & Khôi phục)
* **Containment**: Khoanh vùng, cách ly các máy chủ bị nhiễm mã độc để ngăn lây lan (cô lập mạng).
* **Eradication**: Tìm kiếm nguyên nhân gốc rễ, vá lỗ hổng bị khai thác và gỡ bỏ hoàn toàn mã độc, tài khoản trái phép.
* **Recovery**: Khôi phục hoạt động bình thường của hệ thống từ các bản sao lưu an toàn và tiếp tục giám sát chặt chẽ.

#### Giai đoạn 4: Post-Incident Activity (Rút kinh nghiệm sau sự cố)
Tổ chức họp tổng kết rút kinh nghiệm, phân tích lỗi bảo mật hệ thống và hoàn thiện lại các quy trình phòng thủ để ngăn chặn các sự cố tương tự xảy ra trong tương lai.`,
      seedComments: [
        { name: 'Thế Hùng', content: 'Quy trình chuẩn NIST là câu hỏi bắt buộc khi phỏng vấn vị trí Security Analyst.', date: '09/07/2026' }
      ]
    },
    {
      id: 4,
      title: 'Con đường thăng tiến của một Software Engineer',
      desc: 'Lộ trình chi tiết và những bài học kinh nghiệm quý giá từ khi còn là Thực tập sinh đến khi trở thành Senior/Tech Lead trong ngành công nghệ.',
      category: 'Sự nghiệp / Phát triển',
      author: 'Trần Anh Khoa',
      role: 'Viblo Author / Senior Engineer',
      date: '10/01/2024',
      readTime: '7 phút đọc',
      icon: '📈',
      sourceUrl: 'https://viblo.asia/p/con-duong-thang-tien-cua-mot-software-engineer-LNx53dOk5w3',
      content: `### Lộ Trình Thăng Tiến Trong Ngành Lập Trình

Con đường phát triển nghề nghiệp của một kỹ sư phần mềm (Software Engineer) thường trải qua các cột mốc quan trọng với sự thay đổi lớn về tư duy và trách nhiệm:

---

#### 1. Fresher / Junior Developer (Người mới bắt đầu)
* **Trọng tâm**: Phát triển kỹ năng code thuần thục, làm quen quy trình dự án (Git, Agile/Scrum).
* **Đặc điểm**: Làm việc dưới sự hướng dẫn của đàn anh (Mentor/Senior). Bạn cần tập trung rèn luyện tính cẩn thận, biết cách đặt câu hỏi và hoàn thành đúng hạn các task được giao.

#### 2. Middle Developer (Lập trình viên trung cấp)
* **Trọng tâm**: Làm chủ công nghệ, có khả năng làm việc độc lập với các module phức tạp mà không cần nhiều sự giám sát.
* **Đặc điểm**: Bắt đầu tham gia hỗ trợ thiết kế database nhỏ, viết unit tests tốt và chủ động đưa ra giải pháp giải quyết vấn đề kỹ thuật trong nhóm.

#### 3. Senior Developer (Lập trình viên cao cấp)
* **Trọng tâm**: Tư duy thiết kế hệ thống tốt, hiểu sâu về kiến trúc ứng dụng và bảo mật.
* **Đặc điểm**: Hướng dẫn (Mentoring) cho các lập trình viên ít kinh nghiệm hơn, tham gia quyết định lựa chọn công nghệ cho dự án và làm việc trực tiếp với khách hàng hoặc Product Manager để phân tích yêu cầu nghiệp vụ.`,
      seedComments: [
        { name: 'Quốc Bảo', content: 'Con đường thăng tiến đòi hỏi sự tự học liên tục, đặc biệt là nâng cao tư duy giải quyết vấn đề.', date: '06/07/2026' }
      ]
    },
    {
      id: 5,
      title: 'System Design - Thiết kế hệ thống cho hàng triệu người dùng (Phần 1)',
      desc: 'Hướng dẫn các khái niệm cơ bản về System Design bao gồm Web Server, Database, Load Balancer và Caching để mở rộng hệ thống chịu tải lớn.',
      category: 'Kiến trúc / Hệ thống',
      author: 'Lê Ngọc Long',
      role: 'Viblo Author / Solution Architect',
      date: '05/05/2024',
      readTime: '10 phút đọc',
      icon: '🖥️',
      sourceUrl: 'https://viblo.asia/p/system-design-thiet-ke-he-thong-cho-hang-trieu-nguoi-dung-phan-1-1J9537W85Wn',
      content: `### Các Bước Mở Rộng Hệ Thống Chịu Tải Lớn

Làm thế nào để thiết kế một hệ thống ban đầu phục vụ vài trăm người dùng có thể phát triển lên quy mô phục vụ hàng triệu người dùng hoạt động đồng thời? Dưới đây là lộ trình mở rộng kiến trúc hệ thống:

---

#### 1. Khởi đầu với kiến trúc Đơn giản (Single Server)
* Toàn bộ các phần tử bao gồm Web App, Database và Cache được đặt trên cùng một máy chủ. Mô hình này rất phù hợp cho giai đoạn thử nghiệm (MVP) vì chi phí rẻ và triển khai nhanh.

#### 2. Tách biệt Web Server và Database Server
* Khi lượng người dùng tăng lên, máy chủ bị nghẽn tài nguyên. Giải pháp đầu tiên là đưa cơ sở dữ liệu (Database) sang chạy trên một máy chủ vật lý riêng biệt để giải phóng CPU và RAM cho máy chủ Web.

#### 3. Sử dụng Bộ cân bằng tải (Load Balancer) để mở rộng theo chiều ngang
* Thay vì nâng cấp cấu hình máy chủ web cực mạnh rất tốn kém (Mở rộng theo chiều dọc - Vertical Scaling), chúng ta sẽ nhân bản nhiều máy chủ web chạy song song (Mở rộng theo chiều ngang - Horizontal Scaling) và đặt một Load Balancer ở phía trước để phân chia đều các request từ người dùng đến các server này.

#### 4. Sử dụng Cache (Redis / Memcached) để tăng tốc độ truy vấn
* Đưa các dữ liệu ít khi thay đổi nhưng được đọc thường xuyên (như thông tin cá nhân, cài đặt hệ thống) lưu trữ tạm thời trên bộ nhớ RAM của máy chủ Cache. Khi có request, hệ thống sẽ đọc trực tiếp từ RAM thay vì truy vấn xuống ổ đĩa Database, giúp tốc độ phản hồi nhanh hơn gấp hàng chục lần.`,
      seedComments: [
        { name: 'Anh Quân', content: 'Bài viết giải thích cực kỳ dễ hiểu, chia nhỏ từng giai đoạn phát triển hệ thống rất khoa học.', date: '03/07/2026' }
      ]
    },
    {
      id: 6,
      title: 'Đàm phán lương (Deal lương) - Làm sao cho khỏi bị hớ?',
      desc: 'Những chiến thuật đàm phán lương thực tế, cách deal lương gross/net và giữ thế chủ động khi thương lượng với phòng nhân sự (HR).',
      category: 'Kỹ năng / Đàm phán',
      author: 'Vũ Đình Cường',
      role: 'Viblo Author / HR Tech Lead',
      date: '22/02/2023',
      readTime: '6 phút đọc',
      icon: '💵',
      sourceUrl: 'https://viblo.asia/p/dam-phan-luong-deal-luong-lam-sao-cho-kho-bi-ho-3Q75wDm35Wb',
      content: `### Các Chiến Thuật Đàm Phán Lương Thực Tế

Đàm phán lương là cuộc thương lượng Win - Win giữa ứng viên và doanh nghiệp. Để đạt được mức đãi ngộ mong muốn mà vẫn giữ được ấn tượng chuyên nghiệp, bạn hãy áp dụng các nguyên tắc sau:

---

#### 1. Xác định mức lương kỳ vọng và mức lương sàn
* **Mức lương kỳ vọng**: Con số bạn mong muốn nhận được dựa trên năng lực và thị trường.
* **Mức lương sàn**: Con số tối thiểu bạn chấp nhận để duy trì cuộc sống và chuyển đổi công việc. Tuyệt đối không bao giờ deal dưới con số này.

#### 2. Phân biệt rõ Lương Gross và Lương Net
* **Lương Gross**: Tổng thu nhập của bạn trước khi trừ thuế Thu nhập cá nhân (TNCN) và các khoản bảo hiểm bắt buộc.
* **Lương Net**: Số tiền thực tế bạn nhận về tài khoản ngân hàng hàng tháng.
* **Lưu ý**: Hãy thỏa thuận rõ ràng với nhà tuyển dụng xem con số thảo luận là Gross hay Net để tránh bất ngờ khi nhận phiếu lương tháng đầu tiên.

#### 3. Sử dụng chiến thuật "Khoảng lương đề xuất" thay vì con số cứng
* Khi đưa ra đề xuất, hãy đưa ra một khoảng lương hợp lý (ví dụ: 18 - 22 triệu). Chiến thuật này giúp nhà tuyển dụng thấy bạn có tinh thần hợp tác, linh hoạt và đồng thời bảo đảm bạn vẫn nhận được con số nằm trong mong muốn tối thiểu của mình.`,
      seedComments: [
        { name: 'Ngọc Mai', content: 'Thương lượng lương là cả một nghệ thuật giao tiếp, bài viết rất thực tế!', date: '29/06/2026' }
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
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition duration-150 cursor-pointer"
            >
              ← Quay lại Blog
            </button>
            <a
              href={selectedPost.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 transition duration-150"
            >
              🌐 Đọc bài gốc trên Viblo
            </a>
          </div>

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
