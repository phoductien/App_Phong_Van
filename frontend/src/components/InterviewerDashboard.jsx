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
  Textarea
} from '@cloudscape-design/components';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function InterviewerDashboard({ interviewerId = '00000000-0000-0000-0000-000000000000' }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [level, setLevel] = useState({ label: "Intern / Fresher (ez)", value: "ez" });
  const [title, setTitle] = useState('');
  
  // Array of 10 question strings
  const [questions, setQuestions] = useState(Array(10).fill(''));
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
        setErrorMsg('Không thể load danh sách công ty.');
      }
    }
    loadCompanies();
  }, []);

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

  return (
    <Container header={<Header variant="h2">Quản lý Đề thi (Interviewer Dashboard)</Header>}>
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
                  { label: "Intern / Fresher (ez)", value: "ez" },
                  { label: "Junior (medium)", value: "medium" },
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
  );
}
