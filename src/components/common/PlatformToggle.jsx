import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Same helper used across the codebase (CategoryNav, etc.) ──────────────
const useMediaQuery = (query) => {
  const [matches, setMatches] = React.useState(
    () => window.matchMedia(query).matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

/**
 * PlatformToggle
 * ──────────────
 * Full-width toggle bar sitting between Header and CategoryNav on Home,
 * and at the very top of the BuySell page (no Header there).
 *
 * Props:
 *   active: 'buildpe' | 'buysell'
 */
const PlatformToggle = ({ active = 'buildpe' }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmall  = useMediaQuery('(max-width: 380px)'); // very small phones
  const [hovered, setHovered] = useState(null);

  // Brand gradient — same as --primary-gradient in Header.jsx
  const BRAND_GRADIENT = 'linear-gradient(135deg, #EC1940 0%, #F89C1C 100%)';
  const BRAND_SHADOW   = '0 3px 10px rgba(236,25,64,0.25)';

  const handleSelect = (key) => {
    if (key === 'buildpe') navigate('/');
    if (key === 'buysell') navigate('/buy-sell');
  };

  // ── Pill ────────────────────────────────────────────────────────────────
  const pillStyle = (key) => {
    const isActive  = active  === key;
    const isHovered = hovered === key && !isActive;
    return {
      flex: 1,
      minWidth: 0,              // ← critical: lets flex children shrink below content size
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isSmall ? '6px' : isMobile ? '8px' : '10px',
      // Tighter padding on mobile so nothing overflows
      padding: isSmall ? '9px 8px' : isMobile ? '10px 12px' : '11px 20px',
      borderRadius: '7px',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      fontFamily: 'inherit',
      transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      overflow: 'hidden',       // ← prevent any child from spilling out
      ...(isActive ? {
        background: BRAND_GRADIENT,
        color: '#ffffff',
        boxShadow: BRAND_SHADOW,
      } : {
        background: isHovered ? '#fff5f0' : 'transparent',
        color: isHovered ? '#EC1940' : '#64748b',
        boxShadow: 'none',
      }),
    };
  };

  // ── Icon ────────────────────────────────────────────────────────────────
  const iconSize = isSmall ? 18 : isMobile ? 19 : 21;

  const iconStyle = (key) => ({
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    flexShrink: 0,
    opacity: active === key ? 1 : 0.5,
    transition: 'opacity 0.22s ease',
  });

  // ── Label ───────────────────────────────────────────────────────────────
  const labelMain = (key) => ({
    fontSize: isSmall ? '12px' : isMobile ? '13px' : '14px',
    fontWeight: active === key ? '700' : '600',
    color: active === key ? '#ffffff' : '#374151',
    lineHeight: '1.25',
    transition: 'color 0.22s ease',
    whiteSpace: 'normal',       // ← allow wrapping on tiny screens
    wordBreak: 'break-word',
  });

  const labelSub = (key) => ({
    fontSize: isSmall ? '9px' : isMobile ? '9.5px' : '10.5px',
    fontWeight: '400',
    color: active === key ? 'rgba(255,255,255,0.80)' : '#9ca3af',
    lineHeight: '1.3',
    marginTop: '1px',
    transition: 'color 0.22s ease',
    // Hide sub-label on very small screens to save space
    display: isSmall ? 'none' : 'block',
  });

  // ── Badges ──────────────────────────────────────────────────────────────
  const activeBadge = {
    display: isMobile ? 'none' : 'inline-flex', // hide on mobile — saves space
    alignItems: 'center',
    background: 'rgba(255,255,255,0.22)',
    color: '#ffffff',
    fontSize: '9px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '20px',
    marginLeft: '6px',
    letterSpacing: '0.05em',
    flexShrink: 0,
    border: '1px solid rgba(255,255,255,0.35)',
  };

  const newBadge = {
    display: isMobile ? 'none' : 'inline-flex', // hide on mobile — saves space
    alignItems: 'center',
    background: '#fff3f0',
    color: '#EC1940',
    fontSize: '9px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '20px',
    marginLeft: '6px',
    letterSpacing: '0.05em',
    flexShrink: 0,
    border: '1px solid #fecaca',
  };

  return (
    <div style={{
      width: '100%',
      padding: isMobile ? '8px 8px 0 8px' : '10px 16px 0 16px',
      boxSizing: 'border-box',
    }}>
      {/* Track — same card style as CategoryNav */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        background: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: isMobile ? '8px' : '10px',
        padding: '4px',
        gap: '4px',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      }}>

        {/* ── BuildPE pill ─────────────────────────────────────── */}
        <button
          style={pillStyle('buildpe')}
          onClick={() => handleSelect('buildpe')}
          onMouseEnter={() => !isMobile && setHovered('buildpe')}
          onMouseLeave={() => setHovered(null)}
          aria-pressed={active === 'buildpe'}
          aria-label="Switch to BuildPE services"
        >
          {/* House icon */}
          <svg style={iconStyle('buildpe')} viewBox="0 0 24 24" fill="none">
            <path
              d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
              fill={active === 'buildpe' ? 'rgba(255,255,255,0.22)' : 'none'}
              stroke={active === 'buildpe' ? '#ffffff' : '#6b7280'}
              strokeWidth="1.8" strokeLinejoin="round"
            />
            <path
              d="M9 21V12h6v9"
              stroke={active === 'buildpe' ? '#ffffff' : '#6b7280'}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
            <span style={labelMain('buildpe')}>BuildPE</span>
            <span style={labelSub('buildpe')}>Services &amp; Solutions</span>
          </div>

          {active === 'buildpe' && <span style={activeBadge}>ACTIVE</span>}
        </button>

        {/* ── Divider ──────────────────────────────────────────── */}
        <div style={{ width: '1px', background: '#e5e7eb', margin: '5px 0', flexShrink: 0 }} />

        {/* ── Buy & Sell pill ──────────────────────────────────── */}
        <button
          style={pillStyle('buysell')}
          onClick={() => handleSelect('buysell')}
          onMouseEnter={() => !isMobile && setHovered('buysell')}
          onMouseLeave={() => setHovered(null)}
          aria-pressed={active === 'buysell'}
          aria-label="Switch to Buy and Sell marketplace"
        >
          {/* Shopping bag / storefront icon */}
          <svg style={iconStyle('buysell')} viewBox="0 0 24 24" fill="none">
            <path
              d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
              fill={active === 'buysell' ? 'rgba(255,255,255,0.22)' : 'none'}
              stroke={active === 'buysell' ? '#ffffff' : '#6b7280'}
              strokeWidth="1.8" strokeLinejoin="round"
            />
            <path
              d="M3 6h18M16 10a4 4 0 0 1-8 0"
              stroke={active === 'buysell' ? '#ffffff' : '#6b7280'}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
            <span style={labelMain('buysell')}>Buy &amp; Sell</span>
            <span style={labelSub('buysell')}>Realstate Marketplace</span>
          </div>

          {active === 'buysell' && <span style={activeBadge}>ACTIVE</span>}
          {active !== 'buysell' && <span style={newBadge}>NEW</span>}
        </button>

      </div>
    </div>
  );
};

export default PlatformToggle;