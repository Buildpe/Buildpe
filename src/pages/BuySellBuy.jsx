import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlatformToggle from '../components/common/PlatformToggle';
import BuySellNav from '../components/common/BuySellNav';

const useMediaQuery = (q) => {
  const [m, setM] = React.useState(() => window.matchMedia(q).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(q);
    const h = (e) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [q]);
  return m;
};

const CATEGORIES = [
  {
    key: 'land',
    label: 'Lands',
    icon: '🌾',
    desc: 'Agricultural, residential plots & open sites',
  },
  {
    key: 'commercial',
    label: 'Commercial Properties',
    icon: '🏢',
    desc: 'Offices, showrooms & commercial buildings',
  },
  {
    key: 'apartment',
    label: 'Apartments & Houses',
    icon: '🏠',
    desc: 'Flats, villas & independent houses',
  },
  {
    key: 'other',
    label: 'Others',
    icon: '📋',
    desc: 'Warehouses, industrial & mixed-use properties',
  },
];

export default function BuySellBuy() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate  = useNavigate();
  const [active, setActive] = useState(null);

  const handleCategory = (key) => {
    setActive(key);
    navigate(`/buy-sell/buy/listings?category=${key}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>

      <PlatformToggle active="buysell" />
      <BuySellNav />

      {/* ── Hero image banner — like 1acre's landscape photo ──── */}
      <div style={{
        width: '100%',
        height: isMobile ? '200px' : '320px',
        background: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a1e 40%, #3d6b2a 70%, #4a8530 100%)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Decorative landscape pattern overlay */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }} viewBox="0 0 1440 320" preserveAspectRatio="xMidYMid slice">
          <path d="M0,160 C180,80 360,240 540,160 C720,80 900,240 1080,160 C1260,80 1350,200 1440,160 L1440,320 L0,320 Z" fill="#ffffff"/>
          <path d="M0,220 C200,140 400,280 600,220 C800,140 1000,260 1200,200 C1320,160 1400,240 1440,220 L1440,320 L0,320 Z" fill="#ffffff" opacity="0.5"/>
        </svg>
        {/* Sun / light glow */}
        <div style={{
          position: 'absolute', top: '20%', right: '15%',
          width: isMobile ? '80px' : '140px',
          height: isMobile ? '80px' : '140px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(248,156,28,0.55) 0%, transparent 70%)',
        }}/>
        {/* Text overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'flex-end',
          padding: isMobile ? '20px 20px' : '32px 48px',
        }}>
          <p style={{ margin: '0 0 4px 0', fontSize: isMobile ? '11px' : '13px', color: 'rgba(255,255,255,0.75)', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Verified Properties
          </p>
          <h2 style={{ margin: 0, fontSize: isMobile ? '22px' : '34px', fontWeight: '800', color: '#ffffff', lineHeight: 1.2 }}>
            Find Your Perfect Property
          </h2>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: '800px', width: '100%', margin: '0 auto', padding: isMobile ? '28px 16px' : '48px 24px', boxSizing: 'border-box' }}>

        {/* Heading */}
        <h1 style={{ margin: '0 0 14px 0', fontSize: isMobile ? '26px' : '40px', fontWeight: '800', color: '#111827', lineHeight: 1.2 }}>
          Buy Your Property With Us
        </h1>

        {/* Sub paragraph */}
        <p style={{ margin: '0 0 36px 0', fontSize: isMobile ? '14px' : '15.5px', color: '#6b7280', lineHeight: 1.7, maxWidth: '580px' }}>
          BuildPE is a platform to discover verified properties across India. Browse listings, contact sellers directly, and find your ideal land, home, or commercial space — all in one place.
        </p>

        {/* Category accordion cards — like 1acre's expandable rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CATEGORIES.map((cat, i) => {
            const isActive = active === cat.key;
            return (
              <div
                key={cat.key}
                onClick={() => handleCategory(cat.key)}
                style={{
                  border: `1.5px solid ${isActive ? '#EC1940' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  padding: isMobile ? '16px' : '18px 24px',
                  cursor: 'pointer',
                  background: isActive ? '#fff8f5' : '#ffffff',
                  transition: 'all 0.18s ease',
                  boxShadow: isActive ? '0 2px 12px rgba(236,25,64,0.10)' : '0 1px 3px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#f0a0a0'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = '#e5e7eb'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: isMobile ? '22px' : '26px' }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontSize: isMobile ? '15px' : '16.5px', fontWeight: '700', color: isActive ? '#EC1940' : '#111827' }}>
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                        {cat.desc}
                      </div>
                    </div>
                  </div>
                  {/* Arrow icon */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: isActive ? 'linear-gradient(135deg,#EC1940,#F89C1C)' : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.18s',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke={isActive ? '#fff' : '#6b7280'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom line */}
        <p style={{ marginTop: '32px', fontSize: '13px', color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 }}>
          All listings are admin-verified before going live.{' '}
          <span
            onClick={() => navigate('/buy-sell/map')}
            style={{ color: '#EC1940', fontWeight: '600', cursor: 'pointer' }}
          >
            Browse on Map →
          </span>
        </p>

      </div>
    </div>
  );
}
