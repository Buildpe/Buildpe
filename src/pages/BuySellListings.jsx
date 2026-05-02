import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const CATEGORIES = [
  { key: '',           label: 'All'                    },
  { key: 'land',       label: 'Lands'                  },
  { key: 'commercial', label: 'Commercial'             },
  { key: 'apartment',  label: 'Apartments & Houses'    },
  { key: 'other',      label: 'Others'                 },
];

const SORT_OPTIONS = [
  { key: 'newest',    label: 'Newest First'    },
  { key: 'price_asc', label: 'Price: Low → High' },
  { key: 'price_desc',label: 'Price: High → Low' },
];

const fmt = (n) => {
  if (!n) return 'Contact for Price';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

function ListingCard({ listing, onClick }) {
  const [imgErr, setImgErr] = React.useState(false);
  return (
    <div
      onClick={() => onClick(listing.id)}
      style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.11)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Image */}
      <div style={{ height: '170px', background: '#f1f5f9', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {listing.imgUrls?.length > 0 && !imgErr
          ? <img src={listing.imgUrls[0]} alt={listing.title} onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '36px', opacity: 0.3 }}>🏠</span>
        }
        {/* Photo count */}
        {listing.imgUrls?.length > 1 && (
          <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', padding: '2px 7px', borderRadius: '10px' }}>
            +{listing.imgUrls.length - 1} photos
          </span>
        )}
        {/* Category badge */}
        {listing.category && (
          <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px', textTransform: 'capitalize' }}>
            {listing.category}
          </span>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827', marginBottom: '5px', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {listing.title}
        </div>
        <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '6px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {fmt(listing.price)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11.5px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#9ca3af"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            {listing.locality || listing.city || '—'}
          </span>
          {listing.areaSqft && (
            <span style={{ fontSize: '11px', color: '#9ca3af', background: '#f9fafb', padding: '2px 7px', borderRadius: '10px' }}>
              {listing.areaSqft} sqft
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ height: '170px', background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ padding: '12px 14px' }}>
        <div style={{ height: '13px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '13px', background: '#f1f5f9', borderRadius: '4px', width: '60%', marginBottom: '8px' }} />
        <div style={{ height: '11px', background: '#f1f5f9', borderRadius: '4px', width: '40%' }} />
      </div>
    </div>
  );
}

export default function BuySellListings() {
  const isMobile    = useMediaQuery('(max-width: 768px)');
  const navigate    = useNavigate();
  const [params]    = useSearchParams();

  const [listings,   setListings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);
  const [category,   setCategory]   = useState(params.get('category') || '');
  const [search,     setSearch]     = useState(params.get('q') || '');
  const [searchInput,setSearchInput]= useState(params.get('q') || '');
  const [sort,       setSort]       = useState('newest');

  const fetchListings = useCallback(async (p = 0, reset = true) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (search.trim()) {
        res = await apiClient.get(`/api/public/listings/search?query=${encodeURIComponent(search)}&page=${p}&size=20`);
      } else {
        const cat = category ? `&category=${encodeURIComponent(category)}` : '';
        res = await apiClient.get(`/api/public/listings?page=${p}&size=20${cat}`);
      }
      const data = res.data;
      const rows = data.content || [];
      setListings(prev => reset ? rows : [...prev, ...rows]);
      setTotalPages(data.totalPages || 1);
      setTotal(data.totalElements || 0);
      setPage(p);
    } catch {
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => { fetchListings(0, true); }, [search, category]);

  const handleSearch = () => { setSearch(searchInput); };

  // Client-side sort (backend pagination sorts by date; price sort is client only)
  const sorted = [...listings].sort((a, b) => {
    if (sort === 'price_asc')  return (a.price || 0) - (b.price || 0);
    if (sort === 'price_desc') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>

      <PlatformToggle active="buysell" />
      <BuySellNav />

      {/* ── Search + filter bar ────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: isMobile ? '10px 12px' : '12px 24px', position: 'sticky', top: '47px', zIndex: 40 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>

          {/* Search input */}
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : '200px', display: 'flex', alignItems: 'center', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}><circle cx="11" cy="11" r="8" stroke="#374151" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#374151" strokeWidth="2" strokeLinecap="round"/></svg>
            <input
              type="text"
              placeholder="Search properties..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13.5px', background: 'transparent', fontFamily: 'inherit', color: '#111827' }}
            />
            {searchInput && <button onClick={() => { setSearchInput(''); setSearch(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>}
          </div>

          {/* Category filter */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', background: '#f9fafb', color: '#374151', cursor: 'pointer', flexShrink: 0 }}
          >
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', background: '#f9fafb', color: '#374151', cursor: 'pointer', flexShrink: 0 }}
          >
            {SORT_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>

          {/* Search button */}
          <button
            onClick={handleSearch}
            style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
          >
            Search
          </button>
        </div>
      </div>

      {/* ── Listings grid ──────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: isMobile ? '14px 10px' : '20px 24px', boxSizing: 'border-box' }}>

        {/* Result count */}
        {!loading && !error && (
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 14px 0', fontWeight: '500' }}>
            {total} propert{total !== 1 ? 'ies' : 'y'} found
            {category ? ` in ${CATEGORIES.find(c => c.key === category)?.label}` : ''}
            {search ? ` for "${search}"` : ''}
          </p>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>{error}</div>
            <button onClick={() => fetchListings(0)} style={{ padding: '8px 20px', background: '#EC1940', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit' }}>Retry</button>
          </div>
        )}

        {/* Skeleton */}
        {loading && listings.length === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(240px,1fr))', gap: isMobile ? '10px' : '18px' }}>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</div>
            <div style={{ fontWeight: '700', color: '#374151', marginBottom: '6px', fontSize: '16px' }}>No properties found</div>
            <div style={{ fontSize: '13px' }}>Try a different search or category</div>
          </div>
        )}

        {/* Grid */}
        {sorted.length > 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(240px,1fr))', gap: isMobile ? '10px' : '18px' }}>
              {sorted.map(l => (
                <ListingCard key={l.id} listing={l} onClick={id => navigate(`/buy-sell/property/${id}`)} />
              ))}
            </div>

            {/* Load more */}
            {page < totalPages - 1 && (
              <div style={{ textAlign: 'center', marginTop: '28px' }}>
                <button
                  onClick={() => fetchListings(page + 1, false)}
                  disabled={loading}
                  style={{ padding: '12px 36px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`@keyframes shimmer { to { background-position: -200% 0; } }`}</style>
    </div>
  );
}
