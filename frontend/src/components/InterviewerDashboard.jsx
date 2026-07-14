import React, { useState, useEffect } from 'react';
import {
  Form,
  FormField,
  Input,
  Select,
  Button,
  Container,
  Header,
  SpaceBetween,
  Alert,
  Textarea,
  Tabs,
  Table,
  Badge,
  ProgressBar,
  Spinner,
  Grid,
  Box
} from '@cloudscape-design/components';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function InterviewerDashboard({ interviewerId = '00000000-0000-0000-0000-000000000000' }) {
  // Tabs state
  const [activeTabId, setActiveTabId] = useState('question_banks');

  // Existing Question Bank Creation states
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [level, setLevel] = useState({ label: "Junior (medium)", value: "medium" });
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(Array(10).fill(''));
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Recruiter Dashboard dynamic data states
  const [cvs, setCvs] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Video recording overlay simulation state
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Load companies for the Question Bank creator
  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch(`${API_BASE}/api/companies`);
        if (res.ok) {
          const data = await res.json();
          setCompanies(data.map(c => ({ label: c.name, value: c.id })));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCompanies();
  }, []);

  // Fetch recruiter dashboard data when tabs change
  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);
      
      // 1. Fetch CVs
      const cvRes = await fetch(`${API_BASE}/api/cvs`);
      if (cvRes.ok) {
        const cvData = await cvRes.json();
        setCvs(cvData);
      }

      // 2. Fetch Active Sessions
      const activeRes = await fetch(`${API_BASE}/api/sessions/active`);
      if (activeRes.ok) {
        const activeData = await activeRes.json();
        setActiveSessions(activeData);
      }

      // 3. Fetch Completed Sessions
      const completedRes = await fetch(`${API_BASE}/api/sessions/completed`);
      if (completedRes.ok) {
        const completedData = await completedRes.json();
        setCompletedSessions(completedData);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Poll active rooms every 3 seconds to monitor live candidate connections
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Recruiter joins the active session room to trigger candidate timer start
  const handleJoinSession = async (sessionId) => {
    try {
      const res = await fetch(`${API_BASE}/api/sessions/join-recruiter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      if (res.ok) {
        alert('Đã kết nối thành công vào phòng phỏng vấn! Đồng hồ đếm giờ đã bắt đầu chạy cho Ứng viên.');
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối khi tham gia phòng phỏng vấn.');
    }
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedCompany || !title) {
      setErrorMsg('Vui lòng chọn công ty và nhập tiêu đề bộ câu hỏi.');
      return;
    }

    const filteredQuestions = questions.filter(q => q.trim() !== '');
    if (filteredQuestions.length !== 10) {
      setErrorMsg('Vui lòng nhập đúng 10 câu hỏi cho bộ đề.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const res = await fetch(`${API_BASE}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerId,
          companyId: selectedCompany.value,
          level: level.value,
          title,
          questions: filteredQuestions
        })
      });

      if (res.ok) {
        setSuccessMsg('Đã lưu bộ đề câu hỏi thành công lên hệ thống Supabase.');
        setTitle('');
        setQuestions(Array(10).fill(''));
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Lỗi khi lưu bộ đề.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi kết nối khi gửi dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  // Video recording library
  const simulatedVideos = [
    {
      id: 'vid-1',
      candidateName: 'Phạm Đức Tiến',
      position: 'DevOps & GPU Engineer',
      duration: '14 phút 25 giây',
      date: '14-07-2026',
      matchScore: 92,
      analysis: 'Phản hồi lưu loát, giọng điệu tự tin. Có kiến thức rất vững về Kubernetes và tối ưu GPU workloads. Ngôn ngữ cơ thể mở, cử chỉ tay linh hoạt để minh họa cho câu trả lời.'
    },
    {
      id: 'vid-2',
      candidateName: 'Nguyễn Văn A',
      position: 'Frontend Developer',
      duration: '18 phút 10 giây',
      date: '13-07-2026',
      matchScore: 78,
      analysis: 'Trả lời đúng trọng tâm câu hỏi về React Virtual DOM. Biểu cảm tự nhiên, tuy nhiên tốc độ nói hơi nhanh ở các câu hỏi lý thuyết sâu.'
    }
  ];

  return (
    <SpaceBetween size="l" direction="vertical">
      <Tabs
        activeTabId={activeTabId}
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        tabs={[
          {
            label: "🏢 Giám sát Trực tuyến (Live)",
            id: "live_rooms",
            content: (
              <Container header={<Header variant="h2" description="Giám sát các phòng thi phỏng vấn trực tiếp của ứng viên để phê duyệt và bắt đầu tính giờ.">Phòng Giám Sát Trực Tuyến</Header>}>
                {activeSessions.length === 0 ? (
                  <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '30px 0' }}>
                    Hiện tại chưa có phiên phỏng vấn nào đang hoạt động.
                  </Box>
                ) : (
                  <Table
                    items={activeSessions}
                    columnDefinitions={[
                      { id: 'id', header: 'Mã phòng', cell: item => <Badge color="grey">{item.id.substring(0, 8)}...</Badge> },
                      { id: 'job', header: 'Vị trí tuyển dụng', cell: item => `${item.title} tại ${item.company_name}` },
                      { id: 'level', header: 'Cấp độ', cell: item => <Badge color={item.level === 'hard' ? 'red' : 'blue'}>{item.level.toUpperCase()}</Badge> },
                      { id: 'status', header: 'Trạng thái phòng', cell: item => item.recruiterJoined ? <Badge color="green">Đang phỏng vấn 📹</Badge> : <Badge color="red">Chờ HR tham gia ⏳</Badge> },
                      {
                        id: 'action',
                        header: 'Thao tác',
                        cell: item => (
                          <Button
                            variant={item.recruiterJoined ? "normal" : "primary"}
                            onClick={() => handleJoinSession(item.id)}
                            iconName="external"
                          >
                            {item.recruiterJoined ? "Đang trong phòng" : "Tham gia & Bắt đầu tính giờ"}
                          </Button>
                        )
                      }
                    ]}
                  />
                )}
              </Container>
            )
          },
          {
            label: "📄 Hồ sơ ứng viên (CV Vault)",
            id: "cv_vault",
            content: (
              <Container header={<Header variant="h2" description="Danh sách hồ sơ CV ứng viên đã gửi lên hệ thống phân tích.">Hồ Sơ CV Ứng Viên</Header>}>
                {cvs.length === 0 ? (
                  <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '30px 0' }}>
                    Chưa có CV nào được nộp vào hệ thống.
                  </Box>
                ) : (
                  <Table
                    items={cvs}
                    columnDefinitions={[
                      { id: 'date', header: 'Ngày nộp', cell: item => new Date(item.uploaded_at || Date.now()).toLocaleDateString() },
                      { id: 'file', header: 'Tên tài liệu', cell: item => <a href={item.file_url} target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'underline' }}>{item.file_url.split('/').pop()}</a> },
                      { id: 'userId', header: 'Mã ứng viên', cell: item => <Badge color="grey">{item.user_id.substring(0, 8)}...</Badge> },
                      { id: 'status', header: 'Trạng thái AI', cell: item => <Badge color="green">Đã phân tích CV</Badge> }
                    ]}
                  />
                )}
              </Container>
            )
          },
          {
            label: "🎥 Bản ghi Video (Webcam)",
            id: "video_records",
            content: (
              <Grid gridDefinition={[{ colspan: 5 }, { colspan: 7 }]}>
                {/* Left: Video List */}
                <Container header={<Header variant="h3">Bản ghi camera phỏng vấn</Header>}>
                  <SpaceBetween size="m" direction="vertical">
                    {simulatedVideos.map(vid => (
                      <div
                        key={vid.id}
                        onClick={() => setSelectedVideo(vid)}
                        style={{
                          border: selectedVideo && selectedVideo.id === vid.id ? '2px solid #6366f1' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '16px',
                          background: selectedVideo && selectedVideo.id === vid.id ? '#f5f3ff' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{vid.candidateName}</span>
                          <Badge color="green">Match {vid.matchScore}%</Badge>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                          Vị trí: {vid.position}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                          <span>🕒 {vid.duration}</span>
                          <span>📅 {vid.date}</span>
                        </div>
                      </div>
                    ))}
                  </SpaceBetween>
                </Container>

                {/* Right: Premium Mock Video Player Overlay */}
                <div>
                  {selectedVideo ? (
                    <Container header={<Header variant="h3">Trình xem & Đánh giá hành vi: {selectedVideo.candidateName}</Header>}>
                      <SpaceBetween size="l" direction="vertical">
                        {/* Realistic Mock Webcam Player with visual AI trackboxes */}
                        <div style={{
                          width: '100%',
                          height: '280px',
                          background: '#0f172a',
                          borderRadius: '12px',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {/* Simulated Candidate Photo/Webcam frame with scanning green HUD */}
                          <div style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            background: '#334155',
                            border: '3px solid #6366f1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '36px',
                            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
                          }}>
                            👤
                          </div>

                          {/* AI tracking Overlay Graphics */}
                          <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            background: 'rgba(0,0,0,0.6)',
                            color: '#10b981',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            borderLeft: '3px solid #10b981'
                          }}>
                            ● LIVE SECURED RECORDING
                          </div>

                          <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            background: 'rgba(0,0,0,0.6)',
                            color: '#6366f1',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '11px'
                          }}>
                            GAZE CONTEXT: FOCUSED (98%)
                          </div>

                          {/* Pulsing face tracking HUD boundary */}
                          <div style={{
                            position: 'absolute',
                            width: '180px',
                            height: '180px',
                            border: '1px dashed #10b981',
                            animation: 'spin 10s linear infinite',
                            borderRadius: '10px'
                          }} />
                        </div>

                        {/* AI Behavioral analysis */}
                        <div>
                          <Box variant="h4" style={{ fontWeight: 'bold', marginBottom: '6px' }}>Nhận xét hành vi bằng AI (Behavioral AI Review):</Box>
                          <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            {selectedVideo.analysis}
                          </div>
                        </div>
                      </SpaceBetween>
                    </Container>
                  ) : (
                    <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '50px 0' }}>
                      Chọn một bản ghi ở cột bên trái để xem video phỏng vấn và đánh giá biểu cảm của ứng viên.
                    </Box>
                  )}
                </div>
              </Grid>
            )
          },
          {
            label: "📊 Điểm thi & Kết quả (Results)",
            id: "results",
            content: (
              <Container header={<Header variant="h2" description="Lịch sử điểm số phỏng vấn chi tiết được đánh giá tự động bởi VietInterview AI.">Kết Quả Đánh Giá Năng Lực</Header>}>
                {completedSessions.length === 0 ? (
                  <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '30px 0' }}>
                    Chưa có kết quả phỏng vấn nào hoàn thành.
                  </Box>
                ) : (
                  <Table
                    items={completedSessions}
                    columnDefinitions={[
                      { id: 'date', header: 'Ngày phỏng vấn', cell: item => new Date(item.created_at || Date.now()).toLocaleDateString() },
                      { id: 'candidate', header: 'Ứng viên', cell: item => <Badge color="grey">Ứng viên</Badge> },
                      { id: 'position', header: 'Vị trí thi', cell: item => `${item.title} tại ${item.company_name}` },
                      { id: 'score', header: 'Bảng điểm AI', cell: item => <Badge color="green">Điểm TB: {item.score}/10</Badge> },
                      { id: 'history', header: 'Số câu trả lời', cell: item => `${item.chat_history ? Math.floor(item.chat_history.length / 2) : 0} câu` }
                    ]}
                  />
                )}
              </Container>
            )
          },
          {
            label: "✍️ Tạo đề thi câu hỏi",
            id: "question_banks",
            content: (
              <Container header={<Header variant="h2" description="Tự tạo đề thi phỏng vấn tùy chỉnh gồm 10 câu hỏi để hệ thống AI sử dụng kiểm tra ứng viên.">Thiết Lập Bộ Đề Câu Hỏi Mới</Header>}>
                {errorMsg && (
                  <Alert type="error" dismissible onDismiss={() => setErrorMsg('')}>
                    {errorMsg}
                  </Alert>
                )}
                {successMsg && (
                  <Alert type="success" dismissible onDismiss={() => setSuccessMsg('')}>
                    {successMsg}
                  </Alert>
                )}

                <Form
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button variant="link" onClick={() => setQuestions(Array(10).fill(''))}>Reset Form</Button>
                      <Button variant="primary" onClick={handleSave} loading={loading}>
                        Lưu Bộ Đề Câu Hỏi
                      </Button>
                    </SpaceBetween>
                  }
                >
                  <SpaceBetween direction="vertical" size="l">
                    <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
                      <FormField label="Chọn Công Ty">
                        <Select
                          selectedOption={selectedCompany}
                          onChange={({ detail }) => setSelectedCompany(detail.selectedOption)}
                          options={companies}
                          placeholder="Chọn công ty mục tiêu..."
                        />
                      </FormField>

                      <FormField label="Chọn Cấp Độ">
                        <Select
                          selectedOption={level}
                          onChange={({ detail }) => setLevel(detail.selectedOption)}
                          options={[
                            { label: "Intern / Fresher (easy)", value: "easy" },
                            { label: "Junior / Mid (medium)", value: "medium" },
                            { label: "Senior (hard)", value: "hard" }
                          ]}
                        />
                      </FormField>

                      <FormField label="Tiêu đề Bộ câu hỏi">
                        <Input
                          value={title}
                          onChange={({ detail }) => setTitle(detail.value)}
                          placeholder="Ví dụ: Backend Node.js Quiz"
                        />
                      </FormField>
                    </Grid>

                    <Header variant="h3">Danh sách 10 câu hỏi xoay vòng</Header>
                    <Grid gridDefinition={[
                      { colspan: 6 }, { colspan: 6 },
                      { colspan: 6 }, { colspan: 6 },
                      { colspan: 6 }, { colspan: 6 },
                      { colspan: 6 }, { colspan: 6 },
                      { colspan: 6 }, { colspan: 6 }
                    ]}>
                      {questions.map((q, idx) => (
                        <FormField key={idx} label={`Câu hỏi số ${idx + 1}`}>
                          <Textarea
                            value={q}
                            onChange={({ detail }) => handleQuestionChange(idx, detail.value)}
                            placeholder={`Nhập câu hỏi ${idx + 1}`}
                            rows={2}
                          />
                        </FormField>
                      ))}
                    </Grid>
                  </SpaceBetween>
                </Form>
              </Container>
            )
          }
        ]}
      />
    </SpaceBetween>
  );
}
