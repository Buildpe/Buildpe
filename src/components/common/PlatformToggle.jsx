import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const PlatformToggle = ({ active = 'buildpe' }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmall  = useMediaQuery('(max-width: 380px)');
  const [hovered, setHovered] = useState(null);

  // Your original brand gradient
  const BRAND_GRADIENT = 'linear-gradient(135deg, #EC1940 0%, #F89C1C 100%)';
  const BRAND_LIGHT    = '#fff5f0'; // for inactive hover

  const handleSelect = (key) => {
    if (key === 'buildpe') navigate('/');
    if (key === 'buysell') navigate('/buy-sell');
  };

  const pillStyle = (key) => {
    const isActive  = active === key;
    const isHovered = hovered === key && !isActive;

    return {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isSmall ? '6px' : isMobile ? '8px' : '10px',
      padding: isSmall ? '9px 8px' : isMobile ? '10px 12px' : '11px 20px',
      borderRadius: '7px',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      fontFamily: 'inherit',
      transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      overflow: 'hidden',
      background: isActive ? 'transparent' : (isHovered ? BRAND_LIGHT : 'transparent'),
      boxShadow: 'none',
    };
  };

  const iconSize = isSmall ? 18 : isMobile ? 19 : 21;

  // Icon gets gradient stroke when active, solid grey when inactive
  const iconStyle = (key) => ({
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    flexShrink: 0,
    stroke: active === key ? 'url(#brandGradient)' : '#6b7280',
    fill: active === key ? 'rgba(236,25,64,0.12)' : 'none',
    transition: 'stroke 0.22s ease, fill 0.22s ease',
  });

  // Helper for gradient text (works on all modern browsers)
  const gradientTextStyle = {
    background: BRAND_GRADIENT,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block',
  };

  const labelMain = (key) => {
    const isActive = active === key;
    const baseStyle = {
      fontSize: isSmall ? '12px' : isMobile ? '13px' : '14px',
      fontWeight: '800',          // bolder for active, but we apply gradient only when active
      lineHeight: '1.25',
      transition: 'color 0.22s ease',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    };
    if (isActive) {
      return { ...baseStyle, ...gradientTextStyle };
    }
    return { ...baseStyle, color: '#374151', fontWeight: '600' };
  };

  const labelSub = (key) => {
    const isActive = active === key;
    const baseStyle = {
      fontSize: isSmall ? '9px' : isMobile ? '9.5px' : '10.5px',
      fontWeight: '400',
      lineHeight: '1.3',
      marginTop: '1px',
      transition: 'color 0.22s ease',
      display: isSmall ? 'none' : 'block',
    };
    if (isActive) {
      return { ...baseStyle, ...gradientTextStyle };
    }
    return { ...baseStyle, color: '#9ca3af' };
  };

  const activeBadge = {
    display: isMobile ? 'none' : 'inline-flex',
    alignItems: 'center',
    background: BRAND_GRADIENT,
    color: '#ffffff',
    fontSize: '9px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '20px',
    marginLeft: '6px',
    letterSpacing: '0.05em',
    flexShrink: 0,
    border: 'none',
  };

  const newBadge = {
    display: isMobile ? 'none' : 'inline-flex',
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
      {/* You need to define the gradient once for the SVG icons */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC1940" />
            <stop offset="100%" stopColor="#F89C1C" />
          </linearGradient>
        </defs>
      </svg>

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
        {/* BuildPE pill */}
        <button
          style={pillStyle('buildpe')}
          onClick={() => handleSelect('buildpe')}
          onMouseEnter={() => !isMobile && setHovered('buildpe')}
          onMouseLeave={() => setHovered(null)}
          aria-pressed={active === 'buildpe'}
        >
          <svg style={iconStyle('buildpe')} viewBox="0 0 24 24" fill="none">
            <path
              d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
              fill={active === 'buildpe' ? 'rgba(236,25,64,0.12)' : 'none'}
              stroke={active === 'buildpe' ? 'url(#brandGradient)' : '#6b7280'}
              strokeWidth="1.8" strokeLinejoin="round"
            />
            <path
              d="M9 21V12h6v9"
              stroke={active === 'buildpe' ? 'url(#brandGradient)' : '#6b7280'}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
            <span style={labelMain('buildpe')}>Buildpe</span>
            <span style={labelSub('buildpe')}>Services &amp; Solutions</span>
          </div>

          {active === 'buildpe' && <span style={activeBadge}>ACTIVE</span>}
        </button>

        <div style={{ width: '1px', background: '#e5e7eb', margin: '5px 0', flexShrink: 0 }} />

        {/* Buy & Sell pill */}
        <button
          style={pillStyle('buysell')}
          onClick={() => handleSelect('buysell')}
          onMouseEnter={() => !isMobile && setHovered('buysell')}
          onMouseLeave={() => setHovered(null)}
          aria-pressed={active === 'buysell'}
        >
          <svg style={iconStyle('buysell')} viewBox="0 0 24 24" fill="none">
            <path
              d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
              fill={active === 'buysell' ? 'rgba(236,25,64,0.12)' : 'none'}
              stroke={active === 'buysell' ? 'url(#brandGradient)' : '#6b7280'}
              strokeWidth="1.8" strokeLinejoin="round"
            />
            <path
              d="M3 6h18M16 10a4 4 0 0 1-8 0"
              stroke={active === 'buysell' ? 'url(#brandGradient)' : '#6b7280'}
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