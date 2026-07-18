import React, { useState, useEffect, lazy, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import '@cloudscape-design/global-styles/index.css';
import {
  AppLayout,
  SideNavigation,
  Header,
  ContentLayout,
  Spinner
} from '@cloudscape-design/components';

const Auth = lazy(() => import('./components/Auth'));
const HomeDashboard = lazy(() => import('./components/HomeDashboard'));
const StartInterview = lazy(() => import('./components/StartInterview'));
const InterviewRoom = lazy(() => import('./components/InterviewRoom'));
const InterviewerDashboard = lazy(() => import('./components/InterviewerDashboard'));
const QuestionBankViewer = lazy(() => import('./components/QuestionBankViewer'));
const JobsDashboard = lazy(() => import('./components/JobsDashboard'));
const CVProfile = lazy(() => import('./components/CVProfile'));
const Pricing = lazy(() => import('./components/Pricing'));
const Blog = lazy(() => import('./components/Blog'));
const LandingPage = lazy(() => import('./components/LandingPage'));

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

let supabase = null;
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Supabase init error in App.jsx:", err.message);
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('candidate'); // 'candidate' or 'interviewer'
  const [activeTab, setActiveTab] = useState('home');
  const [activeSession, setActiveSession] = useState(null);
  const [recruiterTab, setRecruiterTab] = useState('live_rooms');
  const [showAuth, setShowAuth] = useState(false);
  const [authInitialSignUp, setAuthInitialSignUp] = useState(false);
  const [authPortal, setAuthPortal] = useState('candidate'); // 'candidate' or 'recruiter'

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/auth/recruiter')) {
        setShowAuth(true);
        setAuthPortal('recruiter');
        if (hash.includes('signup=true')) {
          setAuthInitialSignUp(true);
        } else {
          setAuthInitialSignUp(false);
        }
      } else if (hash.startsWith('#/auth')) {
        setShowAuth(true);
        setAuthPortal('candidate');
        if (hash.includes('signup=true')) {
          setAuthInitialSignUp(true);
        } else {
          setAuthInitialSignUp(false);
        }
      } else {
        setShowAuth(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    // Check active session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        const fullName = metadata.full_name || metadata.name || session.user.email.split('@')[0];
        
        const oauthPortal = localStorage.getItem('oauth_login_portal');
        let resolvedRole = 'candidate';
        if (oauthPortal) {
          resolvedRole = oauthPortal === 'recruiter' ? 'interviewer' : 'candidate';
        } else {
          resolvedRole = metadata.role === 'interviewer' ? 'interviewer' : 'candidate';
        }

        if (metadata.role !== resolvedRole) {
          supabase.auth.updateUser({ data: { role: resolvedRole } });
        }

        setTimeout(() => {
          localStorage.removeItem('oauth_login_portal');
        }, 1000);

        setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: fullName,
          role: resolvedRole
        });
      }
    });

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        const fullName = metadata.full_name || metadata.name || session.user.email.split('@')[0];
        
        const oauthPortal = localStorage.getItem('oauth_login_portal');
        let resolvedRole = 'candidate';
        if (oauthPortal) {
          resolvedRole = oauthPortal === 'recruiter' ? 'interviewer' : 'candidate';
        } else {
          resolvedRole = metadata.role === 'interviewer' ? 'interviewer' : 'candidate';
        }

        if (metadata.role !== resolvedRole) {
          supabase.auth.updateUser({ data: { role: resolvedRole } });
        }

        setTimeout(() => {
          localStorage.removeItem('oauth_login_portal');
        }, 1000);

        setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: fullName,
          role: resolvedRole
        });
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT') {
          window.location.hash = '#/auth';
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [prevUserExist, setPrevUserExist] = useState(false);

  useEffect(() => {
    if (user && user.role) {
      setRole(prevRole => {
        if (prevRole !== user.role || !prevUserExist) {
          setActiveTab(user.role === 'interviewer' ? 'interviewer' : 'home');
        }
        return user.role;
      });
      setPrevUserExist(true);
    } else {
      setPrevUserExist(false);
    }
  }, [user, prevUserExist]);

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
      const res = await fetch(`${API_BASE}/api/sessions/start`, {
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
        const res = await fetch(`${API_BASE}/api/questions/generate-from-jd`, {
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
          <StartInterview onStartSession={handleStartSession} user={user} userId={user?.id} />
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
          <Pricing user={user} onUpgradeTier={(newTier) => setUser(prev => ({ ...prev, tier: newTier }))} />
        );
      case 'cv_profile':
        return (
          <CVProfile userId={user?.id} user={user} />
        );
      case 'blog':
        return (
          <Blog user={user} />
        );
      case 'interview_session':
        return activeSession ? (
          <InterviewRoom user={user} session={activeSession} onLeaveSession={handleLeaveSession} />
        ) : null;
      default:
        return <div className="text-slate-500">Đang tải trang...</div>;
    }
  };

  if (!user) {
    return (
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spinner size="large" /></div>}>
        {showAuth ? (
          <Auth 
            onLoginSuccess={(u) => setUser(u)} 
            initialSignUp={authInitialSignUp}
            onBackToLanding={() => { window.location.hash = '#/'; }}
            portal={authPortal}
          />
        ) : (
          <LandingPage 
            onNavigateToAuth={(isSignUp, isRecruiter) => {
              if (isRecruiter) {
                window.location.hash = isSignUp ? '#/auth/recruiter?signup=true' : '#/auth/recruiter';
              } else {
                window.location.hash = isSignUp ? '#/auth?signup=true' : '#/auth';
              }
            }}
          />
        )}
      </Suspense>
    );
  }

  // 1. Candidate Custom Tailwind Layout
  if (role === 'candidate') {
    return (
      <div className="flex min-h-screen bg-slate-50/50 font-sans">
        {/* Custom Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-[#f8fafc] flex flex-col justify-between p-5 flex-shrink-0 select-none">
          <div className="space-y-7">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shadow-indigo-600/30">
                VI
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 tracking-tight">
                Viet-Interview
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


            {/* User Profile info */}
            <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-lg shadow-inner select-none flex-shrink-0">
                  🍀
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1.5">
                    {user?.full_name || 'Đức Tiến'}
                    {user?.tier === 'pro' && (
                      <span className="px-1.5 py-0.5 text-[8px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md tracking-wider uppercase shadow-sm">Pro</span>
                    )}
                    {user?.tier === 'enterprise' && (
                      <span className="px-1.5 py-0.5 text-[8px] font-extrabold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md tracking-wider uppercase shadow-sm">Enterprise</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                    if (supabase) {
                      supabase.auth.signOut();
                    }
                    setUser(null);
                    setActiveSession(null);
                    setActiveTab('home');
                    setRole('candidate');
                    window.location.hash = '#/auth';
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
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><Spinner size="large" /></div>}>
              <div className={activeTab === 'home' ? '' : 'hidden'}>
                <HomeDashboard
                  user={user}
                  onNavigateToTab={(tabId) => setActiveTab(tabId)}
                  onStartQuickInterview={handleStartQuickInterview}
                  onStartInterviewWithJob={handleStartInterviewWithJob}
                />
              </div>
              <div className={activeTab === 'candidate' ? '' : 'hidden'}>
                <StartInterview onStartSession={handleStartSession} user={user} userId={user?.id} />
              </div>
              <div className={activeTab === 'question_bank' ? '' : 'hidden'}>
                <QuestionBankViewer />
              </div>
              <div className={activeTab === 'jobs' ? '' : 'hidden'}>
                <JobsDashboard onStartInterviewWithJob={handleStartInterviewWithJob} />
              </div>
              <div className={activeTab === 'pricing' ? '' : 'hidden'}>
                <Pricing user={user} onUpgradeTier={(newTier) => setUser(prev => ({ ...prev, tier: newTier }))} />
              </div>
              <div className={activeTab === 'cv_profile' ? '' : 'hidden'}>
                <CVProfile userId={user?.id} user={user} />
              </div>
              <div className={activeTab === 'blog' ? '' : 'hidden'}>
                <Blog user={user} />
              </div>
              {activeTab === 'interview_session' && activeSession && (
                <InterviewRoom user={user} session={activeSession} onLeaveSession={handleLeaveSession} />
              )}
            </Suspense>
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
          header={{ href: '#', text: `Viet-Interview — Nhà tuyển dụng` }}
          onFollow={({ detail }) => {
            if (detail.id === 'logout') {
              if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
                if (supabase) {
                  supabase.auth.signOut();
                }
                setUser(null);
                setActiveSession(null);
                setActiveTab('home');
                setRole('candidate');
                window.location.hash = '#/auth';
              }
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
            { type: 'link', text: '🚪 Đăng xuất', id: 'logout' }
          ]}
        />
      }
      content={
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><Spinner size="large" /></div>}>
          {renderRecruiterContent()}
        </Suspense>
      }
      toolsHide={true}
    />
  );
}

export default App;
