import React from 'react';

export default function Blog() {
  const posts = [
    {
      title: '10 Câu hỏi phỏng vấn React phổ biến nhất năm 2026',
      desc: 'Tổng hợp danh sách các câu hỏi phỏng vấn kỹ thuật React (Hooks, Virtual DOM, Render performance) đi kèm hướng dẫn trả lời ghi điểm tuyệt đối với Tech Lead.',
      author: 'Nguyễn Văn A',
      role: 'Senior React Developer',
      date: '15/07/2026',
      readTime: '6 phút đọc'
    },
    {
      title: 'Mẹo viết CV thu hút ánh nhìn của nhà tuyển dụng IT chỉ trong 6 giây',
      desc: 'Hướng dẫn cách sắp xếp bố cục thông tin dự án, từ khóa công nghệ (Keywords) và cách thể hiện số liệu kết quả để vượt qua bộ lọc quét CV tự động (ATS).',
      author: 'Trần Thị B',
      role: 'HR Manager tại FPT Software',
      date: '12/07/2026',
      readTime: '5 phút đọc'
    },
    {
      title: 'Quy trình ứng cứu sự cố bảo mật theo tiêu chuẩn NIST',
      desc: 'Tìm hiểu 6 bước xử lý sự cố an ninh thông tin chuẩn quốc tế giúp bạn tự tin trả lời phỏng vấn các vị trí Security Analyst hoặc SOC Engineer.',
      author: 'Phạm Đức C',
      role: 'Security Specialist tại VCS',
      date: '08/07/2026',
      readTime: '8 phút đọc'
    }
  ];

  return (
    <div className="py-6 sm:py-8 font-sans bg-slate-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Blog Chia Sẻ Kinh Nghiệm
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 sm:mt-3">
            Cập nhật các mẹo phỏng vấn, hướng dẫn viết CV và kiến thức công nghệ thực tế hữu ích.
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto grid gap-6 lg:grid-cols-3 lg:max-w-none">
          {posts.map((post) => (
            <div key={post.title} className="flex flex-col rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white hover:shadow-md transition duration-200">
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-indigo-600">
                    Kinh nghiệm & Hướng dẫn
                  </p>
                  <a href="#" className="block mt-2" onClick={(e) => { e.preventDefault(); alert('Tính năng đọc bài viết chi tiết đang được phát triển!'); }}>
                    <p className="text-lg font-bold text-slate-900 hover:underline">{post.title}</p>
                    <p className="mt-3 text-sm text-slate-500 line-clamp-3 leading-relaxed">{post.desc}</p>
                  </a>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="inline-block h-10 w-10 rounded-full bg-indigo-50 text-center leading-10 text-lg shadow-inner select-none">
                      👤
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-bold text-slate-800">
                      {post.author}
                    </p>
                    <div className="flex space-x-1 text-xs text-slate-500 mt-0.5">
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
