import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../Services/Api';
import PlatformToggle from '../components/common/PlatformToggle';
import BuySellNav from '../components/common/BuySellNav';

/* ─── helpers ──────────────────────────────────────────────────── */

const useMediaQuery = (q) => {
  const [m, setM] = React.useState(() => window.matchMedia(q).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(q);
    const h  = (e) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [q]);
  return m;
};

const fmt = (n) => {
  if (!n) return 'Contact for Price';
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─── constants ─────────────────────────────────────────────────── */

const CATEGORIES = [
  { key: '',            label: 'All Types'            },
  { key: 'land',        label: 'Lands'                },
  { key: 'commercial',  label: 'Commercial'           },
  { key: 'apartment',   label: 'Apartments & Houses'  },
  { key: 'other',       label: 'Others'               },
];

const SORT_OPTIONS = [
  { key: 'nearest',    label: 'Nearest First'        },
  { key: 'newest',     label: 'Newest First'         },
  { key: 'price_asc',  label: 'Price: Low → High'    },
  { key: 'price_desc', label: 'Price: High → Low'    },
];

const PRICE_RANGES = [
  { key: '',                  label: 'Any Price'       },
  { key: '0-5000000',         label: 'Under ₹50 L'     },
  { key: '5000000-10000000',  label: '₹50 L – ₹1 Cr'  },
  { key: '10000000-50000000', label: '₹1 Cr – ₹5 Cr'  },
  { key: '50000000-',         label: 'Above ₹5 Cr'     },
];

/* ─── ListingCard ───────────────────────────────────────────────── */

function ListingCard({ listing, onClick, distanceKm }) {
  const [imgErr, setImgErr] = React.useState(false);
  const hasImg = listing.imgUrls?.length > 0 && !imgErr;

  return (
    <div
      onClick={() => onClick(listing.id)}
      style={{
        background: '#fff',
        borderRadius: '14px',
        border: '1px solid #eef0f3',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.13)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ height: '168px', background: '#f3f5f8', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {hasImg
          ? <img src={listing.imgUrls[0]} alt={listing.title} onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '38px', opacity: 0.25 }}>🏠</span>
        }
        {listing.imgUrls?.length > 1 && (
          <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '20px' }}>
            +{listing.imgUrls.length - 1} photos
          </span>
        )}
        {listing.category && (
          <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(236,25,64,0.88)', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', textTransform: 'capitalize', letterSpacing: '0.03em' }}>
            {listing.category}
          </span>
        )}
        {distanceKm != null && (
          <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '20px' }}>
            📍 {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`}
          </span>
        )}
      </div>
      <div style={{ padding: '13px 15px 14px' }}>
        <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827', marginBottom: '5px', lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {listing.title}
        </div>
        <div style={{ fontSize: '17px', fontWeight: '800', marginBottom: '7px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {fmt(listing.price)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11.5px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#9ca3af"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            {listing.locality || listing.city || '—'}
          </span>
          {listing.areaSqft && (
            <span style={{ fontSize: '11px', color: '#6b7280', background: '#f4f5f7', padding: '2px 8px', borderRadius: '10px' }}>
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
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #eef0f3', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ height: '168px', background: 'linear-gradient(90deg,#f3f5f8 25%,#e8eaee 50%,#f3f5f8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ padding: '13px 15px 14px' }}>
        <div style={{ height: '13px', background: '#f3f5f8', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '13px', background: '#f3f5f8', borderRadius: '4px', width: '65%', marginBottom: '8px' }} />
        <div style={{ height: '11px', background: '#f3f5f8', borderRadius: '4px', width: '40%' }} />
      </div>
    </div>
  );
}

/* ─── Mobile Filter Drawer ──────────────────────────────────────── */

function FilterDrawer({ open, onClose, category, setCategory, priceRange, setPriceRange, sort, setSort, locStatus }) {
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }}
      />
      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderRadius: '20px 20px 0 0',
        padding: '20px 20px 36px',
        zIndex: 201,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Handle */}
        <div style={{ width: '40px', height: '4px', background: '#e2e5ea', borderRadius: '4px', margin: '0 auto 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Filters</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Property Type</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                style={{
                  padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                  background: category === c.key ? 'linear-gradient(135deg,#EC1940,#F89C1C)' : '#f4f5f7',
                  color: category === c.key ? '#fff' : '#374151',
                  border: 'none',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Price Range</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PRICE_RANGES.map(r => (
              <button
                key={r.key}
                onClick={() => setPriceRange(r.key)}
                style={{
                  padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                  background: priceRange === r.key ? 'linear-gradient(135deg,#EC1940,#F89C1C)' : '#f4f5f7',
                  color: priceRange === r.key ? '#fff' : '#374151',
                  border: 'none',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Sort By</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SORT_OPTIONS.filter(s => s.key !== 'nearest' || locStatus === 'granted').map(s => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                style={{
                  padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                  background: sort === s.key ? 'linear-gradient(135deg,#EC1940,#F89C1C)' : '#f4f5f7',
                  color: sort === s.key ? '#fff' : '#374151',
                  border: 'none',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Apply Filters
        </button>
      </div>
    </>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */

export default function BuySellBuy() {
  const isMobile   = useMediaQuery('(max-width: 768px)');
  const navigate   = useNavigate();

  // location
  const [userLoc,    setUserLoc]    = useState(null);
  const [locStatus,  setLocStatus]  = useState('idle');

  // listings
  const [listings,   setListings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);

  // filters
  const [category,   setCategory]   = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sort,       setSort]       = useState('newest');
  const [search,     setSearch]     = useState('');

  // search input + suggestions (like map view)
  const [searchVal,    setSearchVal]    = useState('');
  const [suggestions,  setSuggestions]  = useState([]);
  const [searching,    setSearching]    = useState(false);
  const debounceRef = useRef(null);

  // mobile filter drawer
  const [filterOpen, setFilterOpen] = useState(false);

  // scroll shadow
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Geolocation ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!navigator.geolocation) { setLocStatus('denied'); return; }
    setLocStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus('granted');
        setSort('nearest');
      },
      () => { setLocStatus('denied'); setSort('newest'); },
      { timeout: 8000 }
    );
  }, []);

  /* ── Fetch listings ────────────────────────────────────────────── */
  const fetchListings = useCallback(async (p = 0, reset = true) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (search.trim()) {
        res = await apiClient.get(
          `/api/public/listings/search?query=${encodeURIComponent(search)}&page=${p}&size=20`
        );
      } else {
        const cat = category ? `&category=${encodeURIComponent(category)}` : '';
        res = await apiClient.get(`/api/public/listings?page=${p}&size=20${cat}`);
      }
      const data = res.data;
      const rows = data.content || [];
      setListings(prev => (reset ? rows : [...prev, ...rows]));
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

  /* ── Search input with debounce suggestions (like map view) ─────── */
  const handleSearchInput = (val) => {
    setSearchVal(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        // Use Nominatim for location suggestions + also search property titles
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&countrycodes=in&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch { setSuggestions([]); }
    }, 350);
  };

  const pickSuggestion = (item) => {
    const label = item.display_name.split(',').slice(0, 2).join(',');
    setSearchVal(label);
    setSuggestions([]);
    // Search listings by this locality name
    setSearch(label);
  };

  const handleSearchSubmit = async () => {
    if (!searchVal.trim()) { setSearch(''); setSuggestions([]); return; }
    setSearching(true);
    setSuggestions([]);
    setSearch(searchVal);
    setSearching(false);
  };

  /* ── Sort + price filter ────────────────────────────────────────── */
  const processed = React.useMemo(() => {
    let arr = [...listings];
    if (priceRange) {
      const [minStr, maxStr] = priceRange.split('-');
      const min = Number(minStr) || 0;
      const max = maxStr ? Number(maxStr) : Infinity;
      arr = arr.filter(l => { const p = l.price || 0; return p >= min && p <= max; });
    }
    if (sort === 'nearest' && userLoc) {
      arr.sort((a, b) => {
        const dA = (a.latitude && a.longitude) ? haversineKm(userLoc.lat, userLoc.lng, a.latitude, a.longitude) : 99999;
        const dB = (b.latitude && b.longitude) ? haversineKm(userLoc.lat, userLoc.lng, b.latitude, b.longitude) : 99999;
        return dA - dB;
      });
    } else if (sort === 'price_asc') {
      arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price_desc') {
      arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    return arr;
  }, [listings, sort, userLoc, priceRange]);

  const activeFilters = [category, priceRange, sort !== 'newest' && sort !== 'nearest' ? sort : ''].filter(Boolean).length;

  /* ─── render ─────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa', display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      <PlatformToggle active="buysell" />
      <BuySellNav />

      {/* ══ HERO — full width, centered ═══════════════════════════ */}
      <div style={{ width: '100%', background: '#fff', borderBottom: '1px solid #eef0f3', padding: isMobile ? '32px 20px 28px' : '52px 24px 44px' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>

          <h1 style={{ margin: '0 0 14px 0', fontSize: isMobile ? '28px' : '44px', fontWeight: '800', color: '#0f172a', lineHeight: 1.16, letterSpacing: '-0.02em' }}>
            Get Better{' '}
            <span style={{ background: 'linear-gradient(135deg,#EC1940,#F89C1C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ROI</span>
            {' '}Through Smart<br />Real Estate Investing
          </h1>

          <p style={{ margin: '0 auto', fontSize: isMobile ? '14px' : '15.5px', color: '#64748b', lineHeight: 1.75, maxWidth: '560px' }}>
            Discover verified properties — plots, apartments, commercial spaces &amp; more.
            Know your returns before you invest. Browse listings near you or the latest additions across India.
          </p>

          {locStatus === 'granted' && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '4px 14px' }}>
              <span style={{ fontSize: '11px' }}>📍</span>
              <span style={{ fontSize: '11.5px', color: '#15803d', fontWeight: '600' }}>Showing properties nearest to you</span>
            </div>
          )}
          {locStatus === 'denied' && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '16px', background: '#fefce8', border: '1px solid #fde68a', borderRadius: '20px', padding: '4px 14px' }}>
              <span style={{ fontSize: '11px' }}>🕐</span>
              <span style={{ fontSize: '11.5px', color: '#92400e', fontWeight: '600' }}>Showing newest properties first</span>
            </div>
          )}
        </div>
      </div>

      {/* ══ FILTER BAR ════════════════════════════════════════════ */}
      <div style={{
        width: '100%',
        background: '#fff',
        borderBottom: '1px solid #eef0f3',
        padding: isMobile ? '10px 16px' : '12px 24px',
        position: 'sticky', top: '47px', zIndex: 40,
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.2s',
        boxSizing: 'border-box',
      }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center' }}>

          {/* Search with suggestions */}
          <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f7f8fa', border: '1.5px solid #e2e5ea', borderRadius: '9px', padding: '8px 12px', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.35, flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" stroke="#374151" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search city, locality, property type..."
                value={searchVal}
                onChange={e => handleSearchInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSearchSubmit();
                  if (e.key === 'Escape') setSuggestions([]);
                }}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', fontFamily: 'inherit', color: '#111827', minWidth: 0 }}
              />
              {searchVal && (
                <button onClick={() => { setSearchVal(''); setSearch(''); setSuggestions([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #e2e5ea', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden' }}>
                {suggestions.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => pickSuggestion(item)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', cursor: 'pointer', borderBottom: i < suggestions.length - 1 ? '1px solid #f3f5f8' : 'none', fontSize: '13px', color: '#374151' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7f8fa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#9ca3af" style={{ flexShrink: 0 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.display_name.split(',').slice(0, 3).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop: dropdowns inline */}
          {!isMobile && (
            <>
              <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <select value={priceRange} onChange={e => setPriceRange(e.target.value)} style={selectStyle}>
                {PRICE_RANGES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...selectStyle, minWidth: '155px' }}>
                {SORT_OPTIONS.filter(s => s.key !== 'nearest' || locStatus === 'granted').map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              {activeFilters > 0 && (
                <button
                  onClick={() => { setCategory(''); setPriceRange(''); setSort(locStatus === 'granted' ? 'nearest' : 'newest'); }}
                  style={{ padding: '9px 12px', background: 'transparent', color: '#EC1940', border: '1.5px solid rgba(236,25,64,0.3)', borderRadius: '9px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  Clear
                </button>
              )}
            </>
          )}

          {/* Mobile: Filter button */}
          {isMobile && (
            <button
              onClick={() => setFilterOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 14px',
                background: activeFilters > 0 ? 'linear-gradient(135deg,#EC1940,#F89C1C)' : '#f7f8fa',
                color: activeFilters > 0 ? '#fff' : '#374151',
                border: activeFilters > 0 ? 'none' : '1.5px solid #e2e5ea',
                borderRadius: '9px', fontSize: '13px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters{activeFilters > 0 ? ` (${activeFilters})` : ''}
            </button>
          )}

          {/* Search button */}
          <button
            onClick={handleSearchSubmit}
            style={{ padding: '9px 18px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap', opacity: searching ? 0.75 : 1 }}
          >
            {searching ? '...' : 'Search'}
          </button>
        </div>
      </div>

      {/* ══ LISTINGS GRID ═════════════════════════════════════════ */}
      <div style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '16px 12px' : '24px 24px', boxSizing: 'border-box' }}>

        {!loading && !error && (
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px 0', fontWeight: '500' }}>
            {total} propert{total !== 1 ? 'ies' : 'y'} found
            {category ? ` · ${CATEGORIES.find(c => c.key === category)?.label}` : ''}
            {search ? ` · "${search}"` : ''}
          </p>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>{error}</div>
            <button onClick={() => fetchListings(0)} style={{ padding: '9px 22px', background: '#EC1940', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600' }}>Retry</button>
          </div>
        )}

        {loading && listings.length === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(248px,1fr))', gap: isMobile ? '10px' : '18px' }}>
            {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && !error && processed.length === 0 && (
          <div style={{ textAlign: 'center', padding: '72px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>🏡</div>
            <div style={{ fontWeight: '700', color: '#374151', marginBottom: '6px', fontSize: '17px' }}>No properties found</div>
            <div style={{ fontSize: '13.5px' }}>Try adjusting your filters or search term</div>
          </div>
        )}

        {processed.length > 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(248px,1fr))', gap: isMobile ? '10px' : '18px' }}>
              {processed.map(l => {
                const dist = (userLoc && l.latitude && l.longitude && sort === 'nearest')
                  ? haversineKm(userLoc.lat, userLoc.lng, l.latitude, l.longitude) : null;
                return <ListingCard key={l.id} listing={l} distanceKm={dist} onClick={id => navigate(`/buy-sell/property/${id}`)} />;
              })}
              {loading && [1,2,3,4].map(i => <SkeletonCard key={`sk${i}`} />)}
            </div>
            {page < totalPages - 1 && !loading && (
              <div style={{ textAlign: 'center', marginTop: '36px' }}>
                <button
                  onClick={() => fetchListings(page + 1, false)}
                  style={{ padding: '13px 40px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 18px rgba(236,25,64,0.3)' }}
                >
                  Load More Properties
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Map link */}
      <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #eef0f3', background: '#fff' }}>
        <span onClick={() => navigate('/buy-sell/map')} style={{ fontSize: '13px', color: '#EC1940', fontWeight: '600', cursor: 'pointer' }}>
          🗺 Browse all listings on Map →
        </span>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        category={category} setCategory={setCategory}
        priceRange={priceRange} setPriceRange={setPriceRange}
        sort={sort} setSort={setSort}
        locStatus={locStatus}
      />

      <style>{`
        @keyframes shimmer { to { background-position: -200% 0; } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

const selectStyle = {
  padding: '9px 12px',
  border: '1.5px solid #e2e5ea',
  borderRadius: '9px',
  fontSize: '13px',
  fontFamily: 'inherit',
  background: '#f7f8fa',
  color: '#374151',
  cursor: 'pointer',
  flexShrink: 0,
  outline: 'none',
};