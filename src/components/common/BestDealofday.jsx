import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';

const BestDealOfDay = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 40,
    seconds: 56
  });

  // Sample deal data
  const deal = {
    title: 'Wallpapers',
    subtitle: 'Premium Collection',
    price: 'From ₹299*',
    discount: 'Up to 50% OFF'
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '1.5rem',
      border: '2px solid #d1d5db',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #f3f4f6'
      }}>
        <Zap size={18} color="#ef4444" fill="#ef4444" />
        <span style={{
          fontSize: '0.9rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#1a1a1a'
        }}>
          HOT DEAL
        </span>
      </div>

      {/* Title Section */}
      <div style={{
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: '0 0 0.25rem 0',
          lineHeight: '1.2',
          color: '#1a1a1a'
        }}>
          {deal.title}
        </h3>
        <p style={{
          fontSize: '0.9rem',
          margin: 0,
          color: '#6b7280'
        }}>
          {deal.subtitle}
        </p>
      </div>

      {/* Discount Badge - Larger to fill space */}
      <div style={{
        backgroundColor: '#fef3c7',
        color: '#92400e',
        padding: '1.5rem 1rem',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: '1.25rem',
        marginBottom: '1rem',
        border: '2px solid #fbbf24',
        flex: '0 0 auto'
      }}>
        {deal.discount}
      </div>

      {/* Price */}
      <div style={{
        fontSize: '1.75rem',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '1rem',
        color: '#dc2626'
      }}>
        {deal.price}
      </div>

      {/* Countdown Timer */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <Clock size={16} color="#6b7280" />
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#6b7280'
          }}>
            Deal Ends In
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: '0.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1',
              color: '#1a1a1a'
            }}>
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: '#6b7280',
              marginTop: '0.25rem',
              fontWeight: '600'
            }}>
              HOURS
            </div>
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#9ca3af',
            alignSelf: 'center'
          }}>:</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1',
              color: '#1a1a1a'
            }}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: '#6b7280',
              marginTop: '0.25rem',
              fontWeight: '600'
            }}>
              MINS
            </div>
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#9ca3af',
            alignSelf: 'center'
          }}>:</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1',
              color: '#1a1a1a'
            }}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: '#6b7280',
              marginTop: '0.25rem',
              fontWeight: '600'
            }}>
              SECS
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button style={{
        width: '100%',
        padding: '0.9rem',
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginTop: 'auto'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#dc2626';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#ef4444';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={() => console.log('Shop now clicked')}
      >
        Shop Now
      </button>
    </div>
  );
};

export default BestDealOfDay;