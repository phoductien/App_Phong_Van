import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Grid,
  Box,
  Badge,
  Input,
  Table,
  Spinner
} from '@cloudscape-design/components';

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

  // Filter completed sessions for the activity log table
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalCount = sessions.length;
  const completedCount = completedSessions.length;

  // Calculate average score of completed sessions
  const validScores = completedSessions.map(s => parseFloat(s.score)).filter(score => !isNaN(score));
  const avgScore = validScores.length > 0 
    ? (validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length).toFixed(1) 
    : "0.0";

  const stats = [
    { label: 'Tổng số phòng phỏng vấn 📹', value: totalCount.toString() },
    { label: 'Phòng vấn đã hoàn thành ✅', value: completedCount.toString() },
    { label: 'Đơn ứng tuyển đã gửi ✉️', value: Math.ceil(completedCount * 0.5).toString() },
    { label: 'Điểm trung bình 📊', value: `${avgScore} / 10` }
  ];

  const suggestedJobs = [
    { title: 'Trợ lý Luật sư', company: 'Công ty Luật TNHH Everest', tags: ['Thỏa thuận', 'Làm việc từ xa'] },
    { title: 'Luật sư cộng sự', company: 'Công ty Luật TNHH Everest', tags: ['Thỏa thuận', 'Làm việc từ xa'] }
  ];

  return (
    <SpaceBetween size="l" direction="vertical">
      {/* Welcome Banner */}
      <div>
        <Box variant="h2" style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
          Chào mừng trở lại, {user?.full_name || 'Ứng viên'}!
        </Box>
        <Box variant="p" color="text-muted">
          Đây là tổng quan về hành trình chuẩn bị phỏng vấn của bạn.
        </Box>
      </div>

      {/* Main Grid: Left Stats & Activities, Right Quick Start Banner */}
      <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
        <SpaceBetween size="l" direction="vertical">
          {/* Stats Cards */}
          <Grid gridDefinition={[{ colspan: 3 }, { colspan: 3 }, { colspan: 3 }, { colspan: 3 }]}>
            {stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{stat.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{stat.value}</div>
                {/* Visual subtle circle in card */}
                <div style={{
                  position: 'absolute',
                  right: '-10px',
                  bottom: '-10px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  zIndex: 0,
                  opacity: 0.7
                }} />
              </div>
            ))}
          </Grid>

          {/* Search bar inside container */}
          <Container>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flexGrow: 1 }}>
                <Input
                  onChange={() => {}}
                  value=""
                  placeholder="🔍 Tìm kiếm câu hỏi, việc làm hoặc tài nguyên..."
                />
              </div>
              <Button variant="normal">Tất cả danh mục</Button>
              <Button variant="normal">Độ khó: Bất kỳ</Button>
            </div>
          </Container>

          {/* Recent Activity Table */}
          <Container header={<Header variant="h3">Hoạt động gần đây</Header>}>
            {loading ? (
              <Box variant="p" style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spinner size="large" />
              </Box>
            ) : completedSessions.length === 0 ? (
              <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '30px 0' }}>
                Chưa có hoạt động phỏng vấn nào hoàn thành.
              </Box>
            ) : (
              <Table
                items={completedSessions}
                columnDefinitions={[
                  { id: 'date', header: 'Ngày phỏng vấn', cell: item => new Date(item.created_at || Date.now()).toLocaleDateString() },
                  { id: 'company', header: 'Công ty', cell: item => item.company_name },
                  { id: 'position', header: 'Vị trí tuyển dụng', cell: item => item.title },
                  { id: 'score', header: 'Điểm số', cell: item => <Badge color="green">{item.score}/10</Badge> },
                  { id: 'status', header: 'Trạng thái', cell: item => 'Hoàn thành' }
                ]}
              />
            )}
          </Container>
        </SpaceBetween>

        {/* Right column: Purple Promo & Suggested Jobs */}
        <SpaceBetween size="l" direction="vertical">
          {/* Big Purple Call-to-action banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '230px'
            }}
          >
            <div>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📹</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '6px' }}>Giả lập phỏng vấn thực tế</div>
              <div style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.5', padding: '0 10px' }}>
                Trải nghiệm buổi phỏng vấn hoàn chỉnh với AI. Thực hành trả lời câu hỏi, nhận phản hồi chi tiết và tự tin hơn.
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={onStartQuickInterview}
                style={{
                  background: '#ffffff',
                  color: '#4f46e5',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.1s ease'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Bắt đầu ngay →
              </button>
            </div>
          </div>

          {/* Suggested Jobs card */}
          <Container header={<Header variant="h3">Việc làm gợi ý</Header>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {suggestedJobs.map((job, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigateToTab('jobs')}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: '#ffffff',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{job.title}</div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>{job.company}</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    {job.tags.map((tag, tIdx) => (
                      <Badge key={tIdx} color="blue">{tag}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </SpaceBetween>
      </Grid>
    </SpaceBetween>
  );
}
