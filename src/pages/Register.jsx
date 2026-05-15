import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, initiateGoogleLogin } from '../Services/Authapi';
import apiClient from '../Services/Api';

const STEPS = ['Your Details', 'Verify Email'];

export default function Register() {
  const navigate = useNavigate();
  const [step,        setStep]        = useState(1);
  const [emailOtp,    setEmailOtp]    = useState('');
  const [form,        setForm]        = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [loading,     setLoading]     = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error,       setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  };

  const handleSendEmailOtp = async (e) => {
    e.preventDefault(); setError('');
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim())  errors.lastName  = 'Last name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address';
    if (!form.password || form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit number (or leave blank)';
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setLoading(true);
    try { await apiClient.post('/api/auth/otp/send-email', { email: form.email }); setStep(2); startResendTimer(); }
    catch (err) { setError(err.response?.data?.error || 'Failed to send email OTP.'); }
    finally { setLoading(false); }
  };

  const handleVerifyEmailAndRegister = async (e) => {
    e.preventDefault(); setError('');
    if (emailOtp.length !== 6) { setFieldErrors({ emailOtp: 'Enter the 6-digit OTP' }); return; }
    setLoading(true);
    try {
      await apiClient.post('/api/auth/otp/verify-email', { email: form.email, otp: emailOtp });
      await registerUser({ ...form, phoneNumber: form.phone });
      navigate('/login');
    } catch (err) { setError(err.response?.data?.error || err.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  const strengthLevel = (pwd) => {
    if (pwd.length >= 10) return { width: '100%', color: '#22c55e', label: 'Strong' };
    if (pwd.length >= 8)  return { width: '66%',  color: '#f59e0b', label: 'Good' };
    if (pwd.length >= 6)  return { width: '33%',  color: '#f97316', label: 'Weak' };
    return { width: '10%', color: '#ef4444', label: 'Too short' };
  };

  const OtpInput = ({ value, onChange, error: otpError }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {[0,1,2,3,4,5].map(i => (
          <input key={i} type="text" inputMode="numeric" maxLength={1}
            value={value[i] || ''} id={`otp-${i}`}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '');
              const arr = value.split(''); arr[i] = val;
              onChange(arr.join('').slice(0, 6));
              if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
            }}
            onKeyDown={e => { if (e.key === 'Backspace' && !value[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus(); }}
            onPaste={e => { e.preventDefault(); onChange(e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)); }}
            style={{ width: 44, height: 52, textAlign: 'center', fontSize: 22, fontWeight: 700, border: `2px solid ${otpError ? '#ef4444' : value[i] ? '#EC1940' : '#e0e0e0'}`, borderRadius: 8, outline: 'none', fontFamily: 'inherit', background: value[i] ? '#fef2f2' : '#fff' }}
          />
        ))}
      </div>
      {otpError && <span style={{ fontSize: 12, color: '#ef4444', textAlign: 'center' }}>{otpError}</span>}
    </div>
  );

  const Progress = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: step > i+1 ? '#22c55e' : step === i+1 ? '#EC1940' : '#e5e7eb', color: step >= i+1 ? '#fff' : '#9ca3af', transition: 'all 0.3s' }}>
            {step > i+1 ? '✓' : i+1}
          </div>
          {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: step > i+1 ? '#22c55e' : '#e5e7eb', transition: 'background 0.3s' }} />}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>{`
        .auth-page{min-height:80vh;display:flex;align-items:center;justify-content:center;background:#f0f2f5;padding:2rem 1rem}
        .auth-card{display:flex;width:100%;max-width:780px;border-radius:4px;overflow:hidden;box-shadow:0 2px 24px rgba(0,0,0,0.12);background:white}
        .auth-left{background:linear-gradient(135deg,#EC1940 0%,#F89C1C 100%);padding:3rem 2rem;width:40%;display:flex;flex-direction:column;color:white;flex-shrink:0}
        .auth-left h1{font-size:1.4rem;font-weight:800;margin:0 0 1rem;color:white}
        .auth-left p{font-size:0.9rem;line-height:1.7;color:rgba(255,255,255,0.85);margin:0 0 24px}
        .auth-step-list{display:flex;flex-direction:column;gap:12px;margin-top:auto}
        .auth-step-item{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,0.9)}
        .auth-step-dot{width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}
        .auth-step-dot.done{background:rgba(255,255,255,0.9);color:#EC1940}
        .auth-step-dot.active{background:white;color:#EC1940}
        .auth-right{flex:1;padding:2rem 1.8rem;display:flex;flex-direction:column;justify-content:center;overflow-y:auto}
        .auth-form{display:flex;flex-direction:column;gap:14px}
        .auth-form h3{margin:0;color:#111827;font-weight:700;font-size:1.05rem}
        .auth-form p{margin:0;color:#6b7280;font-size:13px}
        .auth-field{display:flex;flex-direction:column;gap:4px}
        .auth-input{width:100%;padding:12px 14px;border:1.5px solid #e0e0e0;border-radius:4px;font-size:14px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color 0.15s}
        .auth-input:focus{border-color:#EC1940}
        .auth-input--error{border-color:#ef4444!important}
        .auth-field-error{font-size:12px;color:#ef4444}
        .auth-error{background:#fee2e2;color:#dc2626;padding:10px 14px;border-radius:4px;font-size:13px;border:1px solid #fca5a5}
        .auth-btn-main{padding:13px;background:linear-gradient(135deg,#EC1940 0%,#F89C1C 100%);color:white;border:none;border-radius:4px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:opacity 0.15s}
        .auth-btn-main:disabled{opacity:0.65;cursor:not-allowed}
        .auth-btn-back{padding:13px 20px;background:white;color:#374151;border:1.5px solid #e0e0e0;border-radius:4px;font-size:15px;cursor:pointer;font-family:inherit}
        .auth-btn-row{display:flex;gap:10px}
        .auth-btn-google{display:flex;align-items:center;justify-content:center;padding:11px;border:1.5px solid #e0e0e0;border-radius:4px;background:white;font-size:14px;font-weight:500;cursor:pointer;color:#374151;font-family:inherit;transition:background 0.15s}
        .auth-btn-google:hover{background:#f8f9fa}
        .auth-divider{display:flex;align-items:center;gap:10px}
        .auth-divider-line{flex:1;height:1px;background:#e0e0e0}
        .auth-divider-text{color:#6b7280;font-size:12px;font-weight:500}
        .auth-terms{font-size:12px;color:#6b7280;margin:0}
        .auth-link{color:#EC1940;text-decoration:none}
        .auth-login-link{text-align:center;color:#EC1940;text-decoration:none;font-size:14px;font-weight:600}
        .strength-bar-wrap{display:flex;align-items:center;gap:8px;margin-top:4px}
        .strength-bar-track{flex:1;height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden}
        .strength-bar-fill{height:4px;border-radius:2px;transition:all 0.3s ease}
        .strength-label{font-size:11px;color:#6b7280;white-space:nowrap}
        .resend-btn{background:none;border:none;color:#EC1940;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;padding:0}
        .resend-btn:disabled{color:#9ca3af;cursor:default}
        @media(max-width:600px){.auth-card{flex-direction:column;max-width:100%;border-radius:8px}.auth-left{width:100%;padding:1.8rem 1.5rem}.auth-step-list{display:none}.auth-right{padding:1.5rem}}
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-left">
            <h1>Create Your BuildPe Account</h1>
            <p>Join thousands of homeowners and professionals on India's trusted construction platform.</p>
            <div className="auth-step-list">
              {['Fill your details','Verify email OTP'].map((s,i)=>(
                <div key={i} className="auth-step-item">
                  <div className={`auth-step-dot ${step>i+1?'done':step===i+1?'active':''}`}>{step>i+1?'✓':i+1}</div>
                  <span style={{fontWeight:step===i+1?700:400}}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-right">
            <form onSubmit={step===1 ? handleSendEmailOtp : handleVerifyEmailAndRegister} className="auth-form">
              <Progress />
              {error && <div className="auth-error">{error}</div>}

              {step===1&&(<>
                <h3>Complete your profile</h3>
                <div style={{display:'flex',gap:10}}>
                  <div className="auth-field" style={{flex:1}}>
                    <input className={`auth-input${fieldErrors.firstName?' auth-input--error':''}`} type="text" placeholder="First Name" value={form.firstName}
                      onChange={e=>{setForm(f=>({...f,firstName:e.target.value}));setFieldErrors(fe=>({...fe,firstName:''}));}}/>
                    {fieldErrors.firstName&&<span className="auth-field-error">{fieldErrors.firstName}</span>}
                  </div>
                  <div className="auth-field" style={{flex:1}}>
                    <input className={`auth-input${fieldErrors.lastName?' auth-input--error':''}`} type="text" placeholder="Last Name" value={form.lastName}
                      onChange={e=>{setForm(f=>({...f,lastName:e.target.value}));setFieldErrors(fe=>({...fe,lastName:''}));}}/>
                    {fieldErrors.lastName&&<span className="auth-field-error">{fieldErrors.lastName}</span>}
                  </div>
                </div>
                <div className="auth-field">
                  <input className={`auth-input${fieldErrors.email?' auth-input--error':''}`} type="email" placeholder="Email Address" value={form.email}
                    onChange={e=>{setForm(f=>({...f,email:e.target.value}));setFieldErrors(fe=>({...fe,email:''}));}}/>
                  {fieldErrors.email&&<span className="auth-field-error">{fieldErrors.email}</span>}
                </div>
                <div className="auth-field">
                  <div style={{display:'flex',border:`1.5px solid ${fieldErrors.phone?'#ef4444':'#e0e0e0'}`,borderRadius:4,overflow:'hidden'}}>
                    <span style={{padding:'12px',background:'#f8f9fa',color:'#374151',fontSize:14,borderRight:'1px solid #e0e0e0',fontWeight:600}}>+91</span>
                    <input className="auth-input" type="tel" maxLength={10} placeholder="Mobile number (optional)" value={form.phone}
                      onChange={e=>{setForm(f=>({...f,phone:e.target.value.replace(/\D/g,'')}));setFieldErrors(fe=>({...fe,phone:''}));}} style={{border:'none',borderRadius:0,flex:1}}/>
                  </div>
                  {fieldErrors.phone&&<span className="auth-field-error">{fieldErrors.phone}</span>}
                </div>
                <div className="auth-field">
                  <input className={`auth-input${fieldErrors.password?' auth-input--error':''}`} type="password" placeholder="Create Password (min. 6 characters)" value={form.password}
                    onChange={e=>{setForm(f=>({...f,password:e.target.value}));setFieldErrors(fe=>({...fe,password:''}));}}/>
                  {fieldErrors.password&&<span className="auth-field-error">{fieldErrors.password}</span>}
                  {form.password&&(()=>{const s=strengthLevel(form.password);return(<div className="strength-bar-wrap"><div className="strength-bar-track"><div className="strength-bar-fill" style={{width:s.width,background:s.color}}/></div><span className="strength-label">{s.label}</span></div>);})()}
                </div>
                <button type="submit" className="auth-btn-main" disabled={loading}>{loading?'Sending OTP...':'Send Email OTP'}</button>
                <div className="auth-divider"><span className="auth-divider-line"/><span className="auth-divider-text">OR</span><span className="auth-divider-line"/></div>
                <button type="button" onClick={initiateGoogleLogin} className="auth-btn-google">
                  <svg width="18" height="18" viewBox="0 0 18 18" style={{marginRight:8}}>
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                  </svg>Continue with Google
                </button>
                <a href="/login" className="auth-login-link">Existing User? Log in</a>
                <p className="auth-terms">By continuing, you agree to BuildPE's <a href="#" className="auth-link">Terms of Use</a> and <a href="#" className="auth-link">Privacy Policy</a>.</p>
              </>)}

              {step===2&&(<>
                <h3>Verify your email</h3>
                <p>Enter the 6-digit OTP sent to <strong>{form.email}</strong></p>
                <OtpInput value={emailOtp} onChange={setEmailOtp} error={fieldErrors.emailOtp}/>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13}}>
                  <span style={{color:'#6b7280'}}>Didn't receive OTP?</span>
                  <button type="button" className="resend-btn" disabled={resendTimer>0||loading}
                    onClick={async()=>{setLoading(true);try{await apiClient.post('/api/auth/otp/send-email',{email:form.email});startResendTimer();}catch(err){setError(err.response?.data?.error||'Failed to resend.');}finally{setLoading(false);}}}>
                    {resendTimer>0?`Resend in ${resendTimer}s`:'Resend OTP'}
                  </button>
                </div>
                <div className="auth-btn-row">
                  <button type="button" className="auth-btn-back" onClick={()=>{setStep(1);setEmailOtp('');setError('');}}>Back</button>
                  <button type="submit" className="auth-btn-main" style={{flex:1}} disabled={loading}>{loading?'Creating account...':'Verify & Create Account'}</button>
                </div>
              </>)}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}