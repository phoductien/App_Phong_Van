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
  Alert,
  Spinner
} from '@cloudscape-design/components';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function CVProfile({ userId = '00000000-0000-0000-0000-000000000000', user = null }) {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cvInput, setCvInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fetchCvs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cv?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCvs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, [userId]);

  const handleUploadCv = async () => {
    if (!cvInput.trim()) return;
    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const res = await fetch(`${API_BASE}/api/cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fileUrl: cvInput })
      });
      if (res.ok) {
        setSuccessMsg('Đã đăng ký CV thành công vào hồ sơ của bạn.');
        setCvInput('');
        fetchCvs();
      } else {
        setErrorMsg('Không thể lưu CV mới.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi kết nối khi tải CV.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;
      try {
        setUploading(true);
        setErrorMsg('');
        setSuccessMsg('');
        const res = await fetch(`${API_BASE}/api/cv/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            filename: file.name,
            base64Data: base64Data
          })
        });

        if (res.ok) {
          setSuccessMsg(`Đã tải lên tệp CV "${file.name}" thành công.`);
          fetchCvs();
        } else {
          const errData = await res.json();
          setErrorMsg(errData.error || 'Lỗi khi tải file CV lên.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Lỗi kết nối máy chủ khi upload file.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <SpaceBetween size="l" direction="vertical">
      <Container header={<Header variant="h2" description="Quản lý hồ sơ CV và thư mời xin việc của bạn">Hồ Sơ CV</Header>}>
        {errorMsg && <Alert type="error" dismissible onDismiss={() => setErrorMsg('')}>{errorMsg}</Alert>}
        {successMsg && <Alert type="success" dismissible onDismiss={() => setSuccessMsg('')}>{successMsg}</Alert>}

        {/* Upload simulated dropzone area matching image 4 */}
        <input
          type="file"
          id="profile-cv-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div
          onClick={() => {
            if (!uploading) {
              document.getElementById('profile-cv-upload').click();
            }
          }}
          style={{
            border: '2px dashed #6366f1',
            borderRadius: '12px',
            padding: '40px 20px',
            background: '#f8fafc',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          {uploading ? (
            <>
              <Spinner size="large" />
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#6366f1' }}>
                Đang tải tệp lên hệ thống...
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '40px' }}>☁️</div>
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1e293b' }}>
                Kéo và thả tệp vào đây hoặc nhấp để duyệt
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Định dạng hỗ trợ: PDF, DOC, DOCX (Kích thước tối đa: 10MB)
              </div>
            </>
          )}
        </div>

        {/* Quick URL form */}
        <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <SpaceBetween direction="horizontal" size="xs">
            <div style={{ flexGrow: 1 }}>
              <Input
                value={cvInput}
                onChange={({ detail }) => setCvInput(detail.value)}
                placeholder="Nhập đường dẫn URL file CV PDF của bạn (Ví dụ: https://example.com/my_cv.pdf)..."
              />
            </div>
            <Button variant="primary" onClick={handleUploadCv} disabled={!cvInput.trim()}>
              Thêm hồ sơ
            </Button>
          </SpaceBetween>
        </div>
      </Container>

      {/* Uploaded CVs list */}
      <Container header={<Header variant="h2" actions={<Badge color="blue">{cvs.length} CV</Badge>}>Hồ sơ CV đã tải lên (TopCV Style)</Header>}>
        {loading ? (
          <Box variant="p" style={{ textAlign: 'center' }}>
            <Spinner size="large" />
          </Box>
        ) : cvs.length === 0 ? (
          <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '30px 0' }}>
            Chưa có hồ sơ CV nào được lưu trữ. Vui lòng tải lên ở bảng trên.
          </Box>
        ) : (
          <Grid gridDefinition={cvs.map(() => ({ colspan: 4 }))}>
            {cvs.map(cv => {
              const filename = cv.file_url.split('/').pop();
              const formattedDate = new Date(cv.uploaded_at).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
              return (
                <div
                  key={cv.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '8px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s'
                  }}
                >
                  {/* Stylized Miniature CV Template */}
                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      background: '#ffffff',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                      width: '100%',
                      aspectRatio: '1 / 1.4',
                      overflow: 'hidden',
                      position: 'relative',
                      fontSize: '8px',
                      lineHeight: '1.4',
                      color: '#334155',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      borderTop: '5px solid #00b14f'
                    }}
                  >
                    {/* CV Header */}
                    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <div 
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: '#f1f5f9', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '16px',
                          overflow: 'hidden',
                          border: '1px solid #cbd5e1',
                          flexShrink: 0
                        }}
                      >
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          user?.avatar || '👤'
                        )}
                      </div>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '700', fontSize: '9px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user?.full_name || 'Phó Đức Tiến'}
                        </div>
                        <div style={{ color: '#00b14f', fontWeight: '600', fontSize: '7px' }}>
                          {user?.role === 'interviewer' ? 'Senior Technical Interviewer' : 'Developer Intern'}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', color: '#64748b', fontSize: '6px', marginTop: '2px' }}>
                          <div style={{ whiteSpace: 'nowrap' }}>📅 26/02/2004</div>
                          <div style={{ whiteSpace: 'nowrap' }}>📞 0819748812</div>
                          <div style={{ gridColumn: 'span 2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>✉️ {user?.email || 'ductien.dev@gmail.com'}</div>
                        </div>
                      </div>
                    </div>

                    {/* CV Content Sections */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden', flexGrow: 1 }}>
                      {/* Profiles */}
                      <div>
                        <div style={{ fontWeight: '700', color: '#00b14f', borderBottom: '1px solid #f1f5f9', paddingBottom: '1px', fontSize: '7px', letterSpacing: '0.5px' }}>PROFILES</div>
                        <div style={{ color: '#475569', fontSize: '6.5px', marginTop: '2px' }}>
                          Sinh viên ngành Công nghệ thông tin định hướng phát triển phần mềm và tối ưu hóa hệ thống.
                        </div>
                      </div>

                      {/* Educations */}
                      <div>
                        <div style={{ fontWeight: '700', color: '#00b14f', borderBottom: '1px solid #f1f5f9', paddingBottom: '1px', fontSize: '7px', letterSpacing: '0.5px' }}>EDUCATIONS</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '6.5px', marginTop: '2px', fontWeight: '600', color: '#334155' }}>
                          <span>Đại học Thủ Dầu Một</span>
                          <span style={{ color: '#64748b', fontWeight: 'normal' }}>2022 - 2027</span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '6px' }}>Ngành Công nghệ thông tin</div>
                      </div>

                      {/* Skills */}
                      <div>
                        <div style={{ fontWeight: '700', color: '#00b14f', borderBottom: '1px solid #f1f5f9', paddingBottom: '1px', fontSize: '7px', letterSpacing: '0.5px' }}>SKILLS</div>
                        <ul style={{ paddingLeft: '8px', margin: '2px 0 0 0', listStyleType: 'disc', fontSize: '6.5px', color: '#475569' }}>
                          <li>Web Development (React, Node.js)</li>
                          <li>Android App Development & Git</li>
                        </ul>
                      </div>

                      {/* Projects */}
                      <div>
                        <div style={{ fontWeight: '700', color: '#00b14f', borderBottom: '1px solid #f1f5f9', paddingBottom: '1px', fontSize: '7px', letterSpacing: '0.5px' }}>PROJECTS</div>
                        <div style={{ fontSize: '6.5px', marginTop: '2px', fontWeight: '600', color: '#334155' }}>X-Interview Platform (Team Leader)</div>
                        <div style={{ color: '#64748b', fontSize: '6px' }}>Hệ thống luyện phỏng vấn tích hợp AI thông minh.</div>
                      </div>
                    </div>
                  </div>

                  {/* CV Metadata */}
                  <div style={{ padding: '0 4px', flexGrow: 1, minWidth: 0 }}>
                    <div 
                      style={{ 
                        fontWeight: '700', 
                        fontSize: '13px', 
                        color: '#1e293b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={filename}
                    >
                      {filename.length > 22 ? filename.substring(0, 19) + '...' : filename}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Cập nhật {formattedDate}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      borderTop: '1px solid #e2e8f0',
                      paddingTop: '10px',
                      justifyContent: 'space-between'
                    }}
                  >
                    <a
                      href={cv.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '6px 0',
                        fontSize: '12px',
                        color: '#00b14f',
                        border: '1px solid #00b14f',
                        borderRadius: '6px',
                        background: '#ffffff',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      👁️ Xem
                    </a>
                    <a
                      href={cv.file_url}
                      download={filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '6px 0',
                        fontSize: '12px',
                        color: '#ffffff',
                        border: '1px solid #00b14f',
                        borderRadius: '6px',
                        background: '#00b14f',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      📥 Tải về
                    </a>
                  </div>
                </div>
              );
            })}
          </Grid>
        )}
      </Container>
    </SpaceBetween>
  );
}
