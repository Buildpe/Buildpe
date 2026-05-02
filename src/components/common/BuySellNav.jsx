import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * BuySellNav
 * ──────────
 * Minimalist 3-tab nav — exactly like 1acre.in
 * Each tab is a separate page:
 *   Map-View     → /buy-sell/map
 *   Buy Property → /buy-sell/buy
 *   Sell Property→ /buy-sell/sell
 *
 * Drop <BuySellNav /> on any buy-sell page — active tab auto-highlights from URL.
 */
const BuySellNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = [
    { key: 'map',  route: '/buy-sell/map',  label: 'Map-View',      dot: true  },
    { key: 'buy',  route: '/buy-sell/buy',  label: 'Buy Property',  dot: false },
    { key: 'sell', route: '/buy-sell/sell', label: 'Sell Property', dot: false },
  ];

  const activeKey = tabs.find(t => pathname.startsWith(t.route))?.key ?? null;

  return (
    <div style={{
      width: '100%',
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '560px',
        margin: '0 auto',
        padding: '0 16px',
      }}>
        {tabs.map(tab => {
          const isActive = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.route)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '14px 8px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2.5px solid #EC1940' : '2.5px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13.5px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#1a1a1a' : '#6b7280',
                transition: 'color 0.15s ease',
                outline: 'none',
                whiteSpace: 'nowrap',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Filled dot on Map-View when active — exactly like 1acre */}
              {tab.dot && isActive && (
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#EC1940', flexShrink: 0,
                }} />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BuySellNav;
