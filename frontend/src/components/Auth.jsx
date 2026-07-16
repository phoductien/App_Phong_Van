import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function Auth({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Error/Success state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Google account list
  const [googleAccounts, setGoogleAccounts] = useState([]);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
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

    setShowNewGoogleForm(false);
    handleSelectGoogleAccount(newAcc);
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      // Sign Up validation
      if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
        setErrorMsg('Vui lòng nhập đầy đủ tất cả các trường.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('Bạn phải đồng ý với điều khoản sử dụng.');
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        
        // Save to unverified emails list to block direct login
        const unverified = JSON.parse(localStorage.getItem('x_unverified_emails') || '[]');
        if (!unverified.includes(email)) {
          unverified.push(email);
          localStorage.setItem('x_unverified_emails', JSON.stringify(unverified));
        }

        setSuccessMsg('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản (Link kích hoạt đã được gửi).');
        setIsSignUp(false);
      }, 1000);

    } else {
      // Sign In validation
      if (!email.trim() || !password) {
        setErrorMsg('Vui lòng nhập email và mật khẩu.');
        return;
      }

      // Check if email requires verification
      const unverified = JSON.parse(localStorage.getItem('x_unverified_emails') || '[]');
      if (unverified.includes(email)) {
        setErrorMsg(`Tài khoản ${email} chưa được xác thực. Vui lòng click vào link kích hoạt trong email của bạn.`);
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
          id: 'user-' + Date.now(),
          email: email,
          full_name: email.split('@')[0],
          role: email.includes('interviewer') ? 'interviewer' : 'candidate'
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {isSignUp ? 'Đăng ký để bắt đầu sử dụng X-interview' : 'Nhập thông tin đăng nhập để truy cập tài khoản của bạn'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 rounded-2xl sm:px-10">
          {errorMsg && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{errorMsg}</p>
              {errorMsg.includes('chưa được xác thực') && (
                <button
                  type="button"
                  onClick={() => {
                    const unverified = JSON.parse(localStorage.getItem('x_unverified_emails') || '[]');
                    const filtered = unverified.filter(e => e !== email);
                    localStorage.setItem('x_unverified_emails', JSON.stringify(filtered));
                    setSuccessMsg('Giả lập xác thực email thành công! Bạn hiện đã có thể đăng nhập.');
                    setErrorMsg('');
                  }}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline block"
                >
                  ⚡ Bấm vào đây để giả lập click Link kích hoạt Email của Supabase
                </button>
              )}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleEmailAuth}>
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    {/* User Icon */}
                    <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-slate-400 bg-slate-50/50"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  {/* Envelope Icon */}
                  <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-slate-400 bg-slate-50/50"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {isSignUp ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-slate-400 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-slate-400 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                  <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Quên mật khẩu?</a>
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-slate-400 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 width-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <input
                id="remember_or_agree"
                type="checkbox"
                checked={isSignUp ? agreeTerms : rememberMe}
                onChange={(e) => isSignUp ? setAgreeTerms(e.target.checked) : setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <label htmlFor="remember_or_agree" className="ml-2 block text-sm text-slate-700 select-none">
                {isSignUp ? (
                  <span>Tôi đồng ý với <span className="text-indigo-600 font-medium hover:underline cursor-pointer">điều khoản sử dụng</span>.</span>
                ) : (
                  'Ghi nhớ đăng nhập'
                )}
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : (isSignUp ? 'Đăng ký' : 'Đăng nhập')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Hoặc {isSignUp ? 'đăng ký' : 'đăng nhập'} với</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowGoogleChooser(true)}
                className="w-full inline-flex justify-center py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8.2 12.728a5.79 5.79 0 0 1 5.79-5.79c2.479 0 4.547 1.488 5.404 3.613l3.87-2.996C21.134 3.738 17.062 1 12 1 5.925 1 1 5.925 1 12s4.925 11 11 11c5.688 0 10.4-4.114 10.843-9.5H12.24z" />
                </svg>
                {isSignUp ? 'Đăng ký bằng Google' : 'Đăng nhập với Google'}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {isSignUp ? 'Bạn đã có tài khoản?' : 'Bạn chưa có tài khoản?'}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                {isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Modern custom Google account chooser modal */}
      {showGoogleChooser && (
        <div className="fixed z-50 inset-0 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 flex flex-col items-center">
            <svg className="h-10 w-10 mb-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <h3 className="text-lg font-bold text-slate-800 text-center">Chọn tài khoản</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">để tiếp tục đến X-Interview</p>

            {showNewGoogleForm ? (
              <form onSubmit={handleRegisterNewGoogleAccount} className="w-full space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Họ và Tên Google</label>
                  <input
                    type="text"
                    required
                    value={newGoogleName}
                    onChange={(e) => setNewGoogleName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Địa chỉ Gmail</label>
                  <input
                    type="email"
                    required
                    value={newGoogleEmail}
                    onChange={(e) => setNewGoogleEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewGoogleForm(false)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                  >
                    Tạo & Đăng Nhập
                  </button>
                </div>
              </form>
            ) : (
              <div className="w-full space-y-2 max-h-60 overflow-y-auto">
                {googleAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition duration-150"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-inner">
                      {acc.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{acc.name}</div>
                      <div className="text-xs text-slate-500 truncate">{acc.email}</div>
                    </div>
                    {acc.role === 'interviewer' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">HR/Admin</span>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setShowNewGoogleForm(true);
                    setNewGoogleName('');
                    setNewGoogleEmail('');
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-sm font-semibold text-indigo-600 hover:bg-slate-100/70 hover:border-indigo-400 transition duration-150 mt-4"
                >
                  <span>👤 Sử dụng một tài khoản khác (Tạo mới)</span>
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-between w-full">
              <button
                type="button"
                onClick={() => {
                  setShowGoogleChooser(false);
                  setShowNewGoogleForm(false);
                }}
                className="text-sm font-semibold text-slate-500 hover:text-slate-700"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess({
                    id: '00000000-0000-0000-0000-000000000000',
                    email: 'guest@xinterview.com',
                    full_name: 'Đức Tiến',
                    role: 'candidate'
                  });
                  setShowGoogleChooser(false);
                }}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Dùng tài khoản Khách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
