import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../Services/Api';
import PlatformToggle from '../components/common/PlatformToggle';
import BuySellNav from '../components/common/BuySellNav';

/* ─── helpers ──────────────────────────────────────────────── */
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

const fmt = (n) => {
  if (!n && n !== 0) return null;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ─── small reusable components ────────────────────────────── */
function Chip({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, minWidth: 80, flex: '1 1 auto' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{value}</span>
      <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{label}</span>
    </div>
  );
}

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: 13, color: '#111827', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

/* ─── ROI Island ────────────────────────────────────────────── */
function RoiIsland({ price, roi }) {
  // roi = annual % (e.g. 12 means 12%)
  const hasData = roi && price;

  const yearly   = hasData ? (price * roi) / 100              : null;
  const monthly  = hasData ? yearly / 12                      : null;
  const weekly   = hasData ? yearly / 52                      : null;
  const daily    = hasData ? yearly / 365                     : null;
  const breakeven = hasData ? Math.ceil(100 / roi)            : null;

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
      {/* Header */}
      <div style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, rgba(236,25,64,0.1) 0%, rgba(248,156,28,0.1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="roiIconGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EC1940"/>
                <stop offset="100%" stopColor="#F89C1C"/>
              </linearGradient>
            </defs>
            <path d="M3 3v18h18" stroke="url(#roiIconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 16l4-4 4 4 4-4" stroke="url(#roiIconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Investment Returns</div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>
            {hasData ? `Based on ${roi}% annual ROI` : 'ROI not specified by seller'}
          </div>
        </div>
        {hasData && (
          <div style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #EC1940 0%, #F89C1C 100%)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
            {roi}% p.a.
          </div>
        )}
      </div>

      {hasData ? (
        <div style={{ padding: '16px 18px' }}>
          {/* Grid of return periods */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Daily',   val: fmt(Math.round(daily))   },
              { label: 'Weekly',  val: fmt(Math.round(weekly))  },
              { label: 'Monthly', val: fmt(Math.round(monthly)) },
              { label: 'Yearly',  val: fmt(Math.round(yearly))  },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, background: 'linear-gradient(135deg, #EC1940 0%, #F89C1C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>Annual ROI</span>
              <span style={{ fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, #EC1940 0%, #F89C1C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{roi}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>Total yearly return</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{fmt(Math.round(yearly))}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>Breakeven period</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>~{breakeven} years</span>
            </div>
          </div>

        </div>
      ) : (
        <div style={{ padding: '20px 18px', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: 12 }}>The seller has not provided expected ROI for this property.</div>
        </div>
      )}
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function BuySellProperty() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [listing,   setListing]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox,  setLightbox]  = useState(false);

  const [copied,    setCopied]    = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await apiClient.get(`/api/public/listings/${id}`);
        console.log('📦 Listing API response:', res.data);
        console.log('🔍 roiPercent value:', res.data?.roiPercent, '| roi_percent:', res.data?.roi_percent);
        setListing(res.data);
      } catch {
        setError('Property not found or no longer available.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── loading state ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PlatformToggle active="buysell" /><BuySellNav />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#9ca3af' }}>
        <div style={{ width: 32, height: 32, border: '2.5px solid #111827', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <div style={{ fontSize: 13 }}>Loading property...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── error state ── */
  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PlatformToggle active="buysell" /><BuySellNav />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🏠</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{error}</div>
        <button onClick={() => navigate('/buy-sell/buy')} style={{ padding: '10px 24px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back to listings
        </button>
      </div>
    </div>
  );

  const imgs     = listing.imgUrls?.length > 0 ? listing.imgUrls : [];
  const hasImgs  = imgs.length > 0;
  const price    = listing.price ?? null;
  const priceStr = fmt(price);
  // support both camelCase and snake_case from backend
  const roi      = listing.roiPercent ?? listing.roi_percent ?? null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
      <PlatformToggle active="buysell" />
      <BuySellNav />

      {/* ── Breadcrumb bar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280', flexWrap: 'wrap' }}>
            <span style={{ cursor: 'pointer', color: '#374151' }} onClick={() => navigate('/buy-sell/buy')}>Buy Property</span>
            <span>›</span>
            <span style={{ cursor: 'pointer', color: '#374151' }} onClick={() => navigate('/buy-sell/buy/listings')}>{listing.city || 'Listings'}</span>
            <span>›</span>
            <span style={{ color: '#111827', fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</span>
          </div>
          <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="2"/></svg>
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', padding: isMobile ? '12px' : '24px 20px', boxSizing: 'border-box' }}>

        {/* Title block */}
        <div style={{ marginBottom: 20 }}>
          {listing.category && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#f3f4f6', padding: '3px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 8 }}>
              {listing.category}
            </span>
          )}
          <h1 style={{ margin: '0 0 6px', fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#111827', lineHeight: 1.3 }}>
            {listing.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6b7280', fontSize: 13 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#9ca3af" strokeWidth="1.8"/></svg>
            {[listing.locality, listing.city, listing.state].filter(Boolean).join(', ') || '—'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 330px', gap: 24, alignItems: 'start' }}>

          {/* ════ LEFT ════ */}
          <div>
            {/* Gallery */}
            <div style={{ borderRadius: 12, overflow: 'hidden', background: '#f1f5f9', marginBottom: 20, border: '1px solid #e5e7eb' }}>
              <div
                style={{ height: isMobile ? 240 : 420, position: 'relative', cursor: hasImgs ? 'zoom-in' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                onClick={() => hasImgs && setLightbox(true)}
              >
                {hasImgs
                  ? <img src={imgs[activeImg]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ textAlign: 'center', color: '#d1d5db' }}><div style={{ fontSize: 56 }}>🏠</div><div style={{ fontSize: 13, marginTop: 8 }}>No photos</div></div>
                }
                {hasImgs && imgs.length > 1 && (
                  <>
                    <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + imgs.length) % imgs.length); }} style={{ position: 'absolute', left: 10, background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                    <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % imgs.length); }} style={{ position: 'absolute', right: 10, background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </>
                )}
                {hasImgs && (
                  <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 12 }}>
                    {activeImg + 1} / {imgs.length}
                  </div>
                )}
              </div>
              {imgs.length > 1 && (
                <div style={{ display: 'flex', gap: 6, padding: 8, overflowX: 'auto', background: '#f9fafb' }}>
                  {imgs.map((url, i) => (
                    <div key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 54, borderRadius: 6, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', border: activeImg === i ? '2px solid #111827' : '2px solid transparent', opacity: activeImg === i ? 1 : 0.6, transition: 'all 0.15s' }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick stat chips */}
            {(listing.areaSqft || listing.bhkCount || listing.facing || listing.roadWidthFt || listing.floors || roi) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                <Chip label="Area"       value={listing.areaSqft   ? `${listing.areaSqft.toLocaleString()} sqft` : null} />
                <Chip label="BHK"        value={listing.bhkCount   ? `${listing.bhkCount} BHK` : null} />
                <Chip label="Facing"     value={listing.facing} />
                <Chip label="Road Width" value={listing.roadWidthFt ? `${listing.roadWidthFt} ft` : null} />
                <Chip label="Floors"     value={listing.floors} />
                {roi && <Chip label="Annual ROI" value={`${roi}%`} />}
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#111827' }}>About This Property</h2>
                <p style={{ margin: 0, fontSize: 14, color: '#4b5563', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
              </div>
            )}

            {/* Details table */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <h2 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#111827' }}>Property Details</h2>
              <Row label="Property Type"  value={listing.category} />
              <Row label="Area"           value={listing.areaSqft     ? `${listing.areaSqft} sq ft` : null} />
              <Row label="BHK"            value={listing.bhkCount     ? `${listing.bhkCount} BHK`   : null} />
              <Row label="Floors"         value={listing.floors} />
              <Row label="Facing"         value={listing.facing} />
              <Row label="Road Width"     value={listing.roadWidthFt  ? `${listing.roadWidthFt} ft`  : null} />
              <Row label="Approval"       value={listing.approvalType} />
              <Row label="Seller Type"    value={listing.sellerType} />
              <Row label="Address"        value={listing.hideExactAddress ? [listing.locality, listing.city].filter(Boolean).join(', ') : listing.address} />
              <Row label="Expected ROI"   value={roi ? `${roi}% per year` : null} />
              <Row label="Listed On"      value={fmtDate(listing.createdAt)} />
            </div>
          </div>

          {/* ════ RIGHT ════ */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 88 }}>

            {/* ── ROI Island — FIRST ── */}
            <RoiIsland price={price} roi={roi} />

            {/* ── Price + Contact card ── */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ padding: '20px 20px 8px' }}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Listed Price</div>
                {priceStr
                  ? <div style={{ fontSize: 28, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{priceStr}</div>
                  : <div style={{ fontSize: 18, fontWeight: 700, color: '#374151' }}>Contact for Price</div>
                }
                {listing.areaSqft && price && (
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
                    {fmt(Math.round(price / listing.areaSqft))} / sq ft
                  </div>
                )}
              </div>

              <div style={{ padding: '12px 20px 20px' }}>
                {/* Seller row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: '#f9fafb', borderRadius: 8, marginBottom: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#374151" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="#374151" strokeWidth="2"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{listing.sellerType || 'Owner'}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>Verified Seller</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, background: 'linear-gradient(135deg, #EC1940 0%, #F89C1C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="url(#verifiedGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="verifiedGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#EC1940"/><stop offset="100%" stopColor="#F89C1C"/></linearGradient></defs></svg>
                    Verified
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    const msg = encodeURIComponent(`Hi, I am interested in this listing: ${listing.title}`);
                    window.open(`https://wa.me/919160758602?text=${msg}`, '_blank');
                  }}
                  style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Contact Us
                </button>

                <button
                  onClick={() => navigate(`/buy-sell/map`)}
                  style={{ width: '100%', padding: '11px', background: '#fff', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4M15 4L9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  View on Map
                </button>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', padding: '11px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>Admin verified · Listed {fmtDate(listing.createdAt)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && hasImgs && (
        <div onClick={() => setLightbox(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <button onClick={() => setLightbox(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + imgs.length) % imgs.length); }} style={{ position: 'absolute', left: 12, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <img src={imgs[activeImg]} alt="" style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 8 }} onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % imgs.length); }} style={{ position: 'absolute', right: 12, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            {activeImg + 1} / {imgs.length}
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
