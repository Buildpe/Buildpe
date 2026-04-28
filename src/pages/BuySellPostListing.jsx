import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// ── Map click handler — places marker on click ─────────────────
function MapClickHandler({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

// ── Fly to coords when they change ────────────────────────────
function FlyToCoords({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 16, { duration: 1 });
  }, [lat, lng, map]);
  return null;
}
import { useNavigate } from 'react-router-dom';
import PlatformToggle from '../components/common/PlatformToggle';
import BuySellNav from '../components/common/BuySellNav';
import apiClient from '../Services/Api';

// ── Cloudinary config (same as existing ImageUpload component) ──
const CLOUD_NAME    = 'dbjwnych0';
const UPLOAD_PRESET = 'buildpe_services';

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
  { value: '',           label: 'Select property type...' },
  { value: 'land',       label: '🌾  Lands & Plots'       },
  { value: 'commercial', label: '🏢  Commercial Property'  },
  { value: 'apartment',  label: '🏠  Apartment / House'    },
  { value: 'other',      label: '📋  Other'                },
];

const FACING = ['', 'North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const SELLER_TYPES = ['OWNER', 'AGENT', 'BUILDER'];

// ── Step indicator ─────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ['Basic Info', 'Location', 'Photos', 'Review'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '28px' }}>
      {steps.map((label, i) => {
        const done    = step > i;
        const current = step === i;
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? 'linear-gradient(135deg,#EC1940,#F89C1C)' : current ? '#EC1940' : '#e5e7eb',
                color: done || current ? '#fff' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                boxShadow: current ? '0 0 0 4px rgba(236,25,64,0.15)' : 'none',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 11, marginTop: 5, fontWeight: current ? 700 : 400, color: current ? '#EC1940' : done ? '#374151' : '#9ca3af', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? 'linear-gradient(90deg,#EC1940,#F89C1C)' : '#e5e7eb', margin: '0 0 20px', transition: 'background 0.3s' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Form field wrapper ─────────────────────────────────────────
function Field({ label, required, error, children, half }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: half ? '1 1 calc(50% - 8px)' : '1 1 100%', minWidth: half ? 140 : 'auto' }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label}{required && <span style={{ color: '#EC1940', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: '#EC1940' }}>{error}</span>}
    </div>
  );
}

const inp = {
  padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8,
  fontSize: 14, fontFamily: 'inherit', color: '#111827', background: '#fff',
  outline: 'none', width: '100%', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

// ══════════════════════════════════════════════════════════════
export default function BuySellPostListing() {
  const navigate  = useNavigate();
  const isMobile  = useMediaQuery('(max-width: 768px)');
  const fileRef   = useRef();

  const [step,    setStep]    = useState(0);
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(false);

  // Images
  const [images,    setImages]    = useState([]);   // [{ url, uploading, error }]
  const [uploading, setUploading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title:            '',
    description:      '',
    price:            '',
    category:         '',
    areaSqft:         '',
    bhkCount:         '',
    floors:           '',
    facing:           '',
    roadWidthFt:      '',
    approvalType:     '',
    sellerType:       'OWNER',
    address:          '',
    locality:         '',
    city:             '',
    state:            'Telangana',
    latitude:         '',
    longitude:        '',
    hideExactAddress: true,
    roiPercent:       '',
  });

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  // ── Cloudinary upload for multiple images ──────────────────
  const handleFiles = async (files) => {
    const remaining = 8 - images.length;
    const toUpload  = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;

    setUploading(true);
    const placeholders = toUpload.map((_, i) => ({ id: Date.now() + i, url: null, uploading: true, error: null }));
    setImages(prev => [...prev, ...placeholders]);

    const results = await Promise.all(toUpload.map(async (file, i) => {
      const id = placeholders[i].id;
      if (!file.type.startsWith('image/')) return { id, error: 'Not an image' };
      if (file.size > 5 * 1024 * 1024) return { id, error: 'Max 5MB' };

      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', UPLOAD_PRESET);
      try {
        const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
        const data = await res.json();
        return { id, url: data.secure_url };
      } catch {
        return { id, error: 'Upload failed' };
      }
    }));

    setImages(prev => prev.map(img => {
      const result = results.find(r => r.id === img.id);
      if (!result) return img;
      return { ...img, url: result.url || null, uploading: false, error: result.error || null };
    }));
    setUploading(false);
  };

  const removeImage = (id) => setImages(prev => prev.filter(i => i.id !== id));
  const moveImage   = (id, dir) => {
    setImages(prev => {
      const arr = [...prev];
      const idx = arr.findIndex(i => i.id === id);
      const to  = idx + dir;
      if (to < 0 || to >= arr.length) return arr;
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      return arr;
    });
  };

  // ── Validation per step ────────────────────────────────────
  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.title.trim())    e.title    = 'Title is required';
      if (!form.category)        e.category = 'Select a property type';
      if (form.price && isNaN(Number(form.price))) e.price = 'Enter a valid number';
    }
    if (s === 1) {
      if (!form.city.trim()) e.city = 'City is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate(2)) return;
    setSaving(true);
    try {
      const payload = {
        title:            form.title.trim(),
        description:      form.description.trim() || null,
        price:            form.price ? Number(form.price) : null,
        category:         form.category || null,
        areaSqft:         form.areaSqft ? Number(form.areaSqft) : null,
        bhkCount:         form.bhkCount ? Number(form.bhkCount) : null,
        floors:           form.floors   ? Number(form.floors)   : null,
        facing:           form.facing   || null,
        roadWidthFt:      form.roadWidthFt ? Number(form.roadWidthFt) : null,
        approvalType:     form.approvalType || null,
        sellerType:       form.sellerType,
        address:          form.address.trim()  || null,
        locality:         form.locality.trim() || null,
        city:             form.city.trim(),
        state:            form.state.trim() || null,
        latitude:         form.latitude  ? Number(form.latitude)  : null,
        longitude:        form.longitude ? Number(form.longitude) : null,
        hideExactAddress: form.hideExactAddress,
        roiPercent:       form.roiPercent ? Number(form.roiPercent) : null,
        imgUrls:          images.filter(i => i.url && !i.error).map(i => i.url),
      };
      await apiClient.post('/api/user/listings', payload);
      setSuccess(true);
    } catch (err) {
      const msg = err?.response?.status === 401 ? 'Please login to post a listing.' : 'Failed to submit. Please try again.';
      setErrors({ submit: msg });
    } finally {
      setSaving(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────
  if (success) return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
      <PlatformToggle active="buysell" /><BuySellNav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 4px 20px rgba(22,163,74,0.25)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 800, color: '#111827' }}>Listing Submitted!</h2>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: '#6b7280', maxWidth: 320, lineHeight: 1.65 }}>
          Your property has been submitted for review. Our admin team will verify and make it live within 24 hours.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/buy-sell/sell')} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: 25, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Post Another
          </button>
          <button onClick={() => navigate('/buy-sell/buy/listings')} style={{ padding: '11px 24px', background: 'none', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: 25, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Browse Listings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
      <PlatformToggle active="buysell" />
      <BuySellNav />

      <div style={{ flex: 1, maxWidth: 680, width: '100%', margin: '0 auto', padding: isMobile ? '16px 12px' : '28px 24px', boxSizing: 'border-box' }}>

        <h1 style={{ margin: '0 0 6px', fontSize: isMobile ? 20 : 26, fontWeight: 800, color: '#111827' }}>Post Your Property</h1>
        <p style={{ margin: '0 0 24px', fontSize: 13.5, color: '#6b7280' }}>Free listing · Admin verified within 24 hours</p>

        <StepBar step={step} />

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: isMobile ? '20px 16px' : '28px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

          {/* ── STEP 0: Basic Info ─────────────────────────────── */}
          {step === 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Field label="Property Title" required error={errors.title}>
                <input style={{ ...inp, borderColor: errors.title ? '#EC1940' : '#e5e7eb' }} placeholder="e.g. 200 sqyd Plot in Kondapur" value={form.title} onChange={e => set('title', e.target.value)} onFocus={e => e.target.style.borderColor = '#EC1940'} onBlur={e => e.target.style.borderColor = errors.title ? '#EC1940' : '#e5e7eb'} />
              </Field>

              <Field label="Property Type" required error={errors.category}>
                <select style={{ ...inp, borderColor: errors.category ? '#EC1940' : '#e5e7eb', cursor: 'pointer' }} value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>

              <Field label="Price (₹)" error={errors.price} half>
                <input style={{ ...inp, borderColor: errors.price ? '#EC1940' : '#e5e7eb' }} type="number" min="0" placeholder="e.g. 4500000" value={form.price} onChange={e => set('price', e.target.value)} />
              </Field>

              <Field label="Area (sq ft)" half>
                <input style={inp} type="number" min="0" placeholder="e.g. 1200" value={form.areaSqft} onChange={e => set('areaSqft', e.target.value)} />
              </Field>

              <Field label="BHK Count" half>
                <input style={inp} type="number" min="1" max="10" placeholder="e.g. 3" value={form.bhkCount} onChange={e => set('bhkCount', e.target.value)} />
              </Field>

              <Field label="Facing" half>
                <select style={{ ...inp, cursor: 'pointer' }} value={form.facing} onChange={e => set('facing', e.target.value)}>
                  {FACING.map(f => <option key={f} value={f}>{f || 'Select facing...'}</option>)}
                </select>
              </Field>

              <Field label="Road Width (ft)" half>
                <input style={inp} type="number" min="0" placeholder="e.g. 40" value={form.roadWidthFt} onChange={e => set('roadWidthFt', e.target.value)} />
              </Field>

              <Field label="Floors" half>
                <input style={inp} type="number" min="0" placeholder="e.g. 3" value={form.floors} onChange={e => set('floors', e.target.value)} />
              </Field>

              <Field label="Approval Type">
                <input style={inp} placeholder="e.g. HMDA, RERA, DTCP, Panchayat" value={form.approvalType} onChange={e => set('approvalType', e.target.value)} />
              </Field>

              <Field label="Expected ROI (% per year)" half>
                <input style={inp} type="number" min="0" max="100" step="0.1" placeholder="e.g. 12" value={form.roiPercent} onChange={e => set('roiPercent', e.target.value)} />
              </Field>

              <Field label="Seller Type">
                <div style={{ display: 'flex', gap: 8 }}>
                  {SELLER_TYPES.map(t => (
                    <button key={t} type="button" onClick={() => set('sellerType', t)} style={{ flex: 1, padding: '8px', border: `1.5px solid ${form.sellerType === t ? '#EC1940' : '#e5e7eb'}`, borderRadius: 8, background: form.sellerType === t ? '#fff5f5' : '#fff', color: form.sellerType === t ? '#EC1940' : '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Description">
                <textarea style={{ ...inp, resize: 'vertical', minHeight: 90 }} placeholder="Describe the property — surroundings, amenities, condition..." value={form.description} onChange={e => set('description', e.target.value)} />
              </Field>
            </div>
          )}

          {/* ── STEP 1: Location ──────────────────────────────── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>

              {/* City + Locality */}
              <Field label="City" required error={errors.city} half>
                <input style={{ ...inp, borderColor: errors.city ? '#EC1940' : '#e5e7eb' }} placeholder="e.g. Hyderabad" value={form.city} onChange={e => set('city', e.target.value)} />
              </Field>
              <Field label="Locality / Area" half>
                <input style={inp} placeholder="e.g. Kondapur, Gachibowli" value={form.locality} onChange={e => set('locality', e.target.value)} />
              </Field>
              <Field label="State" half>
                <input style={inp} value={form.state} onChange={e => set('state', e.target.value)} />
              </Field>
              <Field label="Full Address" half>
                <input style={inp} placeholder="Plot no, street, landmark" value={form.address} onChange={e => set('address', e.target.value)} />
              </Field>

              {/* ── Map location picker ─────────────────────────── */}
              <div style={{ flex: '1 1 100%' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  Pin Location on Map
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af', marginLeft: 6 }}>
                    — click anywhere on the map to drop a pin
                  </span>
                </div>

                {/* Use My Location button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); return; }
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        set('latitude',  lat);
                        set('longitude', lng);
                        // Reverse geocode to fill city/locality automatically
                        try {
                          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, { headers: { 'Accept-Language': 'en' } });
                          const data = await res.json();
                          const addr = data.address || {};
                          if (!form.city)     set('city',     addr.city || addr.town || addr.county || '');
                          if (!form.locality) set('locality', addr.suburb || addr.neighbourhood || addr.village || '');
                          if (!form.state)    set('state',    addr.state || '');
                          if (!form.address)  set('address',  data.display_name?.split(',').slice(0, 3).join(', ') || '');
                        } catch (_e) { /* reverse geocode is non-critical */ }
                      },
                      () => alert('Could not get your location. Please allow location access in your browser.')
                    );
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: 25, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12, boxShadow: '0 2px 8px rgba(236,25,64,0.25)' }}
                >
                  {/* GPS icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="1.5" strokeDasharray="2 2"/>
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Use My Current Location
                </button>

                {/* Leaflet map */}
                <div style={{ borderRadius: 12, overflow: 'hidden', border: form.latitude && form.longitude ? '2px solid #EC1940' : '1.5px solid #e5e7eb', height: 280, position: 'relative' }}>
                  <MapContainer
                    center={form.latitude && form.longitude ? [Number(form.latitude), Number(form.longitude)] : [17.385, 78.4867]}
                    zoom={form.latitude && form.longitude ? 16 : 12}
                    style={{ width: '100%', height: '100%' }}
                    zoomControl={true}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; OpenStreetMap &copy; CARTO'
                      maxZoom={19}
                    />
                    <MapClickHandler onPick={async (lat, lng) => {
                      set('latitude',  lat);
                      set('longitude', lng);
                      // Auto-fill city/locality from reverse geocode
                      try {
                        const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, { headers: { 'Accept-Language': 'en' } });
                        const data = await res.json();
                        const addr = data.address || {};
                        if (!form.city)     set('city',     addr.city || addr.town || addr.county || '');
                        if (!form.locality) set('locality', addr.suburb || addr.neighbourhood || addr.village || '');
                        if (!form.state)    set('state',    addr.state || '');
                      } catch (_e) { /* reverse geocode is non-critical */ }
                    }} />
                    {form.latitude && form.longitude && (
                      <>
                        <FlyToCoords lat={Number(form.latitude)} lng={Number(form.longitude)} />
                        <Marker position={[Number(form.latitude), Number(form.longitude)]} />
                      </>
                    )}
                  </MapContainer>
                  {/* Hint overlay when no pin yet */}
                  {!form.latitude && (
                    <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.60)', color: '#fff', fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 20, pointerEvents: 'none', zIndex: 500, whiteSpace: 'nowrap' }}>
                      👆 Click on the map to pin your property
                    </div>
                  )}
                </div>

                {/* Coordinates readout */}
                {form.latitude && form.longitude && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, padding: '8px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 12 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ color: '#15803d', fontWeight: 600 }}>Location pinned</span>
                    <span style={{ color: '#6b7280', marginLeft: 4 }}>{Number(form.latitude).toFixed(5)}, {Number(form.longitude).toFixed(5)}</span>
                    <button
                      type="button"
                      onClick={() => { set('latitude', ''); set('longitude', ''); }}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 12, padding: '2px 4px', fontFamily: 'inherit' }}
                    >
                      Remove ×
                    </button>
                  </div>
                )}
              </div>

              {/* ── Privacy toggle ─────────────────────────────── */}
              <div style={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f9fafb', borderRadius: 10, border: '1.5px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#111827' }}>Hide Exact Location</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Show only city/locality to public. Exact pin shared only when buyer contacts you.</div>
                </div>
                <div
                  onClick={() => set('hideExactAddress', !form.hideExactAddress)}
                  style={{ width: 44, height: 24, borderRadius: 12, background: form.hideExactAddress ? 'linear-gradient(135deg,#EC1940,#F89C1C)' : '#e5e7eb', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
                >
                  <div style={{ position: 'absolute', top: 3, left: form.hideExactAddress ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Photos ────────────────────────────────── */}
          {step === 2 && (
            <div>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280' }}>
                Upload up to 8 photos. First photo is the cover image shown in search results. Drag to reorder.
              </p>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                style={{ border: '2px dashed #e5e7eb', borderRadius: 12, padding: '28px 20px', textAlign: 'center', cursor: images.length >= 8 ? 'not-allowed' : 'pointer', background: '#fafafa', marginBottom: 16, transition: 'border-color 0.15s' }}
                onMouseEnter={e => { if (images.length < 8) e.currentTarget.style.borderColor = '#EC1940'; }}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                  {images.length >= 8 ? 'Maximum 8 photos reached' : 'Click or drag photos here'}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>JPG, PNG · Max 5MB each · {8 - images.length} slots remaining</div>
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />

              {/* Image grid */}
              {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 10 }}>
                  {images.map((img, i) => (
                    <div key={img.id} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: i === 0 ? '2.5px solid #EC1940' : '1.5px solid #e5e7eb', aspectRatio: '4/3', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {img.uploading && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 20, height: 20, border: '2.5px solid #EC1940', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                          <span style={{ fontSize: 10, color: '#9ca3af' }}>Uploading...</span>
                        </div>
                      )}
                      {img.error && (
                        <div style={{ fontSize: 10, color: '#EC1940', textAlign: 'center', padding: 4 }}>{img.error}</div>
                      )}
                      {img.url && <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}

                      {/* Cover badge */}
                      {i === 0 && img.url && (
                        <span style={{ position: 'absolute', top: 5, left: 5, fontSize: 9, fontWeight: 700, background: '#EC1940', color: '#fff', padding: '2px 6px', borderRadius: 10 }}>COVER</span>
                      )}

                      {/* Controls */}
                      <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 3 }}>
                        {i > 0 && <button onClick={() => moveImage(img.id, -1)} style={{ width: 20, height: 20, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: 4, color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>}
                        {i < images.length - 1 && <button onClick={() => moveImage(img.id, 1)} style={{ width: 20, height: 20, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: 4, color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>}
                        <button onClick={() => removeImage(img.id)} style={{ width: 20, height: 20, background: 'rgba(220,38,38,0.85)', border: 'none', borderRadius: 4, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Review ────────────────────────────────── */}
          {step === 3 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {/* Summary card */}
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, border: '1.5px solid #e5e7eb' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Property Details</div>
                  {[
                    ['Title',    form.title],
                    ['Type',     form.category],
                    ['Price',    form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : 'Contact for Price'],
                    ['Area',     form.areaSqft ? `${form.areaSqft} sqft` : '—'],
                    ['BHK',      form.bhkCount || '—'],
                    ['Facing',   form.facing || '—'],
                    ['Approval', form.approvalType || '—'],
                    ['Seller',   form.sellerType],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#9ca3af' }}>{k}</span>
                      <span style={{ fontWeight: 600, color: '#111827', maxWidth: '55%', textAlign: 'right', wordBreak: 'break-word' }}>{v}</span>
                    </div>
                  ))}
                </div>
                {/* Location card */}
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, border: '1.5px solid #e5e7eb' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Location</div>
                  {[
                    ['City',     form.city],
                    ['Locality', form.locality || '—'],
                    ['State',    form.state || '—'],
                    ['Address',  form.address || '—'],
                    ['Privacy',  form.hideExactAddress ? 'Hide exact address' : 'Show full address'],
                    ['Photos',   `${images.filter(i => i.url && !i.error).length} uploaded`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#9ca3af' }}>{k}</span>
                      <span style={{ fontWeight: 600, color: '#111827', maxWidth: '55%', textAlign: 'right', wordBreak: 'break-word' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image preview strip */}
              {images.filter(i => i.url).length > 0 && (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16 }}>
                  {images.filter(i => i.url).map((img, i) => (
                    <img key={img.id} src={img.url} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 7, flexShrink: 0, border: i === 0 ? '2px solid #EC1940' : '1px solid #e5e7eb' }} />
                  ))}
                </div>
              )}

              <div style={{ background: '#fff8f5', border: '1.5px solid #fecaca', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                ✅ By submitting, you confirm this is a genuine property listing. Your listing will go live after admin review within 24 hours.
              </div>

              {errors.submit && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>
                  {errors.submit}
                </div>
              )}
            </div>
          )}

          {/* ── Navigation buttons ───────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid #f3f4f6' }}>
            <button
              onClick={step === 0 ? () => navigate('/buy-sell/sell') : back}
              style={{ padding: '11px 24px', background: 'none', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: 25, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {step === 0 ? '← Cancel' : '← Back'}
            </button>

            {step < 3 ? (
              <button
                onClick={next}
                style={{ padding: '11px 28px', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: 25, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving || uploading}
                style={{ padding: '11px 28px', background: saving ? '#9ca3af' : 'linear-gradient(135deg,#EC1940,#F89C1C)', color: '#fff', border: 'none', borderRadius: 25, fontSize: 13.5, fontWeight: 700, cursor: saving ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {saving
                  ? <><div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Submitting...</>
                  : '🚀 Submit Listing'
                }
              </button>
            )}
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}