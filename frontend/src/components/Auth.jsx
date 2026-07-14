import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Input,
  FormField,
  Box,
  Alert,
  Modal,
  Badge
} from '@cloudscape-design/components';

export default function Auth({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Google Account Chooser State
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleAccounts, setGoogleAccounts] = useState([]);
  
  // Custom new Google account registration
  const [showNewGoogleForm, setShowNewGoogleForm] = useState(false);
  const [newGoogleName, setNewGoogleName] = useState('');
  const [newGoogleEmail, setNewGoogleEmail] = useState('');

  // Load saved Google accounts on mount
  useEffect(() => {
    const saved = localStorage.getItem('x_google_accounts');
    if (saved) {
      setGoogleAccounts(JSON.parse(saved));
    } else {
      const defaults = [
        { id: 'g-1', name: 'Đức Tiến', email: 'ductien.dev@gmail.com', avatar: '🍀', role: 'candidate' },
        { id: 'g-2', name: 'Hoàng Interviewer', email: 'hoang.interviewer@gmail.com', avatar: '🎓', role: 'interviewer' }
      ];
      localStorage.setItem('x_google_accounts', JSON.stringify(defaults));
      setGoogleAccounts(defaults);
    }
  }, []);

  const handleGoogleSignInClick = () => {
    setShowGoogleChooser(true);
  };

  const handleSelectGoogleAccount = (acc) => {
    setLoading(true);
    setShowGoogleChooser(false);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: acc.id,
        email: acc.email,
        full_name: acc.name,
        role: acc.role || 'candidate'
      });
    }, 600);
  };

  const handleRegisterNewGoogleAccount = (e) => {
    e.preventDefault();
    if (!newGoogleName || !newGoogleEmail) {
      alert('Vui lòng nhập đầy đủ Tên và Email.');
      return;
    }

    const newAcc = {
      id: `g-${Date.now()}`,
      name: newGoogleName,
      email: newGoogleEmail,
      avatar: '🌟',
      role: newGoogleEmail.includes('interviewer') ? 'interviewer' : 'candidate'
    };

    const updated = [...googleAccounts, newAcc];
    localStorage.setItem('x_google_accounts', JSON.stringify(updated));
    setGoogleAccounts(updated);

    // Auto-login with the newly created account
    setShowNewGoogleForm(false);
    handleSelectGoogleAccount(newAcc);
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: 'user-email-auth',
        email: email,
        full_name: email.split('@')[0],
        role: email.includes('interviewer') ? 'interviewer' : 'candidate'
      });
    }, 1000);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)',
        padding: '20px'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Container>
          <SpaceBetween size="l" direction="vertical">
            {/* Header logo / title */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <Box variant="h1" style={{ fontSize: '32px', color: '#4f46e5', fontWeight: 'bold', margin: '0 0 6px 0' }}>
                VietInterview AI
              </Box>
              <Box variant="p" color="text-muted">
                {isSignUp ? 'Đăng ký tài khoản để bắt đầu' : 'Đăng nhập để luyện phỏng vấn cùng AI'}
              </Box>
            </div>

            {errorMsg && (
              <Alert type="error" dismissible onDismiss={() => setErrorMsg('')}>
                {errorMsg}
              </Alert>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignInClick}
              disabled={loading}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#1f2937',
                borderRadius: '30px',
                padding: '12px 16px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.56 2.69-3.86 2.69-6.6z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26a5.6 5.6 0 0 1-8.54-3v2.26H.6c1.48 2.95 4.54 4.96 8.04 4.96z"/>
                <path fill="#FBBC05" d="M3.51 10.54A5.38 5.38 0 0 1 3.2 9c0-.54.1-1.07.28-1.54V5.2H.6A8.99 8.99 0 0 0 0 9c0 1.37.3 2.68.84 3.84l2.67-2.3z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1A8.99 8.99 0 0 0 .6 5.2l2.91 2.3A5.6 5.6 0 0 1 9 3.58z"/>
              </svg>
              Đăng nhập bằng Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af' }}>
              <div style={{ flexGrow: 1, height: '1px', background: '#e5e7eb' }} />
              <span style={{ fontSize: '12px' }}>hoặc bằng Email</span>
              <div style={{ flexGrow: 1, height: '1px', background: '#e5e7eb' }} />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailAuth}>
              <SpaceBetween size="m" direction="vertical">
                <FormField label="Địa chỉ Email">
                  <Input
                    type="email"
                    value={email}
                    onChange={({ detail }) => setEmail(detail.value)}
                    placeholder="name@example.com"
                    disabled={loading}
                  />
                </FormField>
                <FormField label="Mật khẩu">
                  <Input
                    type="password"
                    value={password}
                    onChange={({ detail }) => setPassword(detail.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </FormField>
                
                <div style={{ marginTop: '10px' }}>
                  <Button variant="primary" stretch loading={loading}>
                    {isSignUp ? 'Đăng ký tài khoản' : 'Đăng nhập'}
                  </Button>
                </div>
              </SpaceBetween>
            </form>

            {/* Footer switcher */}
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#4b5563', marginTop: '10px' }}>
              {isSignUp ? (
                <span>
                  Đã có tài khoản?{' '}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setIsSignUp(false); }}
                    style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'none' }}
                  >
                    Đăng nhập
                  </a>
                </span>
              ) : (
                <span>
                  Chưa có tài khoản?{' '}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setIsSignUp(true); }}
                    style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'none' }}
                  >
                    Đăng ký miễn phí
                  </a>
                </span>
              )}
            </div>

            {/* Demo Quick Bypass */}
            <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onLoginSuccess({
                    id: '00000000-0000-0000-0000-000000000000',
                    email: 'guest@xinterview.com',
                    full_name: 'Khách hàng',
                    role: 'candidate'
                  });
                }}
                style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'underline' }}
              >
                Dùng thử nhanh không cần đăng nhập
              </a>
            </div>
          </SpaceBetween>
        </Container>
      </div>

      {/* Premium Google Account Chooser Modal */}
      <Modal
        onDismiss={() => {
          setShowGoogleChooser(false);
          setShowNewGoogleForm(false);
        }}
        visible={showGoogleChooser}
        header={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Google official logo */}
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: '8px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Chọn tài khoản</span>
            <span style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>để tiếp tục đến VietInterview AI</span>
          </div>
        }
      >
        <SpaceBetween size="m" direction="vertical">
          {showNewGoogleForm ? (
            // Form to create/register a new Google account if not in the list
            <form onSubmit={handleRegisterNewGoogleAccount} style={{ padding: '10px 0' }}>
              <SpaceBetween size="m" direction="vertical">
                <FormField label="Họ và Tên Google">
                  <Input
                    value={newGoogleName}
                    onChange={({ detail }) => setNewGoogleName(detail.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </FormField>
                <FormField label="Địa chỉ Gmail">
                  <Input
                    type="email"
                    value={newGoogleEmail}
                    onChange={({ detail }) => setNewGoogleEmail(detail.value)}
                    placeholder="example@gmail.com"
                  />
                </FormField>
                
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <Button variant="link" onClick={() => setShowNewGoogleForm(false)}>Quay lại</Button>
                  <Button variant="primary">Tạo & Đăng Nhập</Button>
                </div>
              </SpaceBetween>
            </form>
          ) : (
            // List of saved/available accounts
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' }}>
              {googleAccounts.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => handleSelectGoogleAccount(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #dadce0',
                    cursor: 'pointer',
                    background: '#ffffff',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f1f3f4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    {acc.avatar}
                  </div>
                  <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#3c4043' }}>{acc.name}</div>
                    <div style={{ fontSize: '11px', color: '#5f6368', textOverflow: 'ellipsis', overflow: 'hidden' }}>{acc.email}</div>
                  </div>
                  {acc.role === 'interviewer' && (
                    <Badge color="blue">Doanh nghiệp</Badge>
                  )}
                </div>
              ))}

              {/* Option to sign in with a new account (creating a new account in local state) */}
              <div
                onClick={() => {
                  setShowNewGoogleForm(true);
                  setNewGoogleName('');
                  setNewGoogleEmail('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px dashed #dadce0',
                  cursor: 'pointer',
                  background: '#fafafa',
                  color: '#1a73e8',
                  fontWeight: '500',
                  fontSize: '13px',
                  justifyContent: 'center',
                  marginTop: '6px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f3f4'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafafa'}
              >
                👤 Sử dụng một tài khoản khác (Tạo mới)
              </div>
            </div>
          )}

          <div style={{ fontSize: '11px', color: '#5f6368', textAlign: 'justify', lineHeight: '1.4', marginTop: '10px' }}>
            Để tiếp tục, Google sẽ chia sẻ tên, địa chỉ email, tùy chọn ngôn ngữ và ảnh hồ sơ của bạn với VietInterview AI. Hãy xem Chính sách bảo mật để biết thêm chi tiết.
          </div>
        </SpaceBetween>
      </Modal>
    </div>
  );
}
