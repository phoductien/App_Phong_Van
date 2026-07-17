import React, { useState, useEffect } from 'react';

function AnimatedCounter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end) || end <= 0) return;

    const totalSteps = 60;
    const stepTime = Math.max(Math.floor(duration / totalSteps), 15);
    const increment = Math.ceil(end / totalSteps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString('vi-VN')}</span>;
}

export default function LandingPage({ onNavigateToAuth }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredBanks = [
    {
      id: 'qa_qc',
      title: 'Quản lý Kiểm soát Chất lượng Dự án (QA/QC Project Manager)',
      company: 'Công ty Cổ phần Sản xuất và Kinh doanh VinMetal',
      questions: 12,
      time: 36,
      difficulty: 'Khó',
      desc: 'Quản lý toàn diện công tác kiểm soát chất lượng dự án công nghiệp quy mô lớn theo mô hình EPC/EPCM. Trực tiếp quản lý 02 phòng: Kiểm soát chất lượng thiết kế, Kiểm soát chất lượng...',
    },
    {
      id: 'portfolio_mgr',
      title: 'Quản lý danh mục khách hàng',
      company: 'Techcombank',
      questions: 12,
      time: 30,
      difficulty: 'Trung Bình',
      desc: 'Quản lý, chăm sóc danh mục khách 150 - 200 KHUT được giao định kỳ và đánh giá hiệu quả phát triển khách hàng mới...',
    },
    {
      id: 'pricing_specialist',
      title: 'Chuyên viên định giá',
      company: 'Vietcombank',
      questions: 12,
      time: 30,
      difficulty: 'Trung Bình',
      desc: 'TT Định giá tài sản cần tuyển dụng 01 chỉ tiêu Chuyên viên định giá làm việc tại Đồn...',
    }
  ];

  const faqs = [
    {
      q: 'Viet-Interview có thực sự miễn phí không?',
      a: 'Có! Viet-Interview cung cấp gói Luyện tập Cơ bản hoàn toàn miễn phí cho tất cả mọi người, hỗ trợ tối đa 3 lượt phỏng vấn đầy đủ với AI mỗi tháng để bạn trải nghiệm và cải thiện kỹ năng.'
    },
    {
      q: 'AI chấm điểm phỏng vấn như thế nào?',
      a: 'AI sử dụng các mô hình ngôn ngữ lớn để phân tích câu trả lời của bạn theo thời gian thực. Hệ thống đánh giá dựa trên 3 trụ cột: Kiến thức chuyên môn (Technical), Kỹ năng truyền đạt (Communication) và Phong thái tự tin (Confidence) kèm lời khuyên sửa lỗi chi tiết.'
    },
    {
      q: 'Có thể luyện tập những loại phỏng vấn nào?',
      a: 'Chúng tôi cung cấp ngân hàng đề thi đa dạng cho các vị trí từ Công nghệ thông tin (Frontend, Backend, Fullstack, Mobile), Tài chính - Ngân hàng, Quản trị dự án cho đến Chăm sóc khách hàng.'
    },
    {
      q: 'Tôi có thể luyện tập bằng tiếng Việt và tiếng Anh không?',
      a: 'Hoàn toàn được! Hệ thống nhận diện giọng nói và phân tích câu trả lời hỗ trợ dịch thuật hai chiều thông minh giữa tiếng Việt và tiếng Anh, giúp bạn luyện tập phỏng vấn đa quốc gia.'
    },
    {
      q: 'Điều này khác gì so với luyện tập với bạn bè?',
      a: 'Trợ lý AI của chúng tôi hoạt động 24/7, không bao giờ phán xét và cung cấp thang điểm chấm điểm chuẩn hóa cùng câu trả lời mẫu chi tiết giúp bạn sửa đổi câu từ chính xác nhất.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans scroll-smooth overflow-x-hidden">
      {/* Dynamic Keyframes Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes floatEffect {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float {
          animation: floatEffect 5s ease-in-out infinite;
        }
        .delay-75 { animation-delay: 75ms; }
        .delay-150 { animation-delay: 150ms; }
        .delay-225 { animation-delay: 225ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-150 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-indigo-600/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              VI
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 tracking-tight group-hover:from-indigo-700 group-hover:to-indigo-900 transition-all duration-300">
              Viet-Interview
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => scrollToSection('workflow')} 
              className="relative py-1 hover:text-indigo-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all after:duration-300"
            >
              Quy trình
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="relative py-1 hover:text-indigo-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all after:duration-300"
            >
              Tính năng
            </button>
            <button 
              onClick={() => scrollToSection('featured-banks')} 
              className="relative py-1 hover:text-indigo-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all after:duration-300"
            >
              Bộ đề mẫu
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="relative py-1 hover:text-indigo-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all after:duration-300"
            >
              Hỏi đáp
            </button>
          </nav>

          {/* Auth CTA Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigateToAuth(false)} 
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => onNavigateToAuth(true)} 
              className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Đăng ký miễn phí
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text content */}
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200 animate-fade-in-up shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Trợ lý phỏng vấn AI
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight animate-fade-in-up delay-75">
              Chinh phục mọi buổi phỏng vấn <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">cùng Viet-Interview</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-150">
              Luyện tập, nhận feedback chi tiết từ AI, tự tin đi phỏng vấn thật.
            </p>
            
            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-225">
              <button 
                onClick={() => onNavigateToAuth(false)}
                className="px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 hover:scale-103 active:translate-y-0 active:scale-97 transition-all duration-300 flex items-center justify-center gap-2"
              >
                ▶ Thử phỏng vấn ngay
              </button>
              <button 
                onClick={() => onNavigateToAuth(true)}
                className="px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:-translate-y-0.5 hover:scale-103 active:translate-y-0 active:scale-97 transition-all duration-300 flex items-center justify-center gap-1"
              >
                Đăng ký miễn phí <span className="ml-1">→</span>
              </button>
            </div>

            {/* Ratings and reviews */}
            <div className="flex items-center gap-4 justify-center lg:justify-start pt-4 animate-fade-in-up delay-300">
              <div className="flex -space-x-2.5">
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover hover:scale-110 hover:z-10 transition-transform duration-200" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover hover:scale-110 hover:z-10 transition-transform duration-200" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover hover:scale-110 hover:z-10 transition-transform duration-200" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover hover:scale-110 hover:z-10 transition-transform duration-200" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="avatar" />
              </div>
              <div>
                <div className="flex items-center text-amber-500 gap-0.5 text-sm font-bold">
                  ⭐⭐⭐⭐⭐ <span className="text-slate-800 ml-1">4.9</span>
                </div>
                <div className="text-xs text-slate-500 font-semibold">10,000+ Lượt luyện tập</div>
              </div>
            </div>
          </div>

          {/* Right Floating Image Graphic */}
          <div className="relative flex justify-center animate-scale-in animate-float">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-2xl animate-pulse"></div>
            <img 
              src="/landing_hero.png" 
              alt="Viet-Interview Dashboard Mockup" 
              className="relative max-w-full h-auto rounded-2xl shadow-2xl border border-slate-200 transition-all duration-300 hover:shadow-indigo-500/10"
            />
          </div>
        </div>
      </section>


      {/* 4. Stat Grid Counters */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { numeric: 20000, label: 'Câu hỏi' },
            { numeric: 10000, label: 'Lượt luyện tập' },
            { numeric: 35000, label: 'Việc làm' },
            { numeric: 157, label: 'Top công ty' }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1 group cursor-pointer">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 group-hover:scale-110 group-hover:text-indigo-800 transition-all duration-300">
                <AnimatedCounter target={stat.numeric} />+
              </div>
              <div className="text-sm font-semibold text-slate-400 group-hover:text-slate-600 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Workflow steps (#workflow) */}
      <section id="workflow" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              CÁCH HOẠT ĐỘNG
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Quy trình luyện phỏng vấn</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Luyện tập, nhận feedback chi tiết từ AI, tự tin đi phỏng vấn thật
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {/* Step 1 */}
            <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-3 hover:border-indigo-300 hover:bg-gradient-to-b hover:from-white hover:to-indigo-50/20 transition-all duration-300 flex flex-col justify-between items-center text-center gap-6 relative cursor-pointer">
              <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                01
              </div>
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                💼
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Chọn vị trí mục tiêu</h3>
                <p className="text-sm text-slate-500">
                  Lựa chọn vị trí công việc bạn muốn ứng tuyển để hệ thống xây dựng bộ câu hỏi phù hợp với lĩnh vực và cấp độ của bạn.
                </p>
              </div>
              <button 
                onClick={() => scrollToSection('featured-banks')}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                Khám phá bộ phỏng vấn →
              </button>
            </div>

            {/* Step 2 */}
            <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-3 hover:border-indigo-300 hover:bg-gradient-to-b hover:from-white hover:to-indigo-50/20 transition-all duration-300 flex flex-col justify-between items-center text-center gap-6 relative cursor-pointer">
              <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                02
              </div>
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                🎙️
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Luyện tập với AI</h3>
                <p className="text-sm text-slate-500">
                  Trả lời câu hỏi và nhận góp ý tức thì từ AI một cách khách quan nhất.
                </p>
              </div>
              <button 
                onClick={() => onNavigateToAuth(false)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                Thử phỏng vấn ngay →
              </button>
            </div>

            {/* Step 3 */}
            <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-3 hover:border-indigo-300 hover:bg-gradient-to-b hover:from-white hover:to-indigo-50/20 transition-all duration-300 flex flex-col justify-between items-center text-center gap-6 relative cursor-pointer">
              <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                03
              </div>
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                📈
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Nhận đánh giá chi tiết</h3>
                <p className="text-sm text-slate-500">
                  Xem điểm số và nhận xét cụ thể cho từng phần trả lời, từ đó xác định điểm mạnh và kỹ năng cần cải thiện.
                </p>
              </div>
              <button 
                onClick={() => onNavigateToAuth(true)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                Đăng ký miễn phí →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Features Grid (#features) */}
      <section id="features" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              CHÚNG TÔI CUNG CẤP
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Mọi thứ bạn cần để chinh phục buổi phỏng vấn</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Từ luyện tập không giới hạn đến feedback từ bạn bè — nền tảng của chúng tôi hỗ trợ mọi bước trong hành trình chuẩn bị phỏng vấn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '🌐', title: 'Luyện phỏng vấn thử online không giới hạn', desc: 'Luyện tập bao nhiêu buổi phỏng vấn thử online tùy thích, mọi lúc, mọi nơi.' },
              { emoji: '🛡️', title: 'Xây dựng sự tự tin dưới áp lực phỏng vấn thực', desc: 'Chúng tôi ghi lại câu trả lời để tạo điều kiện áp lực phỏng vấn thực tế, giúp bạn thể hiện tốt nhất.' },
              { emoji: '🔄', title: 'Tự đánh giá để tự cải thiện', desc: 'Xem lại và phân tích các buổi phỏng vấn để tinh chỉnh cách trình bày và cải thiện mọi câu trả lời.' },
              { emoji: '🛠️', title: 'Chuẩn bị phỏng vấn tùy chỉnh', desc: 'Tùy chỉnh buổi phỏng vấn thử với câu hỏi theo ngành nghề và vị trí cụ thể.' },
              { emoji: '📈', title: 'Nâng cấp kỹ năng phỏng vấn', desc: 'Truy cập tài liệu chuẩn bị phỏng vấn được chuyên gia tuyển chọn để luôn dẫn đầu.' },
              { emoji: '👥', title: 'Cải thiện với feedback từ bạn bè', desc: 'Chia sẻ buổi phỏng vấn thử với mentor, tư vấn nghề nghiệp hoặc bạn bè để nhận góp ý quý giá.' }
            ].map((feat, idx) => (
              <div 
                key={idx} 
                className="space-y-3 p-6 rounded-2xl border border-transparent hover:border-indigo-150 hover:bg-slate-50/70 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl group-hover:scale-120 group-hover:rotate-6 transition-transform duration-300 inline-block">{feat.emoji}</div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{feat.title}</h3>
                <p className="text-sm text-slate-600">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={() => onNavigateToAuth(false)}
              className="px-8 py-4 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 hover:scale-103 active:scale-97 active:translate-y-0 transition-all duration-300"
            >
              ▶ Bắt đầu luyện tập ngay
            </button>
          </div>
        </div>
      </section>

      {/* 7. Featured Question Banks (#featured-banks) */}
      <section id="featured-banks" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              BỘ PHÒNG VẤN NỔI BẬT
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Danh sách bộ phỏng vấn nổi bật</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Khám phá những bộ phỏng vấn tuyển chọn theo từng vị trí và bắt đầu luyện tập với tình huống thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Large Card (VinMetal) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer group">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-extrabold text-xl flex-shrink-0 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    VM
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg sm:text-xl text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">{featuredBanks[0].title}</h3>
                    <p className="text-sm text-slate-500 font-semibold">{featuredBanks[0].company}</p>
                  </div>
                </div>

                <div className="flex gap-6 text-xs font-bold text-slate-500 border-y border-slate-100 py-3">
                  <div><span className="text-slate-800">{featuredBanks[0].questions}</span> CÂU HỎI</div>
                  <div><span className="text-slate-800">{featuredBanks[0].time}</span> PHÚT</div>
                  <div>ĐỘ KHÓ: <span className="text-red-500">{featuredBanks[0].difficulty}</span></div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100 group-hover:bg-slate-100/50 transition-colors">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">📝 MÔ TẢ CÔNG VIỆC</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{featuredBanks[0].desc}</p>
                </div>
              </div>

              <button 
                onClick={() => onNavigateToAuth(false)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Bắt đầu luyện tập →
              </button>
            </div>

            {/* Right side two cards */}
            <div className="flex flex-col gap-8">
              {featuredBanks.slice(1).map(bank => (
                <div 
                  key={bank.id} 
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between gap-4 flex-1 cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-extrabold text-lg flex-shrink-0 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        {bank.id === 'portfolio_mgr' ? 'TC' : 'VC'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug truncate group-hover:text-indigo-600 transition-colors">{bank.title}</h4>
                        <p className="text-xs text-slate-500 font-medium truncate">{bank.company}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 text-[10px] font-bold text-slate-500 py-1 border-y border-slate-50">
                      <div><span>{bank.questions}</span> CÂU HỎI</div>
                      <div><span>{bank.time}</span> PHÚT</div>
                      <div>ĐỘ KHÓ: <span className="text-amber-500">{bank.difficulty}</span></div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg space-y-1 text-xs group-hover:bg-slate-100/50 transition-colors">
                      <div className="font-bold text-slate-400">📝 MÔ TẢ CÔNG VIỆC</div>
                      <p className="text-slate-600 leading-relaxed truncate">{bank.desc}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => onNavigateToAuth(false)}
                    className="w-full py-2.5 border border-slate-200 hover:border-indigo-600 text-slate-700 hover:text-indigo-600 font-bold text-xs rounded-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    Bắt đầu luyện tập →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section (#faq) */}
      <section id="faq" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-slate-900">Câu hỏi thường gặp</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-all duration-200 ${isOpen ? 'shadow-sm border-indigo-200' : ''}`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-slate-800 bg-slate-50 hover:bg-slate-100/40 transition-colors duration-200"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-lg text-indigo-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>{isOpen ? '−' : '+'}</span>
                  </button>
                  <div 
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{ 
                      maxHeight: isOpen ? '200px' : '0px',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className="px-5 py-4 bg-white text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA Section */}
      <section className="py-20 bg-gradient-to-tr from-indigo-500/10 via-violet-500/5 to-purple-500/10 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200 shadow-sm animate-pulse">
            ⚡ Miễn phí 100% để bắt đầu
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 leading-tight">
            Bắt đầu luyện tập ngay hôm nay và nhận việc mơ ước
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Thử công cụ phỏng vấn thử miễn phí ngay hôm nay. Bắt đầu luyện tập và cải thiện kỹ năng ngay lập tức.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigateToAuth(true)}
              className="px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 hover:scale-103 active:scale-97 transition-all duration-300"
            >
              Đăng ký — Miễn phí →
            </button>
            <button
              onClick={() => onNavigateToAuth(false)}
              className="px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:-translate-y-0.5 hover:scale-103 active:scale-97 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-base">👤</span> Tiếp tục với Google
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-indigo-700 pt-4">
            <div className="hover:scale-105 transition-transform duration-200">✔ Miễn phí</div>
            <div className="hover:scale-105 transition-transform duration-200">✔ AI đánh giá sau phỏng vấn</div>
            <div className="hover:scale-105 transition-transform duration-200">✔ 20,000+ câu hỏi</div>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-slate-900 text-slate-500 text-xs py-8 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p>© 2026 Viet-Interview. Bảo lưu mọi quyền.</p>
          <p className="text-slate-600">Phát triển bởi Đội ngũ kỹ sư HKT Software.</p>
        </div>
      </footer>
    </div>
  );
}
