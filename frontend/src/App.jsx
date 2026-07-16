import React, { useState, useEffect } from 'react';
import '@cloudscape-design/global-styles/index.css';
import {
  AppLayout,
  SideNavigation,
  Header,
  ContentLayout
} from '@cloudscape-design/components';

import Auth from './components/Auth';
import HomeDashboard from './components/HomeDashboard';
import StartInterview from './components/StartInterview';
import InterviewRoom from './components/InterviewRoom';
import InterviewerDashboard from './components/InterviewerDashboard';
import QuestionBankViewer from './components/QuestionBankViewer';
import JobsDashboard from './components/JobsDashboard';
import CVProfile from './components/CVProfile';
import Pricing from './components/Pricing';
import Blog from './components/Blog';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('candidate'); // 'candidate' or 'interviewer'
  const [activeTab, setActiveTab] = useState('home');
  const [activeSession, setActiveSession] = useState(null);
  const [recruiterTab, setRecruiterTab] = useState('live_rooms');

  useEffect(() => {
    if (user && user.role) {
      setRole(user.role);
      setActiveTab(user.role === 'interviewer' ? 'interviewer' : 'home');
    }
  }, [user]);

  const handleStartSession = (sessionInfo) => {
    setActiveSession(sessionInfo);
    setActiveTab('interview_session');
  };

  const handleLeaveSession = () => {
    setActiveSession(null);
    setActiveTab('home');
  };

  const handleStartQuickInterview = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: user?.id || '00000000-0000-0000-0000-000000000000',
          cvId: null,
          companyId: '55555555-5555-5555-5555-555555555555', // NVIDIA Vietnam
          level: 'medium'
        })
      });
      if (res.ok) {
        const sessionInfo = await res.json();
        handleStartSession({
          sessionId: sessionInfo.sessionId,
          questions: sessionInfo.questions,
          currentQuestionIndex: sessionInfo.currentQuestionIndex,
          firstQuestion: sessionInfo.firstQuestion,
          companyName: 'NVIDIA Vietnam',
          level: 'medium'
        });
      } else {
        alert('Lỗi khởi tạo phiên phỏng vấn nhanh.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối khi khởi tạo phỏng vấn.');
    }
  };

  const handleStartInterviewWithJob = async (job, actionType) => {
    if (actionType === 'analyze') {
      setActiveTab('candidate');
    } else if (actionType === 'interview') {
      try {
        const res = await fetch('http://localhost:5000/api/questions/generate-from-jd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateId: user?.id || '00000000-0000-0000-0000-000000000000',
            companyName: job.company,
            positionTitle: job.title,
            jobDescription: job.desc,
            level: job.level
          })
        });
        if (res.ok) {
          const sessionInfo = await res.json();
          handleStartSession({
            sessionId: sessionInfo.sessionId,
            questions: sessionInfo.questions,
            currentQuestionIndex: sessionInfo.currentQuestionIndex,
            firstQuestion: sessionInfo.firstQuestion,
            companyName: job.company,
            level: job.level
          });
        } else {
          alert('Không thể khởi tạo bộ câu hỏi tự động cho công việc này.');
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi kết nối khi khởi tạo phỏng vấn.');
      }
    }
  };

  // Recruiter Cloudscape Content Render
  const renderRecruiterContent = () => {
    return (
      <ContentLayout
        header={
          <Header
            variant="h1"
            description="Quản lý các chiến dịch tuyển dụng, ngân hàng đề thi và sàng lọc ứng viên thông minh."
          >
            Cổng Quản Trị Khảo Thí (Dành cho Doanh Nghiệp)
          </Header>
        }
      >
        <InterviewerDashboard interviewerId={user?.id} activeTabId={recruiterTab} onTabChange={setRecruiterTab} />
      </ContentLayout>
    );
  };

  // Candidate Custom Tailwind Content Render
  const renderCandidateContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeDashboard
            user={user}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            onStartQuickInterview={handleStartQuickInterview}
            onStartInterviewWithJob={handleStartInterviewWithJob}
          />
        );
      case 'candidate':
        return (
          <StartInterview onStartSession={handleStartSession} userId={user?.id} />
        );
      case 'question_bank':
        return (
          <QuestionBankViewer />
        );
      case 'jobs':
        return (
          <JobsDashboard onStartInterviewWithJob={handleStartInterviewWithJob} />
        );
      case 'pricing':
        return (
          <Pricing />
        );
      case 'cv_profile':
        return (
          <CVProfile userId={user?.id} />
        );
      case 'blog':
        return (
          <Blog />
        );
      case 'interview_session':
        return activeSession ? (
          <InterviewRoom session={activeSession} onLeaveSession={handleLeaveSession} />
        ) : null;
      default:
        return <div className="text-slate-500">Đang tải trang...</div>;
    }
  };

  // If user is not authenticated, render the premium Auth/Login panel
  if (!user) {
    return <Auth onLoginSuccess={(u) => setUser(u)} />;
  }

  // 1. Candidate Custom Tailwind Layout
  if (role === 'candidate') {
    return (
      <div className="flex min-h-screen bg-slate-50/50 font-sans">
        {/* Custom Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-[#f8fafc] flex flex-col justify-between p-5 flex-shrink-0 select-none">
          <div className="space-y-7">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-indigo-600/30">
                X
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 tracking-tight">
                X-Interview
              </span>
            </div>

            {/* Menu Links */}
            <nav className="space-y-1.5">
              {[
                { id: 'home', text: '🏠 Trang chủ' },
                { id: 'question_bank', text: '📖 Ngân hàng câu hỏi' },
                { id: 'candidate', text: '📹 Luyện tập phỏng vấn' },
                { id: 'jobs', text: '💼 Việc làm' },
                { id: 'pricing', text: '🏆 Gói dịch vụ' },
                { id: 'cv_profile', text: '📄 Hồ sơ CV' },
                { id: 'blog', text: '📝 Blog' }
              ].map((item) => {
                const isActive = activeTab === item.id || (item.id === 'candidate' && activeTab === 'interview_session');
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (activeTab === 'interview_session') {
                        if (confirm('Bạn có chắc chắn muốn rời khỏi phòng phỏng vấn? Tiến trình chưa hoàn tất sẽ mất.')) {
                          setActiveSession(null);
                          setActiveTab(item.id);
                        }
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50'
                        : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-800'
                    }`}
                  >
                    {item.text}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
            {/* Recruiter Workspace Box */}
            <button
              onClick={() => {
                setRole('interviewer');
                setActiveTab('interviewer');
              }}
              className="w-full text-left bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-2xl p-4 shadow-sm transition duration-150 relative overflow-hidden group"
            >
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition duration-200 transform translate-x-2 translate-y-2">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Tuyển dụng</div>
              <div className="text-sm font-bold mt-1">Dành cho Doanh nghiệp</div>
              <div className="text-[10px] text-indigo-100 mt-1 leading-relaxed">
                Phỏng vấn ứng viên với AI & giám sát phòng thi
              </div>
            </button>

            {/* User Profile info */}
            <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-lg shadow-inner select-none flex-shrink-0">
                  🍀
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="text-xs font-bold text-slate-800 truncate">{user.full_name || 'Đức Tiến'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                    setUser(null);
                    setActiveSession(null);
                    setActiveTab('home');
                    setRole('candidate');
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200/50 transition duration-150"
                title="Đăng xuất"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/10">
          <div className="max-w-6xl mx-auto">
            {renderCandidateContent()}
          </div>
        </main>
      </div>
    );
  }

  // 2. Recruiter Cloudscape Layout
  return (
    <AppLayout
      headerSelector="#top-nav-placeholder"
      navigation={
        <SideNavigation
          activeHref={activeTab === 'interviewer' ? recruiterTab : activeTab}
          header={{ href: '#', text: `X-Interview — Nhà tuyển dụng` }}
          onFollow={({ detail }) => {
            if (detail.id === 'logout') {
              if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
                setUser(null);
                setActiveSession(null);
                setActiveTab('home');
                setRole('candidate');
              }
            } else if (detail.id === 'switch_to_candidate') {
              setRole('candidate');
              setActiveTab('home');
            } else if (detail.id.startsWith('recruiter_')) {
              setActiveTab('interviewer');
              if (detail.id === 'recruiter_dashboard') setRecruiterTab('live_rooms');
              if (detail.id === 'recruiter_jobs_new') setRecruiterTab('question_banks');
              if (detail.id === 'recruiter_questions') setRecruiterTab('question_banks');
              if (detail.id === 'recruiter_candidates') setRecruiterTab('results');
            } else {
              setActiveTab(detail.id);
            }
          }}
          items={[
            { type: 'link', text: '🏢 Trang chủ Quản trị', id: 'recruiter_dashboard' },
            { type: 'link', text: '📝 Đăng tin tuyển dụng', id: 'recruiter_jobs_new' },
            { type: 'link', text: '📚 Ngân hàng câu hỏi tuyển dụng', id: 'recruiter_questions' },
            { type: 'link', text: '👥 Danh sách ứng viên', id: 'recruiter_candidates' },
            { type: 'divider' },
            { type: 'link', text: '👤 Chế độ: Ứng viên 🔄', id: 'switch_to_candidate' },
            { type: 'divider' },
            { type: 'link', text: '🚪 Đăng xuất', id: 'logout' }
          ]}
        />
      }
      content={renderRecruiterContent()}
      toolsHide={true}
    />
  );
}

export default App;
