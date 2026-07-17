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

export default function CVProfile({ userId = '00000000-0000-0000-0000-000000000000' }) {
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
      <Container header={<Header variant="h2" actions={<Badge color="blue">{cvs.length} CV</Badge>}>Hồ Sơ Của Tôi</Header>}>
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
              return (
                <div
                  key={cv.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'between',
                    gap: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>📄</div>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexGrow: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }} title={filename}>
                        {filename}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        Tải lên: {new Date(cv.uploaded_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '12px',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <a
                      href={cv.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        color: '#4f46e5',
                        border: '1px solid #e0e7ff',
                        borderRadius: '6px',
                        background: '#e0e7ff',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
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
                        padding: '6px 12px',
                        fontSize: '12px',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        background: '#f3f4f6',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
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
