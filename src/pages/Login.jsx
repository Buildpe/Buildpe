import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser, initiateGoogleLogin } from '../Services/Authapi';

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginUser({ identifier, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          font-size: 2rem;
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
        .auth-btn-main {
          padding: 13px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: opacity 0.15s;
        }
        .auth-btn-main:disabled { opacity: 0.7; cursor: not-allowed; }
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
          transition: background 0.15s;
          font-family: inherit;
        }
        .auth-btn-google:hover { background: #f8f9fa; }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: #e0e0e0;
        }
        .auth-divider-text { color: #6b7280; font-size: 12px; font-weight: 500; }
        .auth-error {
          background: #fee2e2;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 4px;
          font-size: 14px;
          border: 1px solid #fca5a5;
        }
        .auth-terms { font-size: 12px; color: #6b7280; margin: 0; }
        .auth-link { color: #2874f0; text-decoration: none; }
        .auth-create { text-align: center; color: #2874f0; text-decoration: none; font-size: 14px; font-weight: 500; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .auth-card { flex-direction: column; max-width: 100%; border-radius: 8px; }
          .auth-left {
            width: 100%;
            padding: 2rem 1.5rem;
            min-height: unset;
          }
          .auth-left h1 { font-size: 1.5rem; }
          .auth-shapes { display: none; }
          .auth-right { padding: 1.5rem; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          {/* Left */}
          <div className="auth-left">
            <h1>Login</h1>
            <p>Get access to your Orders, Wishlist and Recommendations</p>
            <div className="auth-shapes">
              <div style={{ width: 36, height: 36, background: '#ff6b6b', borderRadius: 4 }} />
              <div style={{ width: 60, height: 60, background: 'white', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
              <div style={{ width: 28, height: 28, background: '#ffc107', borderRadius: 4 }} />
            </div>
          </div>

          {/* Right */}
          <div className="auth-right">
            <form onSubmit={handleLogin} className="auth-form">
              {error && <div className="auth-error">{error}</div>}

              <input
                className="auth-input"
                type="text"
                placeholder="Enter Email/Mobile number"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
              />

              <div style={{ position: 'relative' }}>
                <input
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="auth-terms">
                By continuing, you agree to BuildPE's{' '}
                <a href="#" className="auth-link">Terms of Use</a> and{' '}
                <a href="#" className="auth-link">Privacy Policy</a>.
              </p>

              <button type="submit" disabled={loading} className="auth-btn-main">
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <a href="/register" className="auth-create">New to BuildPE? Create an account</a>

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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
