import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Supabase init error:", err.message);
  }
}

export default function Auth({ onLoginSuccess, initialSignUp = false, onBackToLanding = null }) {
  const [isSignUp, setIsSignUp] = useState(initialSignUp);
  const [signupRole, setSignupRole] = useState('candidate');
  const [signinRole, setSigninRole] = useState('candidate');
  const [lang, setLang] = useState('vi');
  const [darkMode, setDarkMode] = useState(false);

  const t = {
    vi: {
      promoTitle: 'Chinh phục buổi phỏng vấn tiếp theo cùng AI',
      promoDesc: 'Nhận phản hồi cá nhân hóa, xây dựng sự tự tin và tiến gần hơn đến công việc mơ ước qua các buổi phỏng vấn thử thông minh.',
      loginTitle: 'Đăng nhập',
      registerTitle: 'Tạo tài khoản',
      loginDesc: 'Nhập thông tin đăng nhập để truy cập tài khoản của bạn',
      registerDesc: 'Đăng ký để bắt đầu sử dụng Viet-Interview',
      fullName: 'Họ và tên',
      email: 'Địa chỉ Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      rememberMe: 'Ghi nhớ đăng nhập',
      forgotPassword: 'Quên mật khẩu?',
      agreeTerms: 'Tôi đồng ý với điều khoản sử dụng.',
      candidate: 'Ứng viên (Candidate)',
      interviewer: 'Nhà tuyển dụng (Recruiter)',
      selectRole: 'Chọn vai trò đăng ký',
      signInGoogle: 'Tiếp tục với Google',
      dontHaveAccount: 'Bạn chưa có tài khoản?',
      alreadyHaveAccount: 'Bạn đã có tài khoản?',
      signUpNow: 'Đăng ký ngay',
      signInNow: 'Đăng nhập ngay',
      simulateVerification: '⚡ Bấm vào đây để giả lập click Link kích hoạt Email của Supabase',
      googleChooserTitle: 'Chọn tài khoản Google giả lập',
      addNewGoogleAcc: '➕ Tạo tài khoản Google mới để test',
      orSeparator: 'Hoặc đăng nhập bằng email',
      orSeparatorRegister: 'Hoặc đăng ký bằng email',
      loginSuccess: 'Đăng nhập thành công!',
      registerSuccess: 'Đăng ký tài khoản thành công!',
      unverifiedEmail: 'Email của bạn chưa được xác thực! Vui lòng kiểm tra hộp thư.',
      termsWarning: 'Bạn cần đồng ý với điều khoản sử dụng để tiếp tục.',
      passwordMismatch: 'Mật khẩu xác nhận không khớp.',
      loadingText: 'Đang xử lý...',
      enterNameEmail: 'Vui lòng điền đầy đủ thông tin.',
    },
    en: {
      promoTitle: 'Conquer your next interview with AI',
      promoDesc: 'Receive personalized feedback, build confidence, and get closer to your dream job through smart mock interviews.',
      loginTitle: 'Sign In',
      registerTitle: 'Create Account',
      loginDesc: 'Enter your credentials to access your account',
      registerDesc: 'Register to start using Viet-Interview',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      agreeTerms: 'I agree to the terms of use.',
      candidate: 'Candidate',
      interviewer: 'Recruiter',
      selectRole: 'Choose your registration role',
      signInGoogle: 'Continue with Google',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      signUpNow: 'Sign Up now',
      signInNow: 'Sign In now',
      simulateVerification: '⚡ Click here to simulate clicking the Supabase Email activation link',
      googleChooserTitle: 'Select Mock Google Account',
      addNewGoogleAcc: '➕ Create new mock Google account',
      orSeparator: 'Or sign in with email',
      orSeparatorRegister: 'Or register with email',
      loginSuccess: 'Login successful!',
      registerSuccess: 'Account registered successfully!',
      unverifiedEmail: 'Your email is unverified! Please check your inbox.',
      termsWarning: 'You must agree to the terms of use to continue.',
      passwordMismatch: 'Confirm password does not match.',
      loadingText: 'Processing...',
      enterNameEmail: 'Please fill in all information.',
    }
  };

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

  // Custom mock Google accounts chooser modal
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [showNewGoogleForm, setShowNewGoogleForm] = useState(false);
  const [newGoogleName, setNewGoogleName] = useState('');
  const [newGoogleEmail, setNewGoogleEmail] = useState('');

  const [googleAccounts, setGoogleAccounts] = useState(() => {
    const saved = localStorage.getItem('x_google_accounts');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Đức Tiến', email: 'ductien.dev@gmail.com', avatar: '🍀', role: 'candidate', tier: 'free' },
      { id: '2', name: 'Hoàng Interviewer', email: 'hoang.interviewer@gmail.com', avatar: '🎓', role: 'interviewer', tier: 'free' }
    ];
  });

  const handleSelectGoogleAccount = (acc) => {
    // Validate role mismatch
    if (signinRole === 'candidate' && acc.role === 'interviewer') {
      alert(lang === 'vi' 
        ? 'Tài khoản Google này là tài khoản Nhà tuyển dụng. Vui lòng đăng nhập ở cổng Doanh nghiệp.' 
        : 'This Google account is a Recruiter account. Please sign in via the Employer portal.'
      );
      return;
    }
    if (signinRole === 'interviewer' && acc.role === 'candidate') {
      alert(lang === 'vi' 
        ? 'Tài khoản Google này là tài khoản Ứng viên. Vui lòng đăng nhập ở cổng Ứng viên.' 
        : 'This Google account is a Candidate account. Please sign in via the Candidate portal.'
      );
      return;
    }
    onLoginSuccess(acc);
    setShowGoogleChooser(false);
  };

  const handleRegisterNewGoogleAccount = (e) => {
    e.preventDefault();
    if (!newGoogleName || !newGoogleEmail) {
      alert(lang === 'vi' ? 'Vui lòng nhập đầy đủ Tên và Email.' : 'Please enter Name and Email.');
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

  const handleGoogleLogin = async () => {
    if (supabase) {
      setLoading(true);
      setErrorMsg('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        setErrorMsg('Lỗi đăng nhập Google: ' + error.message);
        setLoading(false);
      }
    } else {
      setShowGoogleChooser(true);
    }
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      // Sign Up validation
      if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
        setErrorMsg(lang === 'vi' ? 'Vui lòng nhập đầy đủ tất cả các trường.' : 'Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(lang === 'vi' ? 'Mật khẩu xác nhận không trùng khớp.' : 'Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg(lang === 'vi' ? 'Bạn phải đồng ý với điều khoản sử dụng.' : 'You must agree to the terms.');
        return;
      }

      // Check for duplicate emails in local storage
      const localUsers = JSON.parse(localStorage.getItem('x_local_users') || '[]');
      if (localUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setErrorMsg(lang === 'vi' ? 'Email này đã được đăng ký trên hệ thống.' : 'This email is already registered.');
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        
        // Save user details to local storage
        localUsers.push({
          email: email.toLowerCase(),
          password: password,
          fullName: fullName,
          role: signupRole
        });
        localStorage.setItem('x_local_users', JSON.stringify(localUsers));

        // Save to unverified emails list to block direct login
        const unverified = JSON.parse(localStorage.getItem('x_unverified_emails') || '[]');
        if (!unverified.includes(email)) {
          unverified.push(email);
          localStorage.setItem('x_unverified_emails', JSON.stringify(unverified));
        }

        setSuccessMsg(lang === 'vi' 
          ? 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản (Link kích hoạt đã được gửi).' 
          : 'Registration successful! Please check your email to verify your account.'
        );
        setIsSignUp(false);
      }, 1000);

    } else {
      // Sign In validation
      if (!email.trim() || !password) {
        setErrorMsg(lang === 'vi' ? 'Vui lòng nhập email và mật khẩu.' : 'Please enter email and password.');
        return;
      }

      // Check if email requires verification
      const unverified = JSON.parse(localStorage.getItem('x_unverified_emails') || '[]');
      if (unverified.includes(email)) {
        setErrorMsg(lang === 'vi' 
          ? `Tài khoản ${email} chưa được xác thực. Vui lòng click vào link kích hoạt trong email của bạn.` 
          : `Account ${email} is unverified. Please check your inbox for activation link.`
        );
        return;
      }

      // Verify login details from local storage
      const localUsers = JSON.parse(localStorage.getItem('x_local_users') || '[]');
      const userMatch = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (userMatch) {
        if (userMatch.password !== password) {
          setErrorMsg(lang === 'vi' ? 'Mật khẩu nhập vào không chính xác.' : 'Incorrect password.');
          return;
        }

        // Validate sign-in role mismatch
        if (signinRole === 'candidate' && userMatch.role === 'interviewer') {
          setErrorMsg(lang === 'vi' 
            ? 'Tài khoản này là tài khoản Nhà tuyển dụng. Vui lòng đăng nhập ở cổng Doanh nghiệp.' 
            : 'This is a Recruiter account. Please sign in via the Employer portal.'
          );
          return;
        }
        if (signinRole === 'interviewer' && userMatch.role === 'candidate') {
          setErrorMsg(lang === 'vi' 
            ? 'Tài khoản này là tài khoản Ứng viên. Vui lòng đăng nhập ở cổng Ứng viên.' 
            : 'This is a Candidate account. Please sign in via the Candidate portal.'
          );
          return;
        }

        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          onLoginSuccess({
            id: 'user-' + Date.now(),
            email: userMatch.email,
            full_name: userMatch.fullName,
            role: userMatch.role,
            tier: userMatch.tier || 'free'
          });
        }, 1000);
      } else {
        // Fallback auto-resolve logic for quick development login
        const resolvedRole = (email.includes('interviewer') || email.includes('recruiter')) ? 'interviewer' : 'candidate';
        
        // Validate sign-in role mismatch for fallback
        if (signinRole === 'candidate' && resolvedRole === 'interviewer') {
          setErrorMsg(lang === 'vi' 
            ? 'Tài khoản này là tài khoản Nhà tuyển dụng. Vui lòng đăng nhập ở cổng Doanh nghiệp.' 
            : 'This is a Recruiter account. Please sign in via the Employer portal.'
          );
          return;
        }
        if (signinRole === 'interviewer' && resolvedRole === 'candidate') {
          setErrorMsg(lang === 'vi' 
            ? 'Tài khoản này là tài khoản Ứng viên. Vui lòng đăng nhập ở cổng Ứng viên.' 
            : 'This is a Candidate account. Please sign in via the Candidate portal.'
          );
          return;
        }

        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          onLoginSuccess({
            id: 'user-' + Date.now(),
            email: email,
            full_name: email.split('@')[0],
            role: resolvedRole,
            tier: 'free'
          });
        }, 1000);
      }
    }
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'}`}>
      {/* LEFT PANEL: Branding & Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-[50%] bg-gradient-to-tr from-[#312e81] via-[#1e1b4b] to-[#4c1d95] text-white p-16 flex-col justify-between relative overflow-hidden select-none">
        {/* Background Decorative rotated squares */}
        <div className="absolute top-10 left-10 w-24 h-24 border border-white/5 bg-white/5 rotate-45 rounded-2xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 border border-white/5 bg-white/5 rotate-45 rounded-xl pointer-events-none"></div>
        <div className="absolute bottom-40 left-12 w-20 h-20 border border-white/5 bg-white/5 rotate-45 rounded-2xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-32 h-32 border border-white/5 bg-white/5 rotate-45 rounded-3xl pointer-events-none"></div>

        {/* Header Logo */}
        <div className="flex items-center z-10">
          <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
            <path d="M20 30L45 50L20 70" stroke="url(#logo_grad1)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M80 30L55 50L80 70" stroke="url(#logo_grad2)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M45 50L55 50" stroke="#818cf8" strokeWidth="12" strokeLinecap="round"/>
            <defs>
              <linearGradient id="logo_grad1" x1="20" y1="30" x2="45" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="logo_grad2" x1="80" y1="30" x2="55" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            Viet-Interview
          </span>
        </div>

        {/* Center Promotion */}
        <div className="my-auto z-10 max-w-lg space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            {t[lang].promoTitle}
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            {t[lang].promoDesc}
          </p>
        </div>

        {/* Footer */}
        <div className="text-sm text-slate-400 z-10">
          © 2026 HKT Software
        </div>
      </div>

      {/* RIGHT PANEL: Form Container */}
      <div className={`w-full lg:w-[50%] flex flex-col justify-center relative px-6 sm:px-12 lg:px-20 py-12 transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}>
        {/* Language selector and Dark Mode mock */}
        <div className="absolute top-6 right-8 flex items-center space-x-3">

          <div 
            onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 border rounded-lg text-sm font-semibold shadow-sm cursor-pointer transition duration-150 ${
              darkMode 
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="text-base">{lang === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
            <span>{lang === 'vi' ? 'Tiếng Việt' : 'English'}</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button 
            type="button" 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 border rounded-lg shadow-sm transition duration-150 cursor-pointer ${
              darkMode 
                ? 'border-slate-700 bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Form content */}
        <div key={isSignUp ? 'signup' : 'signin'} className="w-full max-w-md mx-auto space-y-6 animate-fade-in-up">
          <div>
            <h2 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {isSignUp ? t[lang].registerTitle : t[lang].loginTitle}
            </h2>
            <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {isSignUp ? t[lang].registerDesc : t[lang].loginDesc}
            </p>
          </div>

          <div className={`transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            {errorMsg && (
              <div className={`mb-4 border-l-4 p-4 rounded-md ${darkMode ? 'bg-red-950/20 border-red-500 text-red-200' : 'bg-red-50 border-red-500 text-red-700'}`}>
                <p className="text-sm">{errorMsg}</p>
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
                    className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline block"
                  >
                    ⚡ {lang === 'vi' ? 'Bấm vào đây để giả lập click Link kích hoạt Email của Supabase' : 'Click here to simulate Supabase Email link verification'}
                  </button>
                )}
              </div>
            )}

            {successMsg && (
              <div className={`mb-4 border-l-4 p-4 rounded-md ${darkMode ? 'bg-green-950/20 border-green-500 text-green-200' : 'bg-green-50 border-green-500 text-green-700'}`}>
                <p className="text-sm">{successMsg}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleEmailAuth}>
              {isSignUp && (
                <>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t[lang].fullName}</label>
                    <div className="mt-1.5 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-505' 
                            : 'bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t[lang].selectRole}</label>
                    <div className="mt-1.5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSignupRole('candidate')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition duration-150 ${
                          signupRole === 'candidate'
                            ? (darkMode ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300' : 'border-indigo-600 bg-indigo-50 text-indigo-700')
                            : (darkMode ? 'border-slate-700 bg-slate-800/40 text-slate-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')
                        }`}
                      >
                        <span>💼 {lang === 'vi' ? 'Ứng viên' : 'Candidate'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignupRole('interviewer')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition duration-150 ${
                          signupRole === 'interviewer'
                            ? (darkMode ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300' : 'border-indigo-600 bg-indigo-50 text-indigo-700')
                            : (darkMode ? 'border-slate-700 bg-slate-800/40 text-slate-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')
                        }`}
                      >
                        <span>🏢 {lang === 'vi' ? 'Nhà tuyển dụng' : 'Recruiter'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!isSignUp && (
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {lang === 'vi' ? 'Bạn đăng nhập với vai trò:' : 'Sign in as:'}
                  </label>
                  <div className="flex gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSigninRole('candidate');
                        setErrorMsg('');
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition duration-150 ${
                        signinRole === 'candidate'
                          ? (darkMode ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300' : 'border-indigo-600 bg-indigo-50 text-indigo-700')
                          : (darkMode ? 'border-slate-700 bg-slate-800/40 text-slate-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')
                      }`}
                    >
                      <span>💼 {lang === 'vi' ? 'Ứng viên' : 'Candidate'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSigninRole('interviewer');
                        setErrorMsg('');
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition duration-150 ${
                        signinRole === 'interviewer'
                          ? (darkMode ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300' : 'border-indigo-600 bg-indigo-50 text-indigo-700')
                          : (darkMode ? 'border-slate-700 bg-slate-800/40 text-slate-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')
                      }`}
                    >
                      <span>🏢 {lang === 'vi' ? 'Doanh nghiệp' : 'Employer'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                <div className="mt-1.5 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-505' 
                        : 'bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {isSignUp ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t[lang].password}</label>
                    <div className="mt-1.5 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-505' 
                            : 'bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-slate-350' : 'text-slate-700'}`}>{t[lang].confirmPassword}</label>
                    <div className="mt-1.5 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-505' 
                            : 'bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-655 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t[lang].password}</label>
                    <a href="#" className="text-sm font-semibold text-indigo-650 hover:text-indigo-500">{t[lang].forgotPassword}</a>
                  </div>
                  <div className="mt-1.5 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200 ${
                        darkMode 
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-505' 
                          : 'bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember_or_agree" className={`ml-2 block text-sm select-none ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {isSignUp ? (
                    <span>{lang === 'vi' ? 'Tôi đồng ý với ' : 'I agree to the '}<span className="text-indigo-600 font-semibold hover:underline cursor-pointer">{lang === 'vi' ? 'điều khoản sử dụng' : 'terms of use'}</span>.</span>
                  ) : (
                    t[lang].rememberMe
                  )}
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>{loading ? t[lang].loadingText : (isSignUp ? t[lang].registerTitle : t[lang].loginTitle)}</span>
                  {!loading && (
                    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'}`}>
                    {isSignUp ? t[lang].orSeparatorRegister : t[lang].orSeparator}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border text-sm font-medium shadow-sm transition duration-150 ease-in-out cursor-pointer ${
                    darkMode 
                      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  {t[lang].signInGoogle}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {isSignUp ? t[lang].alreadyHaveAccount : t[lang].dontHaveAccount}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-bold text-indigo-650 hover:text-indigo-500 focus:outline-none cursor-pointer"
                >
                  {isSignUp ? t[lang].loginTitle : t[lang].signUpNow}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern custom Google account chooser modal */}
      {showGoogleChooser && (
        <div className="fixed z-50 inset-0 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-xl border flex flex-col items-center transition-colors duration-300 ${
            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
          }`}>
            <svg className="h-10 w-10 mb-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <h3 className={`text-lg font-bold text-center ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t[lang].googleChooserTitle}</h3>
            <p className={`text-xs mt-1 mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{lang === 'vi' ? 'để tiếp tục đến Viet-Interview' : 'to continue to Viet-Interview'}</p>

            {showNewGoogleForm ? (
              <form onSubmit={handleRegisterNewGoogleAccount} className="w-full space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{lang === 'vi' ? 'Họ và Tên Google' : 'Google Name'}</label>
                  <input
                    type="text"
                    required
                    value={newGoogleName}
                    onChange={(e) => setNewGoogleName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className={`mt-1 block w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{lang === 'vi' ? 'Địa chỉ Gmail' : 'Gmail Address'}</label>
                  <input
                    type="email"
                    required
                    value={newGoogleEmail}
                    onChange={(e) => setNewGoogleEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className={`mt-1 block w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewGoogleForm(false)}
                    className={`px-3 py-1.5 border rounded-xl text-sm font-semibold transition ${
                      darkMode ? 'border-slate-700 bg-slate-700 text-slate-300 hover:bg-slate-600' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lang === 'vi' ? 'Quay lại' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                  >
                    {lang === 'vi' ? 'Tạo & Đăng Nhập' : 'Create & Sign In'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="w-full space-y-2 max-h-60 overflow-y-auto">
                {googleAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition duration-150 ${
                      darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-inner">
                      {acc.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>{acc.name}</div>
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
                  className={`w-full flex items-center justify-center gap-2 p-3 border border-dashed rounded-xl text-sm font-semibold transition duration-150 mt-4 cursor-pointer ${
                    darkMode 
                      ? 'border-indigo-500/50 bg-indigo-950/20 text-indigo-400 hover:bg-indigo-950/30' 
                      : 'border-slate-300 bg-slate-50 text-indigo-600 hover:bg-slate-100/70 hover:border-indigo-400'
                  }`}
                >
                  <span>👤 {lang === 'vi' ? 'Sử dụng một tài khoản khác' : 'Use another mock account'}</span>
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
                className={`text-sm font-semibold ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {lang === 'vi' ? 'Hủy bỏ' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess({
                    id: '00000000-0000-0000-0000-000000000000',
                    email: 'guest@vietinterview.com',
                    full_name: lang === 'vi' ? 'Ứng Viên Khách' : 'Guest Candidate',
                    role: 'candidate',
                    tier: 'free'
                  });
                  setShowGoogleChooser(false);
                }}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                {lang === 'vi' ? 'Dùng tài khoản Khách' : 'Use Guest Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
