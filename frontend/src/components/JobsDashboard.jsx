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
  FormField,
  Icon,
  Spinner,
  Alert
} from '@cloudscape-design/components';

export default function JobsDashboard({ onStartInterviewWithJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [crawlSuccess, setCrawlSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('http://localhost:5000/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        if (data.length > 0 && !selectedJob) {
          setSelectedJob(data[0]);
        }
      } else {
        setError('Không thể kết nối đến máy chủ tuyển dụng. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError('Lỗi kết nối máy chủ. Vui lòng đảm bảo Backend API Server (port 5000) đã khởi động.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCrawlJobs = async () => {
    try {
      setCrawling(true);
      setCrawlSuccess('');
      const res = await fetch('http://localhost:5000/api/jobs/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setCrawlSuccess(`Đã cào thành công ${data.count} vị trí việc làm mới từ hệ thống Remotive API!`);
        if (data.jobs.length > 0) {
          setSelectedJob(data.jobs[0]);
        }
      } else {
        alert('Cào dữ liệu thất bại hoặc máy chủ bận.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối khi cào việc làm.');
    } finally {
      setCrawling(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLoc = job.location.toLowerCase().includes(locationTerm.toLowerCase());
    return matchesSearch && matchesLoc;
  });

  return (
    <SpaceBetween size="l" direction="vertical">
      {/* Top Search Bars */}
      <Container>
        <Grid gridDefinition={[{ colspan: 5 }, { colspan: 5 }, { colspan: 2 }]}>
          <FormField stretch>
            <Input
              value={searchTerm}
              onChange={({ detail }) => setSearchTerm(detail.value)}
              placeholder="🔍 Tìm kiếm việc làm, tên công ty..."
            />
          </FormField>
          <FormField stretch>
            <Input
              value={locationTerm}
              onChange={({ detail }) => setLocationTerm(detail.value)}
              placeholder="📍 Địa điểm..."
            />
          </FormField>
          <Button variant="primary" iconName="search" stretch>
            Tìm kiếm
          </Button>
        </Grid>

        {/* Filter tags & Crawl trigger */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="normal" size="sm">❤️ Yêu thích</Button>
            <Button variant="normal" size="sm">💼 Vị trí: Developer</Button>
            <Button variant="normal" size="sm">🕒 Loại việc</Button>
            <Button variant="normal" size="sm">💵 Mức lương</Button>
            <Button variant="normal" size="sm">⚡ Kinh nghiệm</Button>
          </div>
          
          <Button 
            variant="normal" 
            loading={crawling} 
            onClick={handleCrawlJobs}
            iconName="refresh"
          >
            🕷️ Cào thêm việc làm từ Web (Adzuna/Remotive)
          </Button>
        </div>
      </Container>

      {crawlSuccess && (
        <Alert type="success" dismissible onDismiss={() => setCrawlSuccess('')}>
          {crawlSuccess}
        </Alert>
      )}

      {error ? (
        <Alert
          type="error"
          header="Lỗi tải dữ liệu"
          action={<Button onClick={fetchJobs}>Thử lại</Button>}
        >
          {error}
        </Alert>
      ) : loading ? (
        <Box variant="p" style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spinner size="large" /> Loading danh sách việc làm...
        </Box>
      ) : (
        /* Split Layout: Left List, Right Detailed View */
        <Grid gridDefinition={[{ colspan: 5 }, { colspan: 7 }]}>
          {/* Left column: listings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
            <Box variant="small" style={{ color: '#64748b', fontWeight: 'bold' }}>
              Hiển thị {filteredJobs.length} việc làm phù hợp
            </Box>

            {filteredJobs.map(job => {
              const isSelected = selectedJob && job.id === selectedJob.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  style={{
                    border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    background: isSelected ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box variant="h4" style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 'bold' }}>
                      {job.title}
                    </Box>
                    <Icon name="status-info" variant="subtle" />
                  </div>
                  <Box variant="small" style={{ color: '#4f46e5', fontWeight: '500', margin: '4px 0' }}>
                    {job.company}
                  </Box>
                  
                  <div style={{ display: 'flex', gap: '6px', margin: '8px 0', flexWrap: 'wrap' }}>
                    <Badge color="green">{job.salary}</Badge>
                    <Badge color="blue">{job.jobType}</Badge>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
                    <span>📍 {job.location.split(',')[0]}</span>
                    <span>{job.posted}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right column: detailed description */}
          <div>
            {selectedJob ? (
              <Container>
                <SpaceBetween size="l" direction="vertical">
                  {/* Header section */}
                  <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <Box variant="h2" style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px 0' }}>
                      {selectedJob.title}
                    </Box>
                    <Box variant="p" style={{ color: '#6366f1', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                      {selectedJob.company}
                    </Box>
                    <Box variant="small" style={{ color: '#94a3b8' }}>
                      📍 {selectedJob.location} • 📅 {selectedJob.posted}
                    </Box>
                  </div>

                  {/* Key Metrics Blocks */}
                  <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <Box variant="small" style={{ color: '#64748b' }}>💵 MỨC LƯƠNG</Box>
                      <Box variant="h4" style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '4px', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedJob.salary}
                      </Box>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <Box variant="small" style={{ color: '#64748b' }}>⚡ KINH NGHIỆM</Box>
                      <Box variant="h4" style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '4px', fontSize: '13px' }}>
                        {selectedJob.experience}
                      </Box>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <Box variant="small" style={{ color: '#64748b' }}>👥 ỨNG VIÊN</Box>
                      <Box variant="h4" style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '4px', fontSize: '13px' }}>
                        0 ứng viên
                      </Box>
                    </div>
                  </Grid>

                  {/* Action buttons matching X-Interview */}
                  <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <Button 
                      variant="normal" 
                      iconName="arrow-right"
                      onClick={() => onStartInterviewWithJob(selectedJob, 'analyze')}
                    >
                      🔍 Phân tích CV
                    </Button>
                    <Button 
                      variant="primary" 
                      iconName="external"
                      onClick={() => onStartInterviewWithJob(selectedJob, 'interview')}
                    >
                      🚀 Luyện phỏng vấn
                    </Button>
                  </div>

                  {/* Job Description details */}
                  <div>
                    <Box variant="h3" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Về công việc</Box>
                    <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
                      {selectedJob.desc}
                    </div>
                  </div>

                  <div>
                    <Box variant="h3" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Yêu cầu tuyển dụng</Box>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
                      <li>Hiểu sâu về cấu trúc dữ liệu và thiết kế kiến trúc hệ thống phù hợp.</li>
                      <li>Khả năng làm việc nhóm tốt, ham học hỏi và chịu được áp lực cao.</li>
                      <li>Tiếng Anh đọc hiểu tài liệu chuyên ngành tốt là lợi thế bắt buộc.</li>
                    </ul>
                  </div>
                </SpaceBetween>
              </Container>
            ) : (
              <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>
                Vui lòng chọn một công việc từ cột bên trái để xem chi tiết tuyển dụng.
              </Box>
            )}
          </div>
        </Grid>
      )}
    </SpaceBetween>
  );
}
