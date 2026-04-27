import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../Services/Api';
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

const fmt = (n) => {
  if (!n) return 'Contact for Price';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ── Detail row used in spec table ──────────────────────────────
function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500', flexShrink: 0, marginRight: '16px' }}>{label}</span>
      <span style={{ fontSize: '13.5px', color: '#111827', fontWeight: '600', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export default function BuySellProperty() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const isMobile  = useMediaQuery('(max-width: 768px)');

  const [listing,    setListing]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [activeImg,  setActiveImg]  = useState(0);
  const [lightbox,   setLightbox]   = useState(false);
  const [contacted,  setContacted]  = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/api/public/listings/${id}`);
        const data = res.data;
        setListing(data);
      } catch {
        setError('Property not found or no longer available.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
      <PlatformToggle active="buysell" /><BuySellNav />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #EC1940', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ fontSize: '14px' }}>Loading property...</div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
      <PlatformToggle active="buysell" /><BuySellNav />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px' }}>🏠</div>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{error}</div>
        <button onClick={() => navigate('/buy-sell/buy')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back to listings
        </button>
      </div>
    </div>
  );

  const imgs = listing.imgUrls?.length > 0 ? listing.imgUrls : [];
  const hasImgs = imgs.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>

      <PlatformToggle active="buysell" />
      <BuySellNav />

      {/* Back button */}
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: isMobile ? '12px 12px 0' : '16px 24px 0', boxSizing: 'border-box' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#6b7280', fontFamily: 'inherit', padding: '4px 0' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to listings
        </button>
      </div>

      <div style={{ flex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', padding: isMobile ? '12px' : '20px 24px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: isMobile ? '16px' : '24px', alignItems: 'start' }}>

          {/* ── Left column ─────────────────────────────────────── */}
          <div>

            {/* Image gallery */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', background: '#f1f5f9', marginBottom: '20px' }}>
              {/* Main image */}
              <div
                style={{ height: isMobile ? '240px' : '400px', position: 'relative', cursor: hasImgs ? 'zoom-in' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#f1f5f9' }}
                onClick={() => hasImgs && setLightbox(true)}
              >
                {hasImgs
                  ? <img src={imgs[activeImg]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '60px', opacity: 0.2 }}>🏠</span>
                }
                {hasImgs && (
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '11px', padding: '4px 10px', borderRadius: '12px' }}>
                    {activeImg + 1} / {imgs.length}
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {imgs.length > 1 && (
                <div style={{ display: 'flex', gap: '6px', padding: '8px', overflowX: 'auto', background: '#f9fafb' }}>
                  {imgs.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveImg(i)}
                      style={{ width: '72px', height: '54px', borderRadius: '7px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer', border: activeImg === i ? '2.5px solid #EC1940' : '2px solid transparent', transition: 'border 0.15s', opacity: activeImg === i ? 1 : 0.65 }}
                    >
                      <img src={url} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title + price */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
              {listing.category && (
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#EC1940', background: '#fff5f5', padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize', display: 'inline-block', marginBottom: '10px' }}>
                  {listing.category}
                </span>
              )}
              <h1 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: '#111827', lineHeight: 1.3 }}>
                {listing.title}
              </h1>
              <div style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '800', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '10px' }}>
                {fmt(listing.price)}
              </div>
              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6b7280', fontSize: '13px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#9ca3af" strokeWidth="1.8"/></svg>
                {[listing.locality, listing.city, listing.state].filter(Boolean).join(', ') || '—'}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
                <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#111827' }}>About This Property</h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
              </div>
            )}

            {/* Property details */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#111827' }}>Property Details</h2>
              <div>
                <DetailRow label="Property Type"  value={listing.category} />
                <DetailRow label="Area"           value={listing.areaSqft ? `${listing.areaSqft} sq ft` : null} />
                <DetailRow label="BHK"            value={listing.bhkCount ? `${listing.bhkCount} BHK` : null} />
                <DetailRow label="Floors"         value={listing.floors} />
                <DetailRow label="Facing"         value={listing.facing} />
                <DetailRow label="Road Width"     value={listing.roadWidthFt ? `${listing.roadWidthFt} ft` : null} />
                <DetailRow label="Approval"       value={listing.approvalType} />
                <DetailRow label="Seller Type"    value={listing.sellerType} />
                <DetailRow label="Listed On"      value={fmtDate(listing.createdAt)} />
              </div>
            </div>
          </div>

          {/* ── Right column — contact card ─────────────────────── */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: '100px' }}>
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
              {/* Price banner */}
              <div style={{ background: 'linear-gradient(135deg,#EC1940,#F89C1C)', padding: '18px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.80)', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Listed Price</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>{fmt(listing.price)}</div>
                {listing.areaSqft && listing.price && (
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>
                    ₹{Math.round(listing.price / listing.areaSqft).toLocaleString('en-IN')} / sqft
                  </div>
                )}
              </div>

              <div style={{ padding: '20px' }}>
                {/* Seller type badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '10px 14px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>{listing.sellerType || 'Owner'}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>Verified Seller</div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => setContacted(true)}
                  style={{ width: '100%', padding: '13px', background: contacted ? '#16a34a' : 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '10px', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {contacted
                    ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Request Sent!</>
                    : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#fff" strokeWidth="1.8"/></svg>Contact Seller</>
                  }
                </button>

                <button
                  onClick={() => {
                    const p = new URLSearchParams({ id: listing.id });
                    if (listing.latitude && listing.longitude) {
                      p.set('lat', listing.latitude);
                      p.set('lng', listing.longitude);
                    }
                    navigate(`/buy-sell/map?${p.toString()}`);
                  }}
                  style={{ width: '100%', padding: '11px', background: 'none', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4M15 4L9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  View on Map
                </button>

                <p style={{ margin: '14px 0 0 0', fontSize: '11px', color: '#9ca3af', textAlign: 'center', lineHeight: 1.5 }}>
                  Admin verified · Listed {fmtDate(listing.createdAt)}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────── */}
      {lightbox && hasImgs && (
        <div
          onClick={() => setLightbox(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <button onClick={() => setLightbox(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>

          <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + imgs.length) % imgs.length); }} style={{ position: 'absolute', left: '12px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>

          <img src={imgs[activeImg]} alt="" style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />

          <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % imgs.length); }} style={{ position: 'absolute', right: '12px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>

          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
            {activeImg + 1} / {imgs.length}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}