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

const FAQS = [
  {
    q: 'How long will it take to list my property?',
    a: 'Once you submit your listing with all required details, our admin team will verify and make it live on the same day or within 24 hours.',
  },
  {
    q: 'Is listing on BuildPE free?',
    a: 'Yes, listing your property on BuildPE Buy & Sell is completely free. There are no hidden charges for posting a listing.',
  },
  {
    q: 'Do I need to pay anything if my property gets sold?',
    a: 'No. BuildPE does not charge any commission or brokerage when your property is sold through our platform.',
  },
  {
    q: 'What types of properties can I list?',
    a: 'You can list Lands & Plots, Commercial Properties, Apartments & Houses, and any other construction-related properties.',
  },
  {
    q: 'What is the admin verification process?',
    a: 'Our team reviews each listing for completeness and accuracy before approving it. This ensures only genuine listings are visible to buyers.',
  },
  {
    q: 'Can I edit my listing after it is published?',
    a: 'Yes. You can edit your listing at any time from your account. After editing, it goes through verification again before going live.',
  },
];

// ── FAQ accordion item ────────────────────────────────────────────────
function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(index === 0); // first one open by default
  return (
    <div style={{ borderBottom: '1px solid #e5e7eb' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
          gap: '16px',
        }}
      >
        <span style={{ fontSize: '15.5px', fontWeight: '600', color: '#111827', lineHeight: 1.4 }}>
          {faq.q}
        </span>
        <span style={{
          flexShrink: 0, width: '24px', height: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%', background: open ? 'linear-gradient(135deg,#EC1940,#F89C1C)' : '#f1f5f9',
          transition: 'all 0.18s',
        }}>
          {open
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round"/></svg>
          }
        </span>
      </button>
      {open && (
        <p style={{ margin: '0 0 20px 0', fontSize: '14.5px', color: '#6b7280', lineHeight: 1.7 }}>
          {faq.a}
        </p>
      )}
    </div>
  );
}

export default function BuySellSell() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate  = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>

      <PlatformToggle active="buysell" />
      <BuySellNav />

      {/* ── HERO — exactly like 1acre sell page ──────────────────
          Large centered headline, sub-text, CTA button, seller count
      ────────────────────────────────────────────────────────── */}
      <div style={{
        flex: 'none',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '60px 20px 40px' : '90px 24px 56px',
        textAlign: 'center',
        background: '#ffffff',
      }}>

        {/* Big headline — highlighted words in brand gradient like 1acre's yellow */}
        <h1 style={{
          margin: '0 0 18px 0',
          fontSize: isMobile ? '36px' : '62px',
          fontWeight: '800', color: '#111827',
          lineHeight: 1.1, letterSpacing: '-0.02em',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #EC1940, #F89C1C)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Sell</span>
          {' '}Your Property{isMobile ? <br/> : ' '}<br/>
          <span style={{
            background: 'linear-gradient(135deg, #EC1940, #F89C1C)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Faster</span>
          {' '}Through BuildPE
        </h1>

        {/* Sub text */}
        <p style={{
          margin: '0 0 32px 0',
          fontSize: isMobile ? '15px' : '17px',
          color: '#6b7280', lineHeight: 1.6,
          maxWidth: '480px',
        }}>
          Connect Directly with Qualified Buyers
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/buy-sell/sell/post')}
          style={{
            padding: isMobile ? '14px 32px' : '16px 44px',
            background: 'linear-gradient(135deg, #EC1940 0%, #F89C1C 100%)',
            color: '#ffffff', border: 'none', borderRadius: '50px',
            fontSize: isMobile ? '15px' : '17px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 6px 20px rgba(236,25,64,0.30)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(236,25,64,0.38)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,25,64,0.30)'; }}
        >
          List Your Property Now
        </button>

        {/* Seller count line — like 1acre's "JOIN 4000+ SELLERS" */}
        <p style={{
          margin: '28px 0 0 0',
          fontSize: isMobile ? '11.5px' : '12.5px',
          color: '#9ca3af', letterSpacing: '0.08em',
          textTransform: 'uppercase', fontWeight: '500',
        }}>
          Join{' '}
          <span style={{ fontWeight: '800', color: '#111827', fontSize: isMobile ? '13px' : '14px' }}>500+</span>
          {' '}property owners who list on BuildPE
        </p>
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div style={{ width: '100%', height: '1px', background: '#f1f5f9' }} />

      {/* ── FAQ section ──────────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: '780px', width: '100%', margin: '0 auto', padding: isMobile ? '40px 20px 60px' : '60px 24px 80px', boxSizing: 'border-box' }}>

        <h2 style={{ margin: '0 0 40px 0', fontSize: isMobile ? '22px' : '30px', fontWeight: '800', color: '#111827', textAlign: 'center' }}>
          Frequently Asked Questions
        </h2>

        <div>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* Still have questions */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 14px 0', fontSize: '14px', color: '#6b7280' }}>
            Still have questions?
          </p>
          <button
            onClick={() => navigate('/contact')}
            style={{
              padding: '11px 28px',
              background: 'none',
              border: '1.5px solid #EC1940',
              borderRadius: '25px',
              color: '#EC1940', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Contact Us
          </button>
        </div>

      </div>
    </div>
  );
}
