import React, { useState, useEffect } from 'react';

export default function HomeDashboard({ user, onNavigateToTab, onStartQuickInterview }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const candidateId = user?.id || '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/sessions?candidateId=${candidateId}`);
        if (res.ok) {
          const data = await res.json();
          setSessions(data);
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [candidateId]);

  // Filter completed sessions
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalCount = sessions.length;
  const completedCount = completedSessions.length;

  // Average score
  const validScores = completedSessions.map(s => parseFloat(s.score)).filter(score => !isNaN(score));
  const avgScore = validScores.length > 0 
    ? (validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length).toFixed(1) 
    : "0.0";

  const stats = [
    { label: 'Tổng số phòng phỏng vấn', value: totalCount.toString(), icon: '📹' },
    { label: 'Phòng vấn đã hoàn thành', value: completedCount.toString(), icon: '✅' },
    { label: 'Đơn ứng tuyển đã gửi', value: Math.ceil(completedCount * 0.5).toString(), icon: '✉️' },
    { label: 'Điểm trung bình', value: `${avgScore}%`, icon: '📊' }
  ];

  const suggestedJobs = [
    { title: 'Trợ lý Luật sư', company: 'Công ty Luật TNHH Everest', location: 'Hà Nội', type: 'Làm việc từ xa', logo: '🏢' },
    { title: 'Luật sư cộng sự', company: 'Công ty Luật TNHH Everest', location: 'Hà Nội', type: 'Làm việc từ xa', logo: '⚖️' }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header and greeting */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Chào mừng trở lại, {user?.full_name || 'Đức Tiến'}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Đây là tổng quan về hành trình chuẩn bị phỏng vấn của bạn
          </p>
        </div>
        {/* Simple dark mode/sun placeholder to match header header */}
        <div className="text-slate-400 p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
          🌙
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 relative overflow-hidden flex flex-col justify-between h-28">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <span className="text-sm">{stat.icon}</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mt-2 z-10">{stat.value}</div>
            <div className="absolute right-0 bottom-0 w-16 h-16 rounded-full bg-slate-50 translate-x-4 translate-y-4 -z-10" />
          </div>
        ))}
      </div>

      {/* Main Grid split screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Search bar & filter selection dropdowns */}
          <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi, việc làm hoặc tài nguyên..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Tất cả danh mục</option>
              </select>
              <select className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Độ khó: Bất kỳ</option>
              </select>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-800">Hoạt động gần đây</h2>
              <button
                type="button"
                onClick={() => onNavigateToTab('question_bank')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Xem tất cả
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : completedSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-2xl shadow-inner mb-3">
                  ⏳
                </div>
                <p className="text-sm">Không có hoạt động gần đây</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày phỏng vấn</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Doanh nghiệp</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vị trí</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm số</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedSessions.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">
                          {new Date(item.created_at || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                          {item.company_name}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">
                          {item.title}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            {item.score}/10
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-indigo-600 font-semibold">
                          Hoàn thành
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Practice Promo Card (webcam simulation CTA) */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between h-64 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-105 transition duration-300 transform translate-x-4 translate-y-4">
              {/* Massive webcam SVG */}
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/></svg>
            </div>
            <div className="z-10">
              <span className="text-3xl">📹</span>
              <h2 className="text-lg font-bold mt-3">Giả lập phỏng vấn thực tế</h2>
              <p className="text-xs text-indigo-150 mt-2 leading-relaxed opacity-90">
                Trải nghiệm buổi phỏng vấn hoàn chỉnh với AI. Thực hành trả lời câu hỏi, nhận phản hồi chi tiết và tự tin hơn khi đi phỏng vấn thật.
              </p>
            </div>
            <div className="z-10 mt-4">
              <button
                type="button"
                onClick={onStartQuickInterview}
                className="bg-white hover:bg-slate-50 text-indigo-700 font-bold text-xs px-5 py-2.5 rounded-full shadow-sm shadow-indigo-900/10 hover:shadow transition duration-150"
              >
                Bắt đầu ngay →
              </button>
            </div>
          </div>

          {/* Suggested Jobs Card */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-800">Việc làm gợi ý</h2>
              <button
                type="button"
                onClick={() => onNavigateToTab('jobs')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Xem tất cả
              </button>
            </div>

            <div className="space-y-4">
              {suggestedJobs.map((job, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigateToTab('jobs')}
                  className="flex items-center justify-between p-3.5 border border-slate-150 hover:border-indigo-500 rounded-xl cursor-pointer hover:bg-slate-50/50 transition duration-150 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/50 flex items-center justify-center text-lg select-none flex-shrink-0">
                      {job.logo}
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition">{job.title}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{job.company}</div>
                      <div className="flex gap-1.5 mt-2">
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-green-50 text-green-700 rounded-full">Thỏa thuận</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-600 rounded-full">{job.type}</span>
                      </div>
                    </div>
                  </div>
                  {/* Chevron Right */}
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
