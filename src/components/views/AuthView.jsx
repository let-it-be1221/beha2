import React, { useState } from 'react';
import './auth.css';
import { Moon, Sun, Globe, Eye, EyeOff, X, Phone, ShieldCheck } from 'lucide-react';

export const AuthView = ({
  theme,
  toggleTheme,
  lang,
  setLang,
  t,
  onLogin,
  onSignUp,
  onGuestMode
}) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  
  // Login form state
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [signupUserId, setSignupUserId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status & modal states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!userId.trim()) {
      setErrorMsg(lang === 'am' ? 'እባክዎን የተጠቃሚ መለያዎን ያስገቡ' : 'Please enter your User ID');
      return;
    }
    if (!password) {
      setErrorMsg(lang === 'am' ? 'እባክዎን የይለፍ ቃልዎን ያስገቡ' : 'Please enter your Password');
      return;
    }

    // Authenticate user
    setSuccessMsg(lang === 'am' ? 'በተሳካ ሁኔታ ገብተዋል...' : 'Logging in successfully...');
    setTimeout(() => {
      onLogin({
        userId: userId.trim(),
        name: userId.trim(),
        role: 'Marketing Agent'
      });
    }, 400);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg(lang === 'am' ? 'እባክዎን ሙሉ ስምዎን ያስገቡ' : 'Please enter your Full Name');
      return;
    }
    if (!signupUserId.trim()) {
      setErrorMsg(lang === 'am' ? 'እባክዎን ስልክ ወይም መለያ ያስገቡ' : 'Please enter your Phone or User ID');
      return;
    }
    if (!signupPassword) {
      setErrorMsg(lang === 'am' ? 'እባክዎን የይለፍ ቃል ያስገቡ' : 'Please enter a Password');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg(lang === 'am' ? 'የይለፍ ቃሎቹ አይዛመዱም' : 'Passwords do not match');
      return;
    }

    setSuccessMsg(lang === 'am' ? 'መለያዎ በተሳካ ሁኔታ ተፈጥሯል...' : 'Account created successfully!');
    setTimeout(() => {
      onSignUp({
        userId: signupUserId.trim(),
        name: fullName.trim(),
        role: 'Marketing Agent'
      });
    }, 500);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-device-card">
        {/* 1. Header Bar: Logo & Utility Controls */}
        <header className="auth-header-top">
          <div className="auth-logo-group" onClick={() => setMode('login')} title="Beha Real Estate Marketing">
            {/* Inline SVG Ribbon matching the exact Beha brand ribbon loop */}
            <svg className="auth-logo-svg" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="behaAuthRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A8A"/>
                  <stop offset="25%" stopColor="#2563EB"/>
                  <stop offset="50%" stopColor="#06B6D4"/>
                  <stop offset="75%" stopColor="#FBBF24"/>
                  <stop offset="100%" stopColor="#10B981"/>
                </linearGradient>
              </defs>
              <path 
                d="M 22 92 C 6 92 4 68 15 42 C 26 15 48 15 58 42 L 68 76 C 78 95 98 95 106 74 C 114 50 112 24 98 16" 
                stroke="url(#behaAuthRibbon)" 
                strokeWidth="15" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M 58 42 C 68 15 90 15 100 42 L 104 64" 
                stroke="url(#behaAuthRibbon)" 
                strokeWidth="15" 
                strokeLinecap="round" 
              />
            </svg>
            <span className="auth-logo-text">Beha</span>
          </div>

          <div className="auth-top-actions">
            {/* Dark/Light Mode Toggle */}
            <button 
              className="auth-icon-btn" 
              onClick={toggleTheme} 
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#3b82f6" />}
            </button>

            {/* Language Switcher */}
            <button 
              className="auth-icon-btn" 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              title="Toggle Language"
            >
              <Globe size={16} color="#06b6d4" />
              <span>{lang === 'en' ? 'አማ' : 'EN'}</span>
            </button>

            {/* Blue Guest Mode Pill */}
            <button 
              className="auth-guest-btn" 
              onClick={onGuestMode}
              title="Enter Dashboard in Guest Preview Mode"
            >
              {t.guestMode || 'Guest Mode'}
            </button>
          </div>
        </header>

        {/* 2. Hero Graphic Banner with Binary digits, team & skyscraper */}
        <div className="auth-hero-banner">
          <img 
            src="/images/beha_login_hero.jpg" 
            alt="Beha Marketing Team" 
            className="auth-hero-img"
          />
          {/* Blue Divider Line */}
          <div className="auth-hero-blue-line" />
          
          {/* Deckle Torn-Paper Edge SVG */}
          <div className="auth-torn-edge-wrap">
            <svg 
              className="auth-torn-svg" 
              viewBox="0 0 1200 40" 
              preserveAspectRatio="none"
            >
              <path d="M0,0 L1200,0 L1200,18 Q1150,34 1100,16 Q1050,4 1000,24 Q940,36 880,18 Q820,6 760,26 Q700,34 640,14 Q580,4 520,28 Q460,36 400,16 Q340,6 280,30 Q220,36 160,14 Q100,6 50,22 Q25,28 0,16 Z" />
            </svg>
          </div>
        </div>

        {/* 3. Form Body Container */}
        <div className="auth-body-container">
          {/* Mode Header */}
          <h1 className="auth-title">
            {mode === 'login' ? (t.login || 'Login') : (t.signUp || 'Sign Up')}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login' ? (t.loginSubtitle || 'Sign in to continue') : (t.signUpSubtitle || 'Create your account to continue')}
          </p>

          {/* Feedback messages */}
          {errorMsg && <div className="auth-alert-msg error">{errorMsg}</div>}
          {successMsg && <div className="auth-alert-msg success">{successMsg}</div>}

          {/* Form */}
          {mode === 'login' ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              {/* User ID Field */}
              <div className="auth-input-wrap">
                <input 
                  type="text" 
                  className="auth-pill-input no-icon" 
                  placeholder={t.userIdPlaceholder || 'User ID'} 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  autoComplete="username"
                  autoFocus
                />
              </div>

              {/* Password Field */}
              <div className="auth-input-wrap">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="auth-pill-input" 
                  placeholder={t.passwordPlaceholder || '********'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className="auth-eye-btn" 
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" className="auth-submit-btn">
                {t.loginBtn || 'Log In'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignUpSubmit}>
              {/* Full Name */}
              <div className="auth-input-wrap">
                <input 
                  type="text" 
                  className="auth-pill-input no-icon" 
                  placeholder={t.fullNamePlaceholder || 'Full Name'} 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  autoFocus
                />
              </div>

              {/* User ID / Phone */}
              <div className="auth-input-wrap">
                <input 
                  type="text" 
                  className="auth-pill-input no-icon" 
                  placeholder={t.phonePlaceholder || 'Phone / User ID'} 
                  value={signupUserId}
                  onChange={(e) => setSignupUserId(e.target.value)}
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="auth-input-wrap">
                <input 
                  type={showSignupPass ? 'text' : 'password'} 
                  className="auth-pill-input" 
                  placeholder={t.passwordPlaceholder || 'Password'} 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  className="auth-eye-btn" 
                  onClick={() => setShowSignupPass((prev) => !prev)}
                >
                  {showSignupPass ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="auth-input-wrap">
                <input 
                  type={showConfirmPass ? 'text' : 'password'} 
                  className="auth-pill-input" 
                  placeholder={t.confirmPasswordPlaceholder || 'Confirm Password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  className="auth-eye-btn" 
                  onClick={() => setShowConfirmPass((prev) => !prev)}
                >
                  {showConfirmPass ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" className="auth-submit-btn">
                {t.signUpBtn || 'Sign Up'}
              </button>
            </form>
          )}

          {/* 4. Footer Links */}
          <div className="auth-footer-links">
            {mode === 'login' && (
              <a 
                href="#forgot" 
                className="auth-forgot-link" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotModalOpen(true);
                }}
              >
                {t.forgotPassword || 'Forgot Password?'}
              </a>
            )}

            <div className="auth-toggle-account">
              <span>
                {mode === 'login' ? (t.dontHaveAccount || "Don't have an account?") : (t.alreadyHaveAccount || 'Already have an account?')}
              </span>
              <button 
                type="button" 
                onClick={() => {
                  setErrorMsg('');
                  setSuccessMsg('');
                  setMode(mode === 'login' ? 'signup' : 'login');
                }}
              >
                {mode === 'login' ? (t.signUp || 'Sign Up') : (t.login || 'Log In')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Password Reset / Recovery Modal */}
      {isForgotModalOpen && (
        <div className="auth-modal-backdrop" onClick={() => setIsForgotModalOpen(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <div className="auth-modal-title">
                {lang === 'am' ? 'የይለፍ ቃል መልሶ ማግኛ' : 'Password Recovery'}
              </div>
              <button 
                className="auth-modal-close" 
                onClick={() => setIsForgotModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="auth-modal-body">
              {recoverySubmitted ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <ShieldCheck size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontWeight: '600', color: '#16a34a', marginBottom: '8px' }}>
                    {lang === 'am' ? 'የማረጋገጫ ኮድ ተልኳል!' : 'Verification Code Sent!'}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    {lang === 'am' 
                      ? 'የማረጋገጫ ሊንክ ወይም ኮድ ወደ ተመዘገበው ስልክዎ ተልኳል።' 
                      : 'A temporary password reset link has been dispatched to your registered phone number.'}
                  </p>
                  <button 
                    className="auth-submit-btn" 
                    style={{ height: '44px', fontSize: '16px', marginTop: '16px' }}
                    onClick={() => {
                      setIsForgotModalOpen(false);
                      setRecoverySubmitted(false);
                    }}
                  >
                    {lang === 'am' ? 'ተመለስ' : 'Return to Login'}
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ marginBottom: '14px' }}>
                    {lang === 'am'
                      ? 'የተጠቃሚ መለያዎን ወይም የስልክ ቁጥርዎን ያስገቡ፡'
                      : 'Enter your User ID or phone number to receive instructions to reset your password:'}
                  </p>

                  <input 
                    type="text" 
                    className="auth-pill-input no-icon" 
                    style={{ height: '48px', fontSize: '17px', marginBottom: '14px' }}
                    placeholder={lang === 'am' ? 'ስልክ / መለያ' : 'User ID / Phone (+251...)'}
                    value={recoveryInput}
                    onChange={(e) => setRecoveryInput(e.target.value)}
                  />

                  <button 
                    type="button" 
                    className="auth-submit-btn"
                    style={{ height: '48px', fontSize: '18px' }}
                    onClick={() => {
                      if (recoveryInput.trim()) {
                        setRecoverySubmitted(true);
                      }
                    }}
                  >
                    {lang === 'am' ? 'የይለፍ ቃል ላክ' : 'Send Reset Link'}
                  </button>

                  <div style={{ marginTop: '18px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                      {lang === 'am' ? 'ወይም በቀጥታ አስተዳዳሪን ያግኙ፡' : 'Or contact Beha Admin Support directly:'}
                    </div>
                    <div className="auth-modal-contact-row">
                      <Phone size={16} color="#0022ff" />
                      <span>+251 912 121 212 (Ayat Square Office)</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
