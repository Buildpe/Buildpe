import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PlatformToggle from '../components/common/PlatformToggle';
import BuySellNav from '../components/common/BuySellNav';

// ── Fix Vite marker icon bug ───────────────────────────────────────────
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
});

// ── Property pin ───────────────────────────────────────────────────────
const propertyPin = (selected = false) => L.divIcon({
  html: `<div style="
    width:${selected ? 18 : 13}px;height:${selected ? 18 : 13}px;border-radius:50%;
    background:linear-gradient(135deg,#EC1940,#F89C1C);
    border:${selected ? 3 : 2}px solid #fff;
    box-shadow:0 2px 8px rgba(236,25,64,0.40);
    ${selected ? 'outline:3px solid rgba(236,25,64,0.22);' : ''}
  "></div>`,
  className:   '',
  iconSize:    [selected ? 18 : 13, selected ? 18 : 13],
  iconAnchor:  [selected ? 9 : 6.5, selected ? 9 : 6.5],
  popupAnchor: [0, selected ? -12 : -9],
});

// ── Live location pin ──────────────────────────────────────────────────
const livePin = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#1D4ED8;border:3px solid #fff;box-shadow:0 0 0 5px rgba(29,78,216,0.20);"></div>`,
  className:  '',
  iconSize:   [16, 16],
  iconAnchor: [8, 8],
});

const HYD        = { minLat: 17.20, maxLat: 17.65, minLng: 78.25, maxLng: 78.75 };
const HYD_CENTER = [17.385, 78.4867];

const fmt = (n) => {
  if (!n) return 'Contact';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n}`;
};

function MapEvents({ onBoundsChange }) {
  const map   = useMap();
  const timer = useRef(null);
  useMapEvents({
    moveend: () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const b = map.getBounds();
        onBoundsChange({
          minLat: b.getSouth(), maxLat: b.getNorth(),
          minLng: b.getWest(),  maxLng: b.getEast(),
        });
      }, 400);
    },
  });
  return null;
}

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 14, { duration: 1.2 });
  }, [coords]);
  return null;
}

export default function BuySellMap() {
  const navigate = useNavigate();

  const [listings,    setListings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedId,  setSelectedId]  = useState(null);
  const [liveCoords,  setLiveCoords]  = useState(null);
  const [locating,    setLocating]    = useState(false);
  const [flyTo,       setFlyTo]       = useState(null);
  const [showList,    setShowList]    = useState(false);
  const [searchParams]                  = useSearchParams();
  const [searchVal,   setSearchVal]   = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching,   setSearching]   = useState(false);
  const debounceRef = useRef(null);

  const fetchListings = useCallback(async (bounds = HYD) => {
    setLoading(true);
    try {
      const res  = await fetch(
        `/api/public/listings/map?minLat=${bounds.minLat}&maxLat=${bounds.maxLat}&minLng=${bounds.minLng}&maxLng=${bounds.maxLng}`
      );
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const id  = searchParams.get('id');

    if (lat && lng) {
      // Fly to the specific property and fetch listings around it
      const coords = [parseFloat(lat), parseFloat(lng)];
      setFlyTo(coords);
      if (id) setSelectedId(Number(id));
      const d = 0.05;
      fetchListings({
        minLat: coords[0] - d, maxLat: coords[0] + d,
        minLng: coords[1] - d, maxLng: coords[1] + d,
      });
    } else {
      fetchListings(HYD);
    }
  }, [fetchListings]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchInput = (val) => {
    setSearchVal(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&countrycodes=in&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch { setSuggestions([]); }
    }, 350);
  };

  const pickSuggestion = (item) => {
    setSearchVal(item.display_name.split(',').slice(0, 2).join(','));
    setSuggestions([]);
    setFlyTo([parseFloat(item.lat), parseFloat(item.lon)]);
  };

  const handleSearchSubmit = async () => {
    if (!searchVal.trim()) return;
    setSearching(true);
    setSuggestions([]);
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchVal)}&format=json&limit=1&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data.length > 0) {
        const c = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setFlyTo(c);
        const d = 0.04;
        fetchListings({ minLat: c[0] - d, maxLat: c[0] + d, minLng: c[1] - d, maxLng: c[1] + d });
      }
    } catch {
      // silently ignore
    } finally {
      setSearching(false);
    }
  };

  const handleLiveLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = [pos.coords.latitude, pos.coords.longitude];
        setLiveCoords(c);
        setFlyTo(c);
        setLocating(false);
        const d = 0.05;
        fetchListings({ minLat: c[0] - d, maxLat: c[0] + d, minLng: c[1] - d, maxLng: c[1] + d });
      },
      () => { setLocating(false); alert('Could not get your location. Please allow access.'); },
      { timeout: 10000 }
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'inherit', overflow: 'hidden' }}>

      <PlatformToggle active="buysell" />
      <BuySellNav />

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Map */}
        <MapContainer center={HYD_CENTER} zoom={12} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />
          <MapEvents onBoundsChange={fetchListings} />
          {flyTo && <FlyTo coords={flyTo} />}

          {listings.map(l => (
            <Marker
              key={l.id}
              position={[l.latitude, l.longitude]}
              icon={propertyPin(selectedId === l.id)}
              eventHandlers={{ click: () => setSelectedId(l.id) }}
            >
              <Popup closeButton={false} autoPan={false}>
                <div style={{ width: '190px', fontFamily: 'inherit' }}>
                  {l.thumbnailUrl
                    ? <img src={l.thumbnailUrl} alt={l.title} style={{ width: '100%', height: '88px', objectFit: 'cover', borderRadius: '7px', marginBottom: '8px', display: 'block' }} />
                    : <div style={{ width: '100%', height: '72px', background: '#f1f5f9', borderRadius: '7px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🏠</div>
                  }
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#111', marginBottom: '3px', lineHeight: 1.3 }}>{l.title}</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{fmt(l.price)}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '10px' }}>📍 {l.locality || l.city}{l.areaSqft && ` · ${l.areaSqft} sqft`}</div>
                  <button
                    onClick={() => navigate(`/buy-sell/buy/${l.id}`)}
                    style={{ width: '100%', padding: '8px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {liveCoords && (
            <Marker position={liveCoords} icon={livePin}>
              <Popup closeButton={false}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#1D4ED8' }}>📍 You are here</div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating search bar */}
        <div style={{ position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '440px', zIndex: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: suggestions.length > 0 ? '12px 12px 0 0' : '50px', padding: '8px 8px 8px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.13)', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.38 }}>
              <circle cx="11" cy="11" r="8" stroke="#374151" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Enter location..."
              value={searchVal}
              onChange={e => handleSearchInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearchSubmit(); if (e.key === 'Escape') setSuggestions([]); }}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#111827', background: 'transparent', fontFamily: 'inherit' }}
            />
            {searchVal && (
              <button onClick={() => { setSearchVal(''); setSuggestions([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px', flexShrink: 0, display: 'flex' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            )}
            <button
              onClick={handleSearchSubmit}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', border: 'none', borderRadius: '25px', fontSize: '12.5px', fontWeight: '600', color: '#fff', cursor: searching ? 'default' : 'pointer', fontFamily: 'inherit', flexShrink: 0, opacity: searching ? 0.75 : 1 }}
            >
              {searching
                ? <span style={{ width: '12px', height: '12px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                : <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                    Search
                  </>
              }
            </button>
          </div>

          {suggestions.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.10)' }}>
              {suggestions.map((s, i) => {
                const parts = s.display_name.split(',');
                const main  = parts.slice(0, 2).join(',').trim();
                const sub   = parts.slice(2, 4).join(',').trim();
                return (
                  <div
                    key={i}
                    onClick={() => pickSuggestion(s)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', cursor: 'pointer', borderBottom: i < suggestions.length - 1 ? '1px solid #f9fafb' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#374151" strokeWidth="1.8" />
                    </svg>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{main}</div>
                      {sub && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Loading pill */}
        {loading && (
          <div style={{ position: 'absolute', top: '70px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', color: '#374151', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', zIndex: 500, display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '11px', height: '11px', border: '2px solid #EC1940', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            Loading properties...
          </div>
        )}

        {/* Map / List toggle — bottom center */}
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 600, display: 'flex', background: '#1a1a2e', borderRadius: '30px', padding: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
          <button
            onClick={() => setShowList(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: !showList ? '#ffffff' : 'transparent', border: 'none', borderRadius: '25px', fontSize: '12.5px', fontWeight: '600', color: !showList ? '#111827' : 'rgba(255,255,255,0.65)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            Map
          </button>
          <button
            onClick={() => setShowList(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: showList ? '#ffffff' : 'transparent', border: 'none', borderRadius: '25px', fontSize: '12.5px', fontWeight: '600', color: showList ? '#111827' : 'rgba(255,255,255,0.65)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            List {listings.length > 0 && `(${listings.length})`}
          </button>
        </div>

        {/* Live location button */}
        <button
          onClick={handleLiveLocation}
          disabled={locating}
          title="Show my location"
          style={{ position: 'absolute', bottom: '90px', right: '12px', zIndex: 500, width: '42px', height: '42px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locating ? 'default' : 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.14)' }}
        >
          {locating
            ? <span style={{ width: '16px', height: '16px', border: '2px solid #1D4ED8', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" stroke="#1D4ED8" strokeWidth="2" />
                <circle cx="12" cy="12" r="8" stroke="#1D4ED8" strokeWidth="1.5" strokeDasharray="2 2" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
              </svg>
          }
        </button>

        {/* List panel — slides up from bottom */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 700,
          transform: showList ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          background: '#fff', borderRadius: '16px 16px 0 0',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.14)',
          maxHeight: '60vh', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0 6px' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#e5e7eb' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px 10px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>
              {listings.length} Propert{listings.length !== 1 ? 'ies' : 'y'} in this area
            </span>
            <button onClick={() => setShowList(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', fontSize: '18px', lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
                <div style={{ fontSize: '13px' }}>No properties in this area. Pan the map to explore.</div>
              </div>
            ) : (
              listings.map(l => (
                <div
                  key={l.id}
                  onClick={() => navigate(`/buy-sell/buy/${l.id}`)}
                  style={{ display: 'flex', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #f9fafb', cursor: 'pointer', background: selectedId === l.id ? '#fff8f5' : '#fff' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = selectedId === l.id ? '#fff8f5' : '#fff'}
                >
                  <div style={{ width: '70px', height: '56px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {l.thumbnailUrl
                      ? <img src={l.thumbnailUrl} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '22px' }}>🏠</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                    <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '3px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{fmt(l.price)}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>📍 {l.locality || l.city}{l.areaSqft && ` · ${l.areaSqft} sqft`}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.3, alignSelf: 'center' }}>
                    <path d="M9 18l6-6-6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .leaflet-popup-content-wrapper { border-radius:10px !important; box-shadow:0 4px 20px rgba(0,0,0,0.14) !important; border:1px solid #e5e7eb !important; padding:0 !important; }
        .leaflet-popup-content { margin:10px !important; }
        .leaflet-popup-tip-container { display:none; }
      `}</style>
    </div>
  );
}