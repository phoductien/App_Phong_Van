import React, { useState, useEffect } from 'react';
import {
  Table,
  Box,
  SpaceBetween,
  Button,
  Container,
  Header,
  Select,
  Badge,
  Grid
} from '@cloudscape-design/components';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function QuestionBankViewer() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch(`${API_BASE}/api/companies`);
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map(c => ({ label: c.name, value: c.id }));
          setCompanies(formatted);
          if (formatted.length > 0) {
            setSelectedCompany(formatted[0]); // Default to first company
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;

    async function loadQuestions() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/questions?companyId=${selectedCompany.value}`);
        if (res.ok) {
          const data = await res.json();
          setQuestionBanks(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [selectedCompany]);

  return (
    <SpaceBetween size="l" direction="vertical">
      <Container
        header={
          <Header
            variant="h2"
            description="Tra cứu ngân hàng đề thi tuyển dụng chính thức của các doanh nghiệp đối tác"
            actions={
              <div style={{ width: '280px' }}>
                <Select
                  selectedOption={selectedCompany}
                  onChange={({ detail }) => setSelectedCompany(detail.selectedOption)}
                  options={companies}
                  placeholder="Lọc theo Công ty..."
                />
              </div>
            }
          >
            Ngân Hàng Đề Thi Tuyển Dụng
          </Header>
        }
      >
        {loading ? (
          <Box variant="p" style={{ textAlign: 'center', padding: '20px 0' }}>
            Đang tải danh sách câu hỏi...
          </Box>
        ) : questionBanks.length === 0 ? (
          <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>
            Chưa có bộ câu hỏi tuyển dụng nào được lưu cho công ty này. Bạn có thể tự tạo bộ câu hỏi ở tab <strong>Quản trị bộ đề</strong>.
          </Box>
        ) : (
          <SpaceBetween size="l" direction="vertical">
            {questionBanks.map((qb, idx) => (
              <Container
                key={qb.id || idx}
                header={
                  <Header
                    variant="h3"
                    actions={
                      <Badge color={qb.level === 'hard' ? 'red' : qb.level === 'medium' ? 'blue' : 'green'}>
                        Cấp độ: {qb.level.toUpperCase()}
                      </Badge>
                    }
                  >
                    {qb.title}
                  </Header>
                }
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {qb.questions && qb.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '6px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        color: '#334155'
                      }}
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </Container>
            ))}
          </SpaceBetween>
        )}
      </Container>
    </SpaceBetween>
  );
}
