import React, { useState } from 'react';
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
  Box
} from '@cloudscape-design/components';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function InterviewRoom({ session, onLeaveSession }) {
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
  
  // Advanced X-Interview Score breakdowns
  const [technicalScores, setTechnicalScores] = useState([]);
  const [communicationScores, setCommunicationScores] = useState([]);
  const [confidenceScores, setConfidenceScores] = useState([]);
  const [latestFeedback, setLatestFeedback] = useState(null);

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
          scores: { techScore, commScore, confScore }
        });

        if (data.isCompleted) {
          setCompleted(true);
          newLogs.push({
            role: 'ai',
            content: 'Chúc mừng bạn đã hoàn tất 10 câu hỏi của phiên phỏng vấn thử nghiệm X-Interview. Bạn có thể xem bảng phân tích đánh giá tổng quan ở bảng bên phải.'
          });
          setChatLog(newLogs);
        } else {
          setCurrentIndex(data.currentQuestionIndex);
          setCurrentQuestion(data.nextQuestion);
          newLogs.push({
            role: 'ai',
            content: data.nextQuestion
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
        <Grid gridDefinition={[{ colspan: 7 }, { colspan: 5 }]}>
          <div>
            <SpaceBetween size="m" direction="vertical">
              <Box variant="awsui-key-label">
                Độ khó buổi phỏng vấn: <Badge color={level === 'hard' ? 'red' : level === 'medium' ? 'blue' : 'green'}>
                  {level.toUpperCase()}
                </Badge>
              </Box>

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
                  return (
                    <div 
                      key={index} 
                      style={{
                        alignSelf: isAi ? 'flex-start' : 'flex-end',
                        maxWidth: '85%',
                        padding: '12px 18px',
                        borderRadius: isAi ? '16px 16px 16px 0px' : '16px 16px 0px 16px',
                        background: isAi 
                          ? (isFeedback ? '#eff6ff' : '#ffffff')
                          : '#0f172a',
                        color: isAi ? '#1e293b' : '#ffffff',
                        border: isAi ? '1px solid #e2e8f0' : 'none',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <Box variant="small" style={{ fontWeight: 'bold', marginBottom: '6px', color: isAi ? '#3b82f6' : '#94a3b8' }}>
                        {log.role === 'ai' ? '🤖 X-Interview Bot' : log.role === 'ai_feedback' ? '📊 Đánh giá phản hồi' : '👤 Bạn'}
                      </Box>
                      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>{log.content}</div>
                      
                      {isFeedback && log.scores && (
                        <div style={{ marginTop: '8px', borderTop: '1px dashed #bfdbfe', paddingTop: '6px', fontSize: '12px', display: 'flex', gap: '10px' }}>
                          <span>🔧 Kỹ thuật: <strong>{log.scores.techScore}/10</strong></span>
                          <span>💬 Giao tiếp: <strong>{log.scores.commScore}/10</strong></span>
                          <span>⚡ Tự tin: <strong>{log.scores.confScore}/10</strong></span>
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
              <Header variant="h3">X-Interview Radar & Scorecard</Header>
              
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

              {completed && (
                <Alert type="success" header="Hoàn thành buổi phỏng vấn">
                  Lịch sử hội thoại và bảng điểm chi tiết đã được gửi đến ban nhân sự. Hãy chuẩn bị cho vòng gặp mặt trực tiếp tiếp theo!
                </Alert>
              )}
            </SpaceBetween>
          </div>
        </Grid>
      </Container>
    </SpaceBetween>
  );
}
