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

const POPULAR = ['Near Me', 'Residential', 'Commercial', 'Plots', 'Apartments', 'Villas'];

export default function BuySell() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate  = useNavigate();
  const [search, setSearch] = useState('');

  const go = () => {
    const q = search.trim();
    navigate(q ? `/buy-sell/buy?q=${encodeURIComponent(q)}` : '/buy-sell/buy');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>

      <PlatformToggle active="buysell" />
      <BuySellNav />

      {/* Hero */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>

        {/* OSM map background */}
        <iframe
          title="map-bg"
          src="https://www.openstreetmap.org/export/embed.html?bbox=78.2%2C17.2%2C78.75%2C17.65&layer=mapnik"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none', filter: 'brightness(1.05) saturate(0.82)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.15)' }} />

        {/* 
          Entire content block — positioned exactly like 1acre.
          The whole unit (sub-label + h1 + search + pills + trust) 
          sits as ONE centered block. Nothing is split apart.
        */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '700px',
          padding: '0 16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? '16px' : '20px',
          zIndex: 10,
        }}>

          {/* Sub-label */}
          <p style={{
            margin: 0,
            fontSize: isMobile ? '10px' : '11.5px',
            fontWeight: '600',
            letterSpacing: '0.14em',
            color: '#374151',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            INDIA'S CONSTRUCTION PROPERTY MARKETPLACE
          </p>

          {/* Main headline */}
          <h1 style={{
            margin: 0,
            fontSize: isMobile ? '34px' : '62px',
            fontWeight: '800',
            color: '#111827',
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Find Verified<br />Properties Near You
          </h1>

          {/* Search bar — bigger than before */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '1.5px solid #e5e7eb',
            borderRadius: '50px',
            padding: isMobile ? '6px 6px 6px 20px' : '8px 8px 8px 24px',
            width: '100%',
            boxSizing: 'border-box',
            boxShadow: '0 6px 28px rgba(0,0,0,0.13)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.38 }}>
              <circle cx="11" cy="11" r="8" stroke="#374151" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder='Try searching for "Kondapur" or "3BHK Plot"'
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && go()}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: isMobile ? '14px' : '15px',
                color: '#111827', background: 'transparent',
                padding: isMobile ? '10px 12px' : '12px 16px',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={go}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: isMobile ? '42px' : '48px',
                height: isMobile ? '42px' : '48px',
                background: 'linear-gradient(135deg, #EC1940 0%, #F89C1C 100%)',
                border: 'none', borderRadius: '50%',
                cursor: 'pointer', flexShrink: 0,
                boxShadow: '0 2px 8px rgba(236,25,64,0.30)',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2.2"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Popular pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 6h6v6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Popular Searches:
            </span>
            {POPULAR.map(tag => (
              <button
                key={tag}
                onClick={() => tag === 'Near Me' ? navigate('/buy-sell/map') : navigate(`/buy-sell/buy?q=${encodeURIComponent(tag)}`)}
                style={{
                  padding: '5px 14px', background: '#ffffff',
                  border: '1px solid #d1d5db', borderRadius: '20px',
                  fontSize: '12px', fontWeight: '500', color: '#374151',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07)', whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Trust line — plain text, no box */}
          <p style={{
            margin: 0,
            fontSize: isMobile ? '11.5px' : '13px',
            color: '#374151', textAlign: 'center', lineHeight: 1.6,
          }}>
            Every listing is admin-verified before going live.{' '}
            <span style={{
              fontWeight: '700', cursor: 'pointer',
              background: 'linear-gradient(135deg, #EC1940, #F89C1C)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Learn how it works →
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}