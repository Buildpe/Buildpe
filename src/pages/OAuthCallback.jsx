import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../Services/Authapi';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params        = new URLSearchParams(window.location.search);
    const accessToken   = params.get('accessToken');
    const refreshToken  = params.get('refreshToken');
    const error         = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (accessToken && refreshToken) {
      // 1. Save tokens first
      tokenStorage.setTokens(accessToken, refreshToken);

      // 2. Call refresh-token endpoint — it returns full UserInfo
      //    (firstName, lastName, email, phoneNumber, role, id)
      //    No backend changes needed — endpoint already exists!
      fetch('https://buildpe-platform-3oei.onrender.com/api/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
        .then(res => res.json())
        .then(data => {
          if (data?.user) {
            // Same shape as traditional login — firstName, lastName, email, etc.
            tokenStorage.setUserInfo(data.user);
          }
          navigate('/');
        })
        .catch(() => {
          // Even if this fails, tokens are saved so user is logged in
          // They just won't see their name — acceptable fallback
          navigate('/');
        });

    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40,
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #EC1940',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ color: '#6b7280', fontSize: 15 }}>Completing login...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
