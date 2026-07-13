import React, { useState, useEffect } from 'react';
import {
  Form,
  FormField,
  Select,
  Button,
  Container,
  Header,
  SpaceBetween,
  Alert,
  Input,
  Spinner,
  Grid,
  Box,
  ProgressBar,
  Badge,
  Cards
} from '@cloudscape-design/components';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function StartInterview({ onStartSession, userId = '00000000-0000-0000-0000-000000000000' }) {
  const [cvOptions, setCvOptions] = useState([]);
  const [selectedCv, setSelectedCv] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Quick CV upload
  const [newCvUrl, setNewCvUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Simulated CV analysis results
  const [cvAnalysis, setCvAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const cvRes = await fetch(`${API_BASE}/api/cv?userId=${userId}`);
        let cvs = [];
        if (cvRes.ok) {
          cvs = await cvRes.json();
        }
        
        const compRes = await fetch(`${API_BASE}/api/companies`);
        let comps = [];
        if (compRes.ok) {
          comps = await compRes.json();
        }

        const formattedCvs = cvs.map(cv => ({
          label: cv.file_url.split('/').pop() || 'CV Document',
          value: cv.id
        }));
        setCvOptions(formattedCvs);

        const formattedComps = comps.map(c => ({
          label: c.name,
          description: c.industry_domain,
          value: c.id
        }));
        setCompanyOptions(formattedComps);
        
        setErrorMsg('');
      } catch (err) {
        console.error(err);
        setErrorMsg('Không thể kết nối đến server API. Vui lòng kiểm tra backend.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  // Simulate CV analysis when CV and Company are both selected
  useEffect(() => {
    if (selectedCv && selectedCompany) {
      setAnalyzing(true);
      const timer = setTimeout(() => {
        const nameLower = selectedCompany.label.toLowerCase();
        const isCybersecurity = nameLower.includes('viettel') || nameLower.includes('ncs');
        const isCloudDevOps = nameLower.includes('nvidia') || nameLower.includes('smart cloud');
        const isSoftware = nameLower.includes('vng') || nameLower.includes('fpt software');
        
        let matchRate = 72;
        let skills = ['Git', 'REST API', 'SQL'];
        let missing = ['System Design'];

        if (isCloudDevOps) {
          matchRate = 88;
          skills = ['Docker', 'Kubernetes', 'CI/CD', 'Linux Shell', 'Python', 'Prometheus', 'Terraform'];
          missing = ['AWS Cloud Security', 'GPU Hardware optimization'];
        } else if (isCybersecurity) {
          matchRate = 81;
          skills = ['Linux Security', 'Wireshark', 'Metasploit', 'Network Security', 'OWASP Top 10'];
          missing = ['SIEM tools', 'Incident Response playbooks'];
        } else if (isSoftware) {
          matchRate = 79;
          skills = ['React.js', 'Node.js', 'Express', 'MongoDB', 'Javascript', 'HTML5/CSS3'];
          missing = ['GraphQL', 'Microservices Architecture'];
        }

        setCvAnalysis({
          matchRate,
          skills,
          missing,
          scorecard: {
            experience: 'Phù hợp (2 năm kinh nghiệm thực tế)',
            language: 'Tiếng Anh tốt (đọc tài liệu, giao tiếp cơ bản)',
            fit: 'Tư duy giải thuật vững vàng'
          }
        });
        setAnalyzing(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCvAnalysis(null);
    }
  }, [selectedCv, selectedCompany]);

  const handleAddCv = async () => {
    if (!newCvUrl) return;
    try {
      setUploading(true);
      const res = await fetch(`${API_BASE}/api/cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fileUrl: newCvUrl })
      });
      if (res.ok) {
        const newCv = await res.json();
        const option = { label: newCv.file_url.split('/').pop(), value: newCv.id };
        setCvOptions(prev => [option, ...prev]);
        setSelectedCv(option);
        setNewCvUrl('');
      } else {
        setErrorMsg('Không thể lưu CV mới.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi kết nối khi tải CV.');
    } finally {
      setUploading(false);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (!selectedCompany || !selectedLevel) {
      setErrorMsg('Vui lòng chọn Công ty và Vị trí/Cấp độ.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: userId,
          cvId: selectedCv ? selectedCv.value : null,
          companyId: selectedCompany.value,
          level: selectedLevel.value
        })
      });

      if (res.ok) {
        const sessionInfo = await res.json();
        onStartSession({
          sessionId: sessionInfo.sessionId,
          questions: sessionInfo.questions,
          currentQuestionIndex: sessionInfo.currentQuestionIndex,
          firstQuestion: sessionInfo.firstQuestion,
          companyName: selectedCompany.label,
          level: selectedLevel.value
        });
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Không tìm thấy bộ đề câu hỏi phù hợp cho công ty này.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi kết nối khi khởi tạo phiên phỏng vấn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid gridDefinition={[{ colspan: 7 }, { colspan: 5 }]}>
      <Container header={<Header variant="h2" description="Lập cấu hình phỏng vấn cá nhân hóa">Thiết Lập Phiên Luyện Tập</Header>}>
        {errorMsg && (
          <Alert type="error" dismissible onDismiss={() => setErrorMsg('')} header="Lỗi hệ thống">
            {errorMsg}
          </Alert>
        )}

        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => {
                setSelectedCv(null);
                setSelectedCompany(null);
                setSelectedLevel(null);
              }}>Hủy</Button>
              <Button 
                variant="primary" 
                onClick={handleStart}
                disabled={loading || !selectedCompany || !selectedLevel}
              >
                Bắt Đầu Ngay
              </Button>
            </SpaceBetween>
          }
        >
          <SpaceBetween direction="vertical" size="l">
            {/* Quick CV Section */}
            <div style={{ border: '1px dashed #d1d5db', padding: '16px', borderRadius: '8px', background: '#fafafa' }}>
              <FormField label="1. Tải lên CV mới của bạn (Dán link file PDF)">
                <SpaceBetween direction="horizontal" size="xs">
                  <div style={{ flexGrow: 1 }}>
                    <Input
                      value={newCvUrl}
                      onChange={({ detail }) => setNewCvUrl(detail.value)}
                      placeholder="https://supabase-storage-url.com/cv.pdf"
                    />
                  </div>
                  <Button onClick={handleAddCv} disabled={uploading || !newCvUrl}>
                    {uploading ? <Spinner size="normal" /> : 'Nhập CV'}
                  </Button>
                </SpaceBetween>
              </FormField>
            </div>

            <FormField label="2. Chọn CV trong hồ sơ để phân tích">
              <Select
                selectedOption={selectedCv}
                onChange={({ detail }) => setSelectedCv(detail.selectedOption)}
                options={cvOptions}
                placeholder="Chọn CV đã lưu..."
                empty="Không tìm thấy CV. Vui lòng thêm CV ở khung trên."
              />
            </FormField>

            <FormField label="3. Chọn Công ty & Vị trí mục tiêu">
              <Select
                selectedOption={selectedCompany}
                onChange={({ detail }) => setSelectedCompany(detail.selectedOption)}
                options={companyOptions}
                placeholder="Chọn công ty tuyển dụng..."
              />
            </FormField>

            <FormField label="4. Chọn Cấp độ Thử thách">
              <Select
                selectedOption={selectedLevel}
                onChange={({ detail }) => setSelectedLevel(detail.selectedOption)}
                options={[
                  { label: "Intern / Fresher (Cấp độ Dễ - ez)", value: "ez" },
                  { label: "Junior (Cấp độ Trung bình - medium)", value: "medium" },
                  { label: "Senior (Cấp độ Khó - hard)", value: "hard" }
                ]}
                placeholder="Chọn cấp độ phỏng vấn..."
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </Container>

      {/* CV matching panel inspired by X-Interview */}
      <div style={{ paddingLeft: '16px' }}>
        <Container header={<Header variant="h2">AI Analysis & Match Rate</Header>}>
          {analyzing ? (
            <SpaceBetween size="m" direction="vertical" align="center">
              <Spinner size="large" />
              <div>AI đang phân tích độ phù hợp CV của bạn...</div>
            </SpaceBetween>
          ) : cvAnalysis ? (
            <SpaceBetween size="l" direction="vertical">
              <div>
                <Box variant="h3" style={{ marginBottom: '8px' }}>Tỷ Lệ Khớp Yêu Cầu Công Việc</Box>
                <ProgressBar
                  value={cvAnalysis.matchRate}
                  label={`${cvAnalysis.matchRate}% Match Rate`}
                  variant="success"
                />
              </div>

              <div>
                <Box variant="awsui-key-label" style={{ marginBottom: '6px' }}>Kỹ năng phù hợp phát hiện trong CV:</Box>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {cvAnalysis.skills.map((skill, idx) => (
                    <Badge key={idx} color="green">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Box variant="awsui-key-label" style={{ marginBottom: '6px' }}>Kỹ năng cần bổ sung / cải thiện:</Box>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {cvAnalysis.missing.map((item, idx) => (
                    <Badge key={idx} color="red">{item}</Badge>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e9e9e9', paddingTop: '12px' }}>
                <Box variant="h4" style={{ marginBottom: '8px' }}>Tóm tắt đánh giá sơ bộ</Box>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: '1.8' }}>
                  <li><strong>Kinh nghiệm:</strong> {cvAnalysis.scorecard.experience}</li>
                  <li><strong>Ngoại ngữ:</strong> {cvAnalysis.scorecard.language}</li>
                  <li><strong>Tư duy:</strong> {cvAnalysis.scorecard.fit}</li>
                </ul>
              </div>
            </SpaceBetween>
          ) : (
            <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>
              Vui lòng chọn cả <strong>CV</strong> và <strong>Công ty mục tiêu</strong> để kích hoạt phân tích trích xuất kỹ năng từ hệ thống X-Interview AI.
            </Box>
          )}
        </Container>
      </div>
    </Grid>
  );
}
