import React, { useState, useEffect } from 'react';
import {
  Box,
  SpaceBetween,
  Container,
  Header,
  Select,
  Badge
} from '@cloudscape-design/components';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function QuestionBankViewer() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedLevel, setSelectedLevel] = useState({ label: "Tất cả cấp độ", value: "all" });
  const [selectedPosition, setSelectedPosition] = useState({ label: "Tất cả vị trí", value: "all" });

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

  // Reset filters when company changes
  useEffect(() => {
    setSelectedLevel({ label: "Tất cả cấp độ", value: "all" });
    setSelectedPosition({ label: "Tất cả vị trí", value: "all" });
  }, [selectedCompany]);

  // Helper to extract clean position from title
  const getPositionFromTitle = (title) => {
    const parts = title.split(' - ');
    if (parts.length > 1) {
      return parts[1].replace(/\s*(Quiz|Interview|Quiz\s*\(.*\))\s*$/i, '').trim();
    }
    return title;
  };

  // Generate dynamic position options from loaded question banks
  const uniquePositions = Array.from(new Set(questionBanks.map(qb => getPositionFromTitle(qb.title))));
  const positionOptions = [
    { label: "Tất cả vị trí", value: "all" },
    ...uniquePositions.map(pos => ({ label: pos, value: pos }))
  ];

  const filteredQuestionBanks = questionBanks.filter(qb => {
    const matchLevel = selectedLevel.value === "all" || qb.level === selectedLevel.value;
    const qbPosition = getPositionFromTitle(qb.title);
    const matchPosition = selectedPosition.value === "all" || qbPosition === selectedPosition.value;
    return matchLevel && matchPosition;
  });

  return (
    <SpaceBetween size="l" direction="vertical">
      <Container
        header={
          <Header
            variant="h2"
            description="Tra cứu ngân hàng đề thi tuyển dụng chính thức của các doanh nghiệp đối tác"
          >
            Ngân Hàng Đề Thi Tuyển Dụng
          </Header>
        }
      >
        <SpaceBetween size="l" direction="vertical">
          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '8px' }}>
            <div style={{ flex: '1 1 200px' }}>
              <Box variant="awsui-key-label">Lọc theo doanh nghiệp:</Box>
              <Select
                selectedOption={selectedCompany}
                onChange={({ detail }) => setSelectedCompany(detail.selectedOption)}
                options={companies}
                placeholder="Chọn công ty..."
              />
            </div>
            
            <div style={{ flex: '1 1 180px' }}>
              <Box variant="awsui-key-label">Cấp độ phỏng vấn:</Box>
              <Select
                selectedOption={selectedLevel}
                onChange={({ detail }) => setSelectedLevel(detail.selectedOption)}
                options={[
                  { label: "Tất cả cấp độ", value: "all" },
                  { label: "Intern / Fresher (ez)", value: "ez" },
                  { label: "Junior (medium)", value: "medium" },
                  { label: "Senior (hard)", value: "hard" }
                ]}
              />
            </div>

            <div style={{ flex: '2 1 250px' }}>
              <Box variant="awsui-key-label">Lọc theo vị trí ứng tuyển:</Box>
              <Select
                selectedOption={selectedPosition}
                onChange={({ detail }) => setSelectedPosition(detail.selectedOption)}
                options={positionOptions}
                filteringType="auto"
                placeholder="Chọn vị trí..."
              />
            </div>
          </div>

          {loading ? (
            <Box variant="p" style={{ textAlign: 'center', padding: '20px 0' }}>
              Đang tải danh sách câu hỏi...
            </Box>
          ) : filteredQuestionBanks.length === 0 ? (
            <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>
              Không tìm thấy bộ câu hỏi nào khớp với bộ lọc hiện tại.
            </Box>
          ) : (
            <SpaceBetween size="l" direction="vertical">
              {filteredQuestionBanks.map((qb, idx) => (
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
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
