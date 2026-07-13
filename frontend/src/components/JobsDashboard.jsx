import React, { useState } from 'react';
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
  Icon
} from '@cloudscape-design/components';

export default function JobsDashboard({ onStartInterviewWithJob }) {
  const jobListings = [
    {
      id: 'job-1',
      title: 'SOC Analyst (Giám sát An ninh mạng)',
      company: 'Viettel Cyber Security (VCS)',
      companyId: '11111111-1111-1111-1111-111111111111',
      location: 'Hà Nội, Việt Nam',
      salary: 'Thỏa thuận',
      jobType: 'Toàn thời gian',
      experience: 'Fresher / Junior',
      posted: 'Đăng vào 2 ngày trước',
      level: 'medium',
      desc: 'Giám sát và phân tích các cảnh báo bảo mật từ hệ thống SIEM. Thực hiện ứng cứu sự cố bước đầu đối với các cuộc tấn công DDoS, Phishing, Malware. Hỗ trợ xây dựng các playbook ứng phó sự cố an ninh thông tin.'
    },
    {
      id: 'job-2',
      title: 'Pentest Specialist (Chuyên viên Kiểm thử Xâm nhập)',
      company: 'Viettel Cyber Security (VCS)',
      companyId: '11111111-1111-1111-1111-111111111111',
      location: 'Hà Nội, Việt Nam',
      salary: '25 - 45 triệu/tháng',
      jobType: 'Toàn thời gian',
      experience: '1 - 3 năm kinh nghiệm',
      posted: 'Đăng vào 5 ngày trước',
      level: 'medium',
      desc: 'Thực hiện đánh giá bảo mật, kiểm thử xâm nhập (Penetration Testing) đối với các ứng dụng Web, Mobile và hạ tầng mạng của Viettel và khách hàng tập đoàn. Đưa ra các báo cáo lỗ hổng chi tiết và giải pháp khắc phục.'
    },
    {
      id: 'job-3',
      title: 'Fullstack JavaScript Developer (React & Node.js)',
      company: 'VNG Corporation',
      companyId: '33333333-3333-3333-3333-333333333333',
      location: 'TP. Hồ Chí Minh, Việt Nam',
      salary: '20 - 38 triệu/tháng',
      jobType: 'Toàn thời gian',
      experience: '1 - 3 năm kinh nghiệm',
      posted: 'Đăng vào 1 tuần trước',
      level: 'medium',
      desc: 'Phát triển các sản phẩm công nghệ có lượng người dùng lớn (High Traffic) tại Zalo/Zing. Xây dựng giao diện web phản hồi nhanh bằng React.js và tối ưu hóa hệ thống backend microservices bằng Node.js.'
    },
    {
      id: 'job-4',
      title: 'DevOps & GPU Infrastructure Engineer',
      company: 'NVIDIA Vietnam',
      companyId: '55555555-5555-5555-5555-555555555555',
      location: 'Hà Nội, Việt Nam (Hybrid)',
      salary: 'Cực kỳ cạnh tranh',
      jobType: 'Toàn thời gian',
      experience: 'Senior (3+ năm)',
      posted: 'Đăng vào 3 ngày trước',
      level: 'hard',
      desc: 'Thiết lập và quản lý các cụm Kubernetes hiệu năng cao chạy GPU workloads cho các mô hình AI/Deep Learning. Tự động hóa hệ thống build CUDA bằng các pipeline CI/CD (GitHub Actions, Jenkins). Vận hành cơ sở hạ tầng dạng code (IaC) sử dụng Terraform.'
    },
    {
      id: 'job-5',
      title: 'Cloud System Administrator',
      company: 'FPT Smart Cloud',
      companyId: '66666666-6666-6666-6666-666666666666',
      location: 'Hà Nội, Việt Nam',
      salary: 'Thỏa thuận',
      jobType: 'Toàn thời gian',
      experience: '1 - 3 năm kinh nghiệm',
      posted: 'Đăng vào 2 tuần trước',
      level: 'medium',
      desc: 'Quản trị và giám sát hoạt động hệ thống hạ tầng Cloud lớn của FPT. Triển khai các giải pháp mạng ảo, cân bằng tải, sao lưu dữ liệu tự động. Hỗ trợ kỹ thuật hệ thống SRE 24/7.'
    }
  ];

  const [selectedJob, setSelectedJob] = useState(jobListings[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const filteredJobs = jobListings.filter(job => {
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

        {/* Filter tags inspired by X-Interview */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <Button variant="normal" size="sm">❤️ Yêu thích</Button>
          <Button variant="normal" size="sm">💼 Vị trí: Fullstack</Button>
          <Button variant="normal" size="sm">🕒 Loại việc</Button>
          <Button variant="normal" size="sm">💵 Mức lương</Button>
          <Button variant="normal" size="sm">⚡ Kinh nghiệm</Button>
        </div>
      </Container>

      {/* Split Layout: Left List, Right Detailed View */}
      <Grid gridDefinition={[{ colspan: 5 }, { colspan: 7 }]}>
        {/* Left column: listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Box variant="small" style={{ color: '#64748b', fontWeight: 'bold' }}>
            Hiển thị {filteredJobs.length} việc làm phù hợp
          </Box>

          {filteredJobs.map(job => {
            const isSelected = job.id === selectedJob.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  background: isSelected ? '#eff6ff' : '#ffffff',
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
                <Box variant="small" style={{ color: '#64748b', margin: '4px 0' }}>
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
                  <Box variant="p" style={{ color: '#3b82f6', fontWeight: 'bold', margin: '0 0 8px 0' }}>
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
                    <Box variant="h4" style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>
                      {selectedJob.salary}
                    </Box>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <Box variant="small" style={{ color: '#64748b' }}>⚡ KINH NGHIỆM</Box>
                    <Box variant="h4" style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>
                      {selectedJob.experience.split(' ')[0]} {selectedJob.experience.split(' ')[1] || ''}
                    </Box>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <Box variant="small" style={{ color: '#64748b' }}>👥 ỨNG VIÊN</Box>
                    <Box variant="h4" style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>
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
    </SpaceBetween>
  );
}
