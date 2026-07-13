import React, { useState } from 'react';
import '@cloudscape-design/global-styles/index.css';
import {
  AppLayout,
  SideNavigation,
  Header,
  SpaceBetween,
  Button,
  BreadcrumbGroup,
  ContentLayout,
  Container,
  Box
} from '@cloudscape-design/components';

import Auth from './components/Auth';
import HomeDashboard from './components/HomeDashboard';
import StartInterview from './components/StartInterview';
import InterviewRoom from './components/InterviewRoom';
import InterviewerDashboard from './components/InterviewerDashboard';
import QuestionBankViewer from './components/QuestionBankViewer';
import JobsDashboard from './components/JobsDashboard';
import CVProfile from './components/CVProfile';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSession, setActiveSession] = useState(null);

  const navigationItems = [
    { type: 'link', text: '🏠 Trang chủ', id: 'home' },
    { type: 'link', text: '📖 Ngân hàng câu hỏi', id: 'question_bank' },
    { type: 'link', text: '📹 Luyện tập phỏng vấn', id: 'candidate' },
    { type: 'link', text: '💼 Việc làm', id: 'jobs' },
    { type: 'link', text: '📄 Hồ sơ CV', id: 'cv_profile' },
    { type: 'divider' },
    { type: 'link', text: '🏢 Dành cho Doanh nghiệp', id: 'interviewer' },
    { type: 'divider' },
    { type: 'link', text: '🚪 Đăng xuất', id: 'logout' }
  ];

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
          candidateId: '00000000-0000-0000-0000-000000000000',
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
        const res = await fetch('http://localhost:5000/api/sessions/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateId: '00000000-0000-0000-0000-000000000000',
            cvId: null,
            companyId: job.companyId,
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
          alert('Không tìm thấy bộ đề phù hợp cho công ty này.');
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi kết nối khi khởi tạo phỏng vấn.');
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ContentLayout
            header={
              <Header
                variant="h1"
                description={`Xin chào ${user?.full_name || 'Ứng viên'}, hệ thống giả lập phỏng vấn và đánh giá năng lực lập trình bằng trí tuệ nhân tạo.`}
              >
                Trang Chủ
              </Header>
            }
          >
            <HomeDashboard
              onNavigateToTab={(tabId) => setActiveTab(tabId)}
              onStartQuickInterview={handleStartQuickInterview}
            />
          </ContentLayout>
        );
      case 'candidate':
        return (
          <ContentLayout
            header={
              <Header
                variant="h1"
                description="Luyện tập phỏng vấn thử với các vị trí công việc thực tế cùng AI."
              >
                Luyện Tập Phỏng Vấn
              </Header>
            }
          >
            <StartInterview onStartSession={handleStartSession} userId={user?.id} />
          </ContentLayout>
        );
      case 'question_bank':
        return (
          <ContentLayout
            header={
              <Header
                variant="h1"
                description="Luyện tập từng câu hỏi phỏng vấn từ Ngân hàng câu hỏi cùng AI để chuẩn bị tốt nhất."
              >
                Ngân Hàng Câu Hỏi
              </Header>
            }
          >
            <QuestionBankViewer />
          </ContentLayout>
        );
      case 'jobs':
        return (
          <ContentLayout
            header={
              <Header
                variant="h1"
                description="Tìm kiếm cơ hội và luyện phỏng vấn trực tiếp theo vị trí tuyển dụng thực tế."
              >
                Việc Làm
              </Header>
            }
          >
            <JobsDashboard onStartInterviewWithJob={handleStartInterviewWithJob} />
          </ContentLayout>
        );
      case 'cv_profile':
        return (
          <ContentLayout
            header={
              <Header
                variant="h1"
                description="Tải lên và chuẩn bị hồ sơ CV để so sánh với JD của nhà tuyển dụng."
              >
                Quản Lý Hồ Sơ
              </Header>
            }
          >
            <CVProfile userId={user?.id} />
          </ContentLayout>
        );
      case 'interviewer':
        return (
          <ContentLayout
            header={
              <Header
                variant="h1"
                description="Tạo và thiết lập bộ đề thi 10 câu hỏi xoay vòng cho từng vị trí/công ty."
              >
                Cổng Quản Trị Khảo Thí (Dành cho Doanh Nghiệp)
              </Header>
            }
          >
            <InterviewerDashboard interviewerId={user?.id} />
          </ContentLayout>
        );
      case 'interview_session':
        return (
          <ContentLayout
            header={
              <Header variant="h1" description="Đang phỏng vấn trực tiếp cùng X-Interview AI Bot.">
                Phòng Phỏng Vấn AI
              </Header>
            }
          >
            {activeSession && (
              <InterviewRoom session={activeSession} onLeaveSession={handleLeaveSession} />
            )}
          </ContentLayout>
        );
      default:
        return <div>Chọn chức năng bên menu trái.</div>;
    }
  };

  // If user is not authenticated, render the premium Auth/Login panel
  if (!user) {
    return <Auth onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <AppLayout
      headerSelector="#top-nav-placeholder"
      navigation={
        <SideNavigation
          activeHref={activeTab}
          header={{ href: '#', text: `X-Interview — ${user.full_name || 'User'}` }}
          onFollow={({ detail }) => {
            if (detail.id === 'logout') {
              if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
                setUser(null);
                setActiveSession(null);
                setActiveTab('home');
              }
            } else if (activeTab === 'interview_session') {
              if (confirm('Bạn có chắc chắn muốn rời khỏi phòng phỏng vấn? Tiến trình chưa hoàn tất sẽ mất.')) {
                setActiveSession(null);
                setActiveTab(detail.id);
              }
            } else {
              setActiveTab(detail.id);
            }
          }}
          items={navigationItems}
        />
      }
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Trang chủ', href: '#' },
            { 
              text: activeTab === 'home'
                ? 'Tổng quan'
                : activeTab === 'candidate' 
                  ? 'Phòng phỏng vấn' 
                  : activeTab === 'jobs' 
                    ? 'Tìm việc'
                    : activeTab === 'cv_profile'
                      ? 'Tài liệu'
                      : 'Chi tiết',
              href: '#' 
            }
          ]}
        />
      }
      content={renderContent()}
      toolsHide={true}
    />
  );
}

export default App;
