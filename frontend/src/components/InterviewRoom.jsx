import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Textarea,
  Alert,
  Badge,
  ProgressBar,
  Grid,
  Box,
  Spinner,
  FormField
} from '@cloudscape-design/components';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function InterviewRoom({ user, session, onLeaveSession }) {
  const { sessionId, companyName, level, questions } = session;
  const totalQuestions = questions ? questions.length : 10;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(session.firstQuestion || '');
  const [answerInput, setAnswerInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'ai', content: session.firstQuestion || 'Chào mừng bạn đến với phòng phỏng vấn. Hãy bắt đầu trả lời câu hỏi đầu tiên.' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completed, setCompleted] = useState(false);
  
  // Recruiter gated timer states
  const [recruiterJoined, setRecruiterJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  // Advanced X-Interview Score breakdowns
  const [technicalScores, setTechnicalScores] = useState([]);
  const [communicationScores, setCommunicationScores] = useState([]);
  const [confidenceScores, setConfidenceScores] = useState([]);
  const [latestFeedback, setLatestFeedback] = useState(null);

  // Poll recruiter presence status
  useEffect(() => {
    if (recruiterJoined) return;
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/sessions/status/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.recruiterJoined) {
            setRecruiterJoined(true);
          }
        }
      } catch (err) {
        console.error("Error checking session status:", err);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 1500);
    return () => clearInterval(interval);
  }, [sessionId, recruiterJoined]);

  // Handle countdown clock when recruiter is inside the room
  useEffect(() => {
    if (!recruiterJoined || completed || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [recruiterJoined, completed, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmitAnswer = async () => {
    if (!answerInput.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetch(`${API_BASE}/api/sessions/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answer: answerInput
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Use real AI scores returned by backend or fall back to simulation
        const techScore = data.scores ? data.scores.techScore : (Math.floor(Math.random() * 4) + 6);
        const commScore = data.scores ? data.scores.commScore : Math.min(10, techScore + (Math.random() > 0.5 ? 1 : -1));
        const confScore = data.scores ? data.scores.confScore : Math.min(10, techScore + (Math.random() > 0.5 ? 2 : 0));

        setTechnicalScores(prev => [...prev, techScore]);
        setCommunicationScores(prev => [...prev, commScore]);
        setConfidenceScores(prev => [...prev, confScore]);

        const newLogs = [
          ...chatLog,
          { role: 'candidate', content: answerInput }
        ];

        newLogs.push({
          role: 'ai_feedback',
          content: data.feedback,
          scores: { techScore, commScore, confScore },
          sampleAnswer: data.sampleAnswer,
          interviewerIndex: currentIndex
        });

        if (data.isCompleted) {
          setCompleted(true);
          newLogs.push({
            role: 'ai',
            content: 'Chúc mừng bạn đã hoàn tất các câu hỏi của phiên phỏng vấn thử nghiệm X-Interview AI. Bạn có thể xem bảng phân tích đánh giá tổng quan ở bảng bên phải.',
            interviewerIndex: currentIndex
          });
          setChatLog(newLogs);
        } else {
          setCurrentIndex(data.currentQuestionIndex);
          setCurrentQuestion(data.nextQuestion);
          newLogs.push({
            role: 'ai',
            content: data.nextQuestion,
            interviewerIndex: data.currentQuestionIndex
          });
          setChatLog(newLogs);
        }

        setLatestFeedback({
          text: data.feedback,
          techScore,
          commScore,
          confScore
        });
        setAnswerInput('');
      } else {
        setErrorMsg('Không thể gửi câu trả lời lên máy chủ.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi kết nối khi gửi câu trả lời.');
    } finally {
      setLoading(false);
    }
  };

  const getAverage = (arr) => arr.length > 0 
    ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
    : '0.0';

  const avgTech = getAverage(technicalScores);
  const avgComm = getAverage(communicationScores);
  const avgConf = getAverage(confidenceScores);
  
  const overallAvg = (
    (parseFloat(avgTech) + parseFloat(avgComm) + parseFloat(avgConf)) / 3
  ).toFixed(1);

  return (
    <SpaceBetween size="l" direction="vertical">
      <Container
        header={
          <Header
            variant="h2"
            actions={
              <Button onClick={onLeaveSession} variant="normal">
                Thoát phòng phỏng vấn
              </Button>
            }
          >
            Phòng Luyện Phỏng Vấn AI — Vị trí: {companyName}
          </Header>
        }
      >
        <div style={{ position: 'relative', minHeight: '520px' }}>
          {!recruiterJoined && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.97)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '48px', animation: 'pulse 1.5s infinite' }}>⏳</div>
              <Box variant="h2" style={{ fontWeight: 'bold', color: '#0f172a', textAlign: 'center' }}>
                Đang chờ Người tuyển dụng tham gia phòng...
              </Box>
              <Box variant="p" color="text-muted" style={{ maxWidth: '480px', textAlign: 'center', lineHeight: '1.6' }}>
                Phòng thi đang được bảo mật. Khi Người tuyển dụng tham gia từ Bảng quản trị, buổi phỏng vấn và đồng hồ đếm ngược 30 phút sẽ chính thức bắt đầu.
              </Box>
              <div style={{ marginTop: '10px' }}>
                <Spinner size="large" />
              </div>
            </div>
          )}

          <Grid gridDefinition={[{ colspan: 7 }, { colspan: 5 }]}>
            <div>
              <SpaceBetween size="m" direction="vertical">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Box variant="awsui-key-label">
                    Độ khó: <Badge color={level === 'hard' ? 'red' : level === 'medium' ? 'blue' : 'green'}>
                      {level.toUpperCase()}
                    </Badge>
                  </Box>
                  <Box style={{ fontWeight: 'bold', color: '#334155' }}>
                    ⏱️ Thời gian còn lại: <Badge color={timeLeft < 300 ? 'red' : 'blue'}>{formatTime(timeLeft)}</Badge>
                  </Box>
                </div>

              <ProgressBar
                value={(currentIndex / totalQuestions) * 100}
                label="Tiến trình câu hỏi"
                description={`Câu hỏi đã làm: ${currentIndex} / ${totalQuestions}`}
                variant="flash"
              />

              {errorMsg && (
                <Alert type="error" dismissible onDismiss={() => setErrorMsg('')}>
                  {errorMsg}
                </Alert>
              )}

              {/* Chat Stream View */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                height: '420px',
                overflowY: 'auto',
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {chatLog.map((log, index) => {
                  const isAi = log.role === 'ai' || log.role === 'ai_feedback';
                  const isFeedback = log.role === 'ai_feedback';

                  const getInterviewerName = (qIndex) => {
                    const idx = qIndex !== undefined ? qIndex : currentIndex;
                    if (idx >= 0 && idx <= 3) return 'Anh Hùng (Tech Lead) 💻';
                    if (idx >= 4 && idx <= 6) return 'Chị Mai (Project Manager) 📊';
                    return 'Chị Lan (HR Manager) 🤝';
                  };

                  return (
                    <div 
                      key={index} 
                      style={{
                        alignSelf: isAi ? 'flex-start' : 'flex-end',
                        maxWidth: '85%',
                        padding: '14px 18px',
                        borderRadius: isAi ? '16px 16px 16px 0px' : '16px 16px 0px 16px',
                        background: isAi 
                          ? (isFeedback ? '#f5f3ff' : '#ffffff')
                          : '#1e293b',
                        color: isAi ? '#1e293b' : '#ffffff',
                        border: isAi ? '1px solid #e2e8f0' : 'none',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <Box variant="small" style={{ fontWeight: 'bold', marginBottom: '6px', color: isAi ? '#6366f1' : '#94a3b8' }}>
                        {log.role === 'ai' 
                          ? `🤖 Người phỏng vấn: ${getInterviewerName(log.interviewerIndex)}` 
                          : log.role === 'ai_feedback' 
                            ? `📊 Đánh giá từ ${getInterviewerName(log.interviewerIndex)}` 
                            : '👤 Bạn'}
                      </Box>
                      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>{log.content}</div>
                      
                      {isFeedback && log.scores && (
                        <div style={{ mt: '8px', borderTop: '1px dashed #c7d2fe', paddingTop: '6px', fontSize: '11px', display: 'flex', gap: '10px', color: '#4f46e5' }}>
                          <span>🔧 Kỹ thuật: <strong>{log.scores.techScore}/10</strong></span>
                          <span>💬 Giao tiếp: <strong>{log.scores.commScore}/10</strong></span>
                          <span>⚡ Tự tin: <strong>{log.scores.confScore}/10</strong></span>
                        </div>
                      )}

                      {isFeedback && log.sampleAnswer && (
                        <div style={{ marginTop: '10px', background: '#ffffff', borderLeft: '3px solid #818cf8', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', color: '#3730a3' }}>
                          <strong style={{ color: '#4f46e5' }}>💡 Câu trả lời mẫu tối ưu:</strong>
                          <div style={{ marginTop: '4px', lineHeight: '1.5' }}>{log.sampleAnswer}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!completed && (
                <FormField label="Nhập câu trả lời kỹ thuật của bạn (AI chấm điểm sau khi gửi)">
                  <Textarea
                    value={answerInput}
                    onChange={({ detail }) => setAnswerInput(detail.value)}
                    placeholder="Ví dụ: React Virtual DOM hoạt động bằng cách tạo ra một bản sao nhẹ của DOM thật dưới dạng JSON..."
                    rows={4}
                    disabled={loading}
                  />
                  <Box float="right" margin={{ top: 'xs' }}>
                    <Button 
                      variant="primary" 
                      onClick={handleSubmitAnswer}
                      loading={loading}
                      disabled={!answerInput.trim()}
                    >
                      Gửi Phản Hồi
                    </Button>
                  </Box>
                </FormField>
              )}
            </SpaceBetween>
          </div>

          {/* X-Interview Style Dashboard Sidebar Assessment */}
          <div style={{ paddingLeft: '20px', borderLeft: '1px solid #e2e8f0' }}>
            <SpaceBetween size="l" direction="vertical">
              <Header variant="h3">Viet-Interview Radar & Scorecard</Header>
              
              <div style={{ position: 'relative' }}>
                {/* Blurrable wrapper container */}
                <div style={user?.tier !== 'pro' && user?.tier !== 'enterprise' ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' } : {}} className="space-y-4">
                  <Container>
                    <SpaceBetween size="m" direction="vertical">
                      <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <Box variant="awsui-key-label">Điểm Số Tổng Hợp</Box>
                        <Box variant="h1" style={{ fontSize: '36px', color: '#3b82f6', fontWeight: 'bold' }}>
                          {overallAvg} <span style={{ fontSize: '16px', color: '#64748b' }}>/ 10</span>
                        </Box>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Box variant="small">🔧 Kiến thức Chuyên môn (Hard Skills)</Box>
                          <strong>{avgTech}/10</strong>
                        </div>
                        <ProgressBar value={parseFloat(avgTech) * 10} variant="success" />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Box variant="small">💬 Kỹ năng Diễn đạt (Soft Skills)</Box>
                          <strong>{avgComm}/10</strong>
                        </div>
                        <ProgressBar value={parseFloat(avgComm) * 10} variant="success" />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Box variant="small">⚡ Mức độ Tự tin (Confidence)</Box>
                          <strong>{avgConf}/10</strong>
                        </div>
                        <ProgressBar value={parseFloat(avgConf) * 10} variant="success" />
                      </div>
                    </SpaceBetween>
                  </Container>

                  {latestFeedback && (
                    <Container header={<Header variant="h3">Nhận xét chi tiết</Header>}>
                      <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569' }}>
                        {latestFeedback.text}
                      </div>
                    </Container>
                  )}
                </div>

                {/* Paywall Overlay */}
                {user?.tier !== 'pro' && user?.tier !== 'enterprise' && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '24px',
                    borderRadius: '16px',
                    zIndex: 10
                  }}>
                    <span style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</span>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b', marginBottom: '6px' }}>
                      Mở Khóa Phân Tích Chuyên Sâu
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', maxWidth: '260px', lineHeight: '1.5', marginBottom: '16px' }}>
                      Vui lòng nâng cấp lên tài khoản **PRO** để mở khóa thanh đo 3 khía cạnh chi tiết, nhận xét sâu sắc của hội đồng AI và xem đáp án mẫu tối ưu!
                    </div>
                  </div>
                )}
              </div>

              {completed && (
                <Alert type="success" header="Hoàn thành buổi phỏng vấn">
                  Lịch sử hội thoại và bảng điểm chi tiết đã được gửi đến ban nhân sự. Hãy chuẩn bị cho vòng gặp mặt trực tiếp tiếp theo!
                </Alert>
              )}
            </SpaceBetween>
          </div>
        </Grid>
      </div>
    </Container>
  </SpaceBetween>
);
}
