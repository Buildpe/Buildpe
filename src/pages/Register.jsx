import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, initiateGoogleLogin } from '../Services/Authapi';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validatePhone = () => {
    const errors = {};
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Enter a valid 10-digit mobile number';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePhoneContinue = (e) => {
    e.preventDefault();
    setError('');
    if (validatePhone()) setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      await registerUser({ ...form, phoneNumber });
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = (pwd) => {
    if (pwd.length >= 10) return { width: '100%', color: '#22c55e', label: 'Strong' };
    if (pwd.length >= 8)  return { width: '66%',  color: '#f59e0b', label: 'Good' };
    if (pwd.length >= 6)  return { width: '33%',  color: '#f97316', label: 'Weak' };
    return { width: '10%', color: '#ef4444', label: 'Too short' };
  };

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f2f5;
          padding: 2rem 1rem;
        }
        .auth-card {
          display: flex;
          width: 100%;
          max-width: 750px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 24px rgba(0,0,0,0.12);
          background: white;
        }
        .auth-left {
          background: linear-gradient(135deg, #2874f0 0%, #1a5dc8 100%);
          padding: 3rem 2rem;
          width: 45%;
          display: flex;
          flex-direction: column;
          color: white;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .auth-left h1 {
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0 0 1rem;
          color: white;
        }
        .auth-left p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.85);
          margin: 0;
        }
        .auth-shapes {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }
        .auth-right {
          flex: 1;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .auth-form h3 {
          margin: 0;
          color: #374151;
          font-weight: 600;
          font-size: 1rem;
        }
        .auth-field { display: flex; flex-direction: column; gap: 4px; }
        .auth-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .auth-input:focus { border-color: #2874f0; }
        .auth-input--error { border-color: #ef4444 !important; }
        .auth-field-error { font-size: 12px; color: #ef4444; }
        .auth-error {
          background: #fee2e2;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 4px;
          font-size: 14px;
          border: 1px solid #fca5a5;
        }
        .auth-btn-main {
          padding: 13px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
        }
        .auth-btn-main:disabled { opacity: 0.7; cursor: not-allowed; }
        .auth-btn-back {
          padding: 13px 20px;
          background: white;
          color: #374151;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 15px;
          cursor: pointer;
          font-family: inherit;
        }
        .auth-btn-row { display: flex; gap: 10px; }
        .auth-btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 11px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          color: #374151;
          font-family: inherit;
          transition: background 0.15s;
        }
        .auth-btn-google:hover { background: #f8f9fa; }
        .auth-divider { display: flex; align-items: center; gap: 10px; }
        .auth-divider-line { flex: 1; height: 1px; background: #e0e0e0; }
        .auth-divider-text { color: #6b7280; font-size: 12px; font-weight: 500; }
        .auth-terms { font-size: 12px; color: #6b7280; margin: 0; }
        .auth-link { color: #2874f0; text-decoration: none; }
        .auth-login-link { text-align: center; color: #2874f0; text-decoration: none; font-size: 14px; font-weight: 500; }
        .strength-bar-wrap { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .strength-bar-track { flex: 1; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; }
        .strength-bar-fill { height: 4px; border-radius: 2px; transition: all 0.3s ease; }
        .strength-label { font-size: 11px; color: #6b7280; white-space: nowrap; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .auth-card { flex-direction: column; max-width: 100%; border-radius: 8px; }
          .auth-left {
            width: 100%;
            padding: 1.8rem 1.5rem;
          }
          .auth-left h1 { font-size: 1.3rem; }
          .auth-shapes { display: none; }
          .auth-right { padding: 1.5rem; }
          .auth-form { gap: 0.85rem; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          {/* Left */}
          <div className="auth-left">
            <h1>Looks like you're new here!</h1>
            <p>Sign up with your mobile number to get started</p>
            <div className="auth-shapes">
              <div style={{ width: 36, height: 36, background: '#ff6b6b', borderRadius: 4 }} />
              <div style={{ width: 60, height: 60, background: 'white', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
              <div style={{ width: 28, height: 28, background: '#ffc107', borderRadius: 4 }} />
            </div>
          </div>

          {/* Right */}
          <div className="auth-right">
            <form
              onSubmit={step === 1 ? handlePhoneContinue : handleRegister}
              className="auth-form"
            >
              {error && <div className="auth-error">{error}</div>}

              {step === 1 ? (
                <>
                  <h3>Enter your mobile number</h3>
                  <div className="auth-field">
                    <input
                      className={`auth-input${fieldErrors.phoneNumber ? ' auth-input--error' : ''}`}
                      type="tel"
                      placeholder="Enter Mobile Number"
                      value={phoneNumber}
                      onChange={e => { setPhoneNumber(e.target.value); setFieldErrors({}); }}
                    />
                    {fieldErrors.phoneNumber && (
                      <span className="auth-field-error">{fieldErrors.phoneNumber}</span>
                    )}
                  </div>
                  <button type="submit" className="auth-btn-main">Continue</button>
                </>
              ) : (
                <>
                  <h3>Complete your profile</h3>

                  <div className="auth-field">
                    <input
                      className={`auth-input${fieldErrors.firstName ? ' auth-input--error' : ''}`}
                      type="text"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={e => { setForm(f => ({ ...f, firstName: e.target.value })); setFieldErrors(fe => ({ ...fe, firstName: '' })); }}
                    />
                    {fieldErrors.firstName && <span className="auth-field-error">{fieldErrors.firstName}</span>}
                  </div>

                  <div className="auth-field">
                    <input
                      className={`auth-input${fieldErrors.lastName ? ' auth-input--error' : ''}`}
                      type="text"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={e => { setForm(f => ({ ...f, lastName: e.target.value })); setFieldErrors(fe => ({ ...fe, lastName: '' })); }}
                    />
                    {fieldErrors.lastName && <span className="auth-field-error">{fieldErrors.lastName}</span>}
                  </div>

                  <div className="auth-field">
                    <input
                      className={`auth-input${fieldErrors.email ? ' auth-input--error' : ''}`}
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFieldErrors(fe => ({ ...fe, email: '' })); }}
                    />
                    {fieldErrors.email && <span className="auth-field-error">{fieldErrors.email}</span>}
                  </div>

                  <div className="auth-field">
                    <input
                      className={`auth-input${fieldErrors.password ? ' auth-input--error' : ''}`}
                      type="password"
                      placeholder="Create Password (min. 6 characters)"
                      value={form.password}
                      onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setFieldErrors(fe => ({ ...fe, password: '' })); }}
                    />
                    {fieldErrors.password && <span className="auth-field-error">{fieldErrors.password}</span>}
                    {form.password && (() => {
                      const s = strengthLevel(form.password);
                      return (
                        <div className="strength-bar-wrap">
                          <div className="strength-bar-track">
                            <div className="strength-bar-fill" style={{ width: s.width, background: s.color }} />
                          </div>
                          <span className="strength-label">{s.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="auth-btn-row">
                    <button
                      type="button"
                      className="auth-btn-back"
                      onClick={() => { setStep(1); setFieldErrors({}); setError(''); }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="auth-btn-main"
                      style={{ flex: 1 }}
                    >
                      {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                  </div>
                </>
              )}

              <p className="auth-terms">
                By continuing, you agree to BuildPE's{' '}
                <a href="#" className="auth-link">Terms of Use</a> and{' '}
                <a href="#" className="auth-link">Privacy Policy</a>.
              </p>

              <div className="auth-divider">
                <span className="auth-divider-line" />
                <span className="auth-divider-text">OR</span>
                <span className="auth-divider-line" />
              </div>

              <button type="button" onClick={initiateGoogleLogin} className="auth-btn-google">
                <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 8 }}>
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                </svg>
                Continue with Google
              </button>

              <a href="/login" className="auth-login-link">Existing User? Log in</a>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
