import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// Custom red pin marker
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapClickHandler({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

function FlyToCoords({ lat, lng, zoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [lat, lng, zoom, map]);
  return null;
}

// ── Smart Search Bar ────────────────────────────────────────────
function SearchBar({ onSelect }) {
  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [focused,     setFocused]     = useState(false);
  const debounceRef = useRef(null);
  const inputRef    = useRef(null);

  const search = useCallback(async (q) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 350);
  };

  const handleSelect = (item) => {
    setQuery(item.display_name.split(',').slice(0, 2).join(','));
    setResults([]);
    onSelect({
      lat:  parseFloat(item.lat),
      lng:  parseFloat(item.lon),
      address: item,
    });
  };

  const clear = () => { setQuery(''); setResults([]); inputRef.current?.focus(); };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff',
        border: focused ? '2px solid #EC1940' : '2px solid transparent',
        borderRadius: 12,
        padding: '0 14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
        transition: 'border-color 0.15s',
        height: 52,
      }}>
        {/* Search icon */}
        {loading ? (
          <div style={{ width: 18, height: 18, border: '2.5px solid #EC1940', borderTopColor: 'transparent', borderRadius: '50%', animation: 'mapspin 0.7s linear infinite', flexShrink: 0 }} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}

        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search area, landmark, city…"
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 15, fontFamily: 'inherit', color: '#111827',
            background: 'transparent',
          }}
        />

        {query && (
          <button onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#fff', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          overflow: 'hidden', zIndex: 10000,
          border: '1px solid #f3f4f6',
        }}>
          {results.map((item, i) => {
            const parts = item.display_name.split(',');
            const main  = parts.slice(0, 2).join(',').trim();
            const sub   = parts.slice(2, 4).join(',').trim();
            return (
              <button
                key={i}
                onMouseDown={() => handleSelect(item)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '12px 16px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit',
                  borderBottom: i < results.length - 1 ? '1px solid #f9fafb' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#EC1940"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#111827' }}>{main}</div>
                  {sub && <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 1 }}>{sub}</div>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Main FullscreenMapPicker component
// ══════════════════════════════════════════════════════════════
export default function FullscreenMapPicker({ initialLat, initialLng, onConfirm, onClose }) {
  const [lat,    setLat]    = useState(initialLat || null);
  const [lng,    setLng]    = useState(initialLng || null);
  const [flyTo,  setFlyTo]  = useState(initialLat ? { lat: initialLat, lng: initialLng } : null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Reverse geocode whenever pin moves
  const reverseGeocode = useCallback(async (lat, lng) => {
    setLoading(true);
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setAddress(data.display_name || '');
      return data;
    } catch {
      setAddress('');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePick = async (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
    await reverseGeocode(newLat, newLng);
  };

  const handleSearchSelect = async ({ lat: sLat, lng: sLng, address: addrObj }) => {
    setLat(sLat);
    setLng(sLng);
    setFlyTo({ lat: sLat, lng: sLng });
    const a = addrObj?.address || {};
    setAddress(addrObj?.display_name || '');
  };

  const handleGPS = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const la = pos.coords.latitude;
        const lo = pos.coords.longitude;
        setLat(la); setLng(lo);
        setFlyTo({ lat: la, lng: lo });
        await reverseGeocode(la, lo);
      },
      () => alert('Could not get your location.')
    );
  };

  const handleConfirm = async () => {
    if (!lat || !lng) return;
    // Build location data from reverse geocode
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const a    = data.address || {};
    onConfirm({
      lat, lng,
      city:     a.city || a.town || a.county || '',
      locality: a.suburb || a.neighbourhood || a.village || '',
      state:    a.state || '',
      address:  data.display_name?.split(',').slice(0, 3).join(', ') || '',
    });
  };

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 9000,
          backdropFilter: 'blur(3px)',
          animation: 'mapfadein 0.2s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', inset: 0,
        zIndex: 9001,
        display: 'flex', flexDirection: 'column',
        margin: '20px',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
        animation: 'mapslideup 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* ── Top Bar ─────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fff',
              borderRadius: 12, padding: '10px 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EC1940' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Pin Property Location</span>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#fff', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#111827" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Search bar */}
          <SearchBar onSelect={handleSearchSelect} />
        </div>

        {/* ── Map ─────────────────────────────────────────── */}
        <MapContainer
          center={lat && lng ? [lat, lng] : [20.5937, 78.9629]}
          zoom={lat && lng ? 15 : 5}
          style={{ width: '100%', height: '100%', zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
            maxZoom={19}
          />
          <MapClickHandler onPick={handlePick} />
          {flyTo && <FlyToCoords lat={flyTo.lat} lng={flyTo.lng} />}
          {lat && lng && <Marker position={[lat, lng]} icon={redIcon} />}
        </MapContainer>

        {/* Crosshair hint when no pin */}
        {!lat && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 500, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              padding: '10px 20px',
              background: 'rgba(0,0,0,0.7)',
              borderRadius: 30, color: '#fff',
              fontSize: 13, fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}>
              👆 Tap on map to drop pin
            </div>
          </div>
        )}

        {/* ── Bottom Bar ──────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: '12px 16px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {/* GPS button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleGPS}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px',
                background: '#fff', border: 'none', borderRadius: 25,
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                fontSize: 13, fontWeight: 600, color: '#374151',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" stroke="#EC1940" strokeWidth="2"/>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#EC1940" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Use My Location
            </button>
          </div>

          {/* Address + Confirm panel */}
          <div style={{
            background: '#fff', borderRadius: 16,
            padding: '16px', boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
          }}>
            {lat && lng ? (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#EC1940"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    {loading ? (
                      <div style={{ fontSize: 13, color: '#9ca3af' }}>Fetching address…</div>
                    ) : (
                      <>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>
                          {address.split(',').slice(0, 3).join(', ')}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 2 }}>
                          {lat.toFixed(5)}, {lng.toFixed(5)}
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => { setLat(null); setLng(null); setAddress(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, fontSize: 18, lineHeight: 1 }}
                  >×</button>
                </div>

                <button
                  onClick={handleConfirm}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'linear-gradient(135deg, #EC1940, #F89C1C)',
                    color: '#fff', border: 'none', borderRadius: 12,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 16px rgba(236,25,64,0.35)',
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ✓ Confirm This Location
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 13.5, color: '#9ca3af' }}>
                Search above or tap the map to pin your property
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mapfadein  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mapslideup { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes mapspin    { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
