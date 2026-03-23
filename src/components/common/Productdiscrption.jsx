import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Star, Zap, Send, LogIn,
  CheckCircle, Phone, Mail, User, ImageIcon,
  ArrowRight, Tag, Shield, Clock, Award,
  ThumbsUp, MapPin
} from 'lucide-react';
import { tokenStorage } from '../../Services/Authapi';

const GOOGLE_FORM_CONFIG = {
  formId: '1FAIpQLSf-z5xESgi94JF64E1KQ7vFIuqoOtbQQYKSij4CFwAI-KY0Aw',
  entries: {
    serviceName: 'entry.77093322',
    name:        'entry.1392727185',
    phone:       'entry.1491459465',
    email:       'entry.903938955',
  }
};

const ProductDescription = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showQuote,  setShowQuote]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen || !product) return null;

  const isLoggedIn = tokenStorage.isLoggedIn();
  const userInfo   = tokenStorage.getUserInfo();
  const fullName   = `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim();

  // ── Price — always calculate from raw numbers ──────────────
  const rawOriginal = product.originalPrice ? Number(product.originalPrice) : null;
  const rawDiscount = product.discount       ? Number(product.discount)       : 0;
  const hasPrice    = rawOriginal && rawOriginal > 0;
  const hasDiscount = rawDiscount > 0;

  let discountedPrice = null;
  let savedAmount     = null;
  if (hasPrice && hasDiscount) {
    discountedPrice = Math.round(rawOriginal * (1 - rawDiscount / 100));
    savedAmount     = rawOriginal - discountedPrice;
  }

  const displayPrice = discountedPrice
    ? `₹${discountedPrice.toLocaleString('en-IN')}`
    : hasPrice ? `₹${rawOriginal.toLocaleString('en-IN')}` : 'Get Quote!';

  const strikePrice = (hasPrice && hasDiscount)
    ? `₹${rawOriginal.toLocaleString('en-IN')}` : null;

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!userInfo) return;
    const phone  = userInfo.phoneNumber || phoneInput.trim();
    if (!phone) { setPhoneError('Phone number is required'); return; }
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.length < 10 || digits.length > 15) { setPhoneError('Enter a valid phone number'); return; }
    setPhoneError('');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append(GOOGLE_FORM_CONFIG.entries.serviceName, product.title);
      fd.append(GOOGLE_FORM_CONFIG.entries.name,  fullName);
      fd.append(GOOGLE_FORM_CONFIG.entries.phone, phone);
      fd.append(GOOGLE_FORM_CONFIG.entries.email, userInfo.email || '');
      await fetch(`https://docs.google.com/forms/d/e/${GOOGLE_FORM_CONFIG.formId}/formResponse`,
        { method: 'POST', body: fd, mode: 'no-cors' });
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setShowQuote(false); onClose(); }, 3500);
    } catch { }
    finally { setSubmitting(false); }
  };

  return (
    <>
      <div className="pd-overlay">
        <div className="pd-backdrop-click" onClick={onClose} />

        <div className="pd-card">

          {/* Close */}
          <button className="pd-x" onClick={onClose}><X size={18} /></button>

          {/* ══ LEFT ══ */}
          <div className="pd-left">

            {/* Image */}
            <div className="pd-img-box">
              {hasDiscount && (
                <div className="pd-badge"><Zap size={11} fill="white" strokeWidth={0} />{rawDiscount}% OFF</div>
              )}
              {product.image ? (
                <img src={product.image} alt={product.title} className="pd-img" />
              ) : (
                <div className="pd-img-empty"><ImageIcon size={52} strokeWidth={1} /><span>No Image</span></div>
              )}
            </div>

            {/* Price */}
            <div className="pd-price-block">
              <div className="pd-price-row">
                <span className="pd-price">{displayPrice}</span>
                {strikePrice && <span className="pd-strike">{strikePrice}</span>}
              </div>
              {savedAmount && savedAmount > 0 && (
                <div className="pd-save-pill">
                  <Tag size={10} />
                  Save ₹{savedAmount.toLocaleString('en-IN')} ({rawDiscount}% off)
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="pd-rating">
              {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#F59E0B" color="#F59E0B" />)}
              <span className="pd-rating-n">4.8</span>
              <span className="pd-rating-c">· 2,345 reviews</span>
            </div>

            {/* Highlights */}
            <div className="pd-highlights">
              <div className="pd-hl"><Shield  size={15} /><div><strong>Secure Payment</strong><span>100% safe & encrypted</span></div></div>
              <div className="pd-hl"><Award   size={15} /><div><strong>1 Year Warranty</strong><span>Official guarantee</span></div></div>
              <div className="pd-hl"><Clock   size={15} /><div><strong>3–5 Days Delivery</strong><span>Fast turnaround</span></div></div>
              <div className="pd-hl"><ThumbsUp size={15} /><div><strong>Verified Service</strong><span>Quality assured</span></div></div>
              <div className="pd-hl"><MapPin  size={15} /><div><strong>Pan India</strong><span>Available everywhere</span></div></div>
            </div>

          </div>

          {/* ══ RIGHT ══ */}
          <div className="pd-right">

            {product.category && <span className="pd-cat">{product.category}</span>}

            <h1 className="pd-title">{product.title}</h1>

            {/* Price — mobile only */}
            <div className="pd-price-mobile">
              <span className="pd-price">{displayPrice}</span>
              {strikePrice && <span className="pd-strike">{strikePrice}</span>}
              {savedAmount && savedAmount > 0 && (
                <span className="pd-save-pill"><Tag size={9} />Save ₹{savedAmount.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="pd-sep" />

            <p className="pd-section-lbl">About this service</p>
            <p className="pd-desc">{product.description || 'No description available.'}</p>

            <div className="pd-sep" />

            {/* Service perks */}
            <div className="pd-perks">
              <div className="pd-perk"><CheckCircle size={14} /><span>Premium quality materials</span></div>
              <div className="pd-perk"><CheckCircle size={14} /><span>Expert professionals</span></div>
              <div className="pd-perk"><CheckCircle size={14} /><span>Timely delivery guaranteed</span></div>
              <div className="pd-perk"><CheckCircle size={14} /><span>Post-service support</span></div>
            </div>

            <div className="pd-sep" />

            {/* ── Quote states ── */}
            {!showQuote && (
              <div className="pd-cta">
                <button className="pd-btn-cta" onClick={() => setShowQuote(true)}>
                  <Send size={17} /> Get Your Quote <ArrowRight size={16} />
                </button>
                <p className="pd-cta-note">Free consultation · No commitment required</p>
              </div>
            )}

            {showQuote && !isLoggedIn && (
              <div className="pd-box pd-box--blue">
                <div className="pd-box-top">
                  <div className="pd-box-ico pd-box-ico--blue"><LogIn size={20} /></div>
                  <div>
                    <h4>Login to get a quote</h4>
                    <p>We'll use your saved details — no form needed</p>
                  </div>
                </div>
                <div className="pd-box-btns">
                  <button className="pd-btn-ghost" onClick={() => setShowQuote(false)}>Back</button>
                  <button className="pd-btn-primary" onClick={() => { onClose(); navigate('/login'); }}>
                    <LogIn size={13} /> Login Now
                  </button>
                </div>
              </div>
            )}

            {showQuote && isLoggedIn && !submitted && (
              <div className="pd-box pd-box--white">
                <div className="pd-box-top">
                  <div className="pd-box-ico pd-box-ico--red"><Send size={18} /></div>
                  <div>
                    <h4>Get Your Quote</h4>
                    <p>For: <strong>{product.title}</strong></p>
                  </div>
                </div>
                <div className="pd-info-list">
                  <div className="pd-info-row">
                    <span className="pd-info-ico"><User size={12} /></span>
                    <span className="pd-info-k">Name</span>
                    <span className="pd-info-v">{fullName || '—'}</span>
                  </div>
                  <div className="pd-info-row">
                    <span className="pd-info-ico"><Mail size={12} /></span>
                    <span className="pd-info-k">Email</span>
                    <span className="pd-info-v">{userInfo?.email || '—'}</span>
                  </div>
                  <div className="pd-info-row">
                    <span className="pd-info-ico"><Phone size={12} /></span>
                    <span className="pd-info-k">Phone</span>
                    {userInfo?.phoneNumber ? (
                      <span className="pd-info-v">{userInfo.phoneNumber}</span>
                    ) : (
                      <div className="pd-ph-wrap">
                        <input
                          className={`pd-ph${phoneError ? ' pd-ph--err' : ''}`}
                          type="tel" placeholder="Enter phone number"
                          value={phoneInput}
                          onChange={e => { setPhoneInput(e.target.value); setPhoneError(''); }}
                        />
                        {phoneError && <span className="pd-ph-err">{phoneError}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="pd-box-btns">
                  <button className="pd-btn-ghost" onClick={() => setShowQuote(false)} disabled={submitting}>Cancel</button>
                  <button className="pd-btn-primary" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <><span className="pd-spin" />Sending...</> : <><Send size={13} />Send Request</>}
                  </button>
                </div>
              </div>
            )}

            {showQuote && isLoggedIn && submitted && (
              <div className="pd-success">
                <div className="pd-success-ring"><CheckCircle size={36} /></div>
                <h4>Quote Request Sent!</h4>
                <p>Our team will contact you within 24 hours</p>
              </div>
            )}

          </div>
        </div>
      </div>

      <style jsx>{`
        /* Overlay — above everything */
        .pd-overlay {
          position: fixed; inset: 0; z-index: 99999;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          background: rgba(2,6,23,0.8);
          animation: pdFade .2s ease;
        }
        @keyframes pdFade { from{opacity:0} to{opacity:1} }
        .pd-backdrop-click { position:absolute; inset:0; z-index:0; }

        /* Card — 80% of screen */
        .pd-card {
          position: relative; z-index: 1;
          width: 80vw; max-width: 1100px;
          height: 82vh; max-height: 820px;
          display: grid; grid-template-columns: 320px 1fr;
          background: #fff; border-radius: 24px; overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,.5), 0 8px 24px rgba(0,0,0,.2);
          animation: pdUp .3s cubic-bezier(.34,1.2,.64,1);
        }
        @keyframes pdUp {
          from{opacity:0;transform:translateY(18px) scale(.97)}
          to  {opacity:1;transform:translateY(0)    scale(1)}
        }

        /* Close */
        .pd-x {
          position:absolute; top:14px; right:14px; z-index:20;
          width:34px; height:34px; border-radius:50%;
          background:#fff; border:1px solid #e5e7eb;
          box-shadow:0 2px 6px rgba(0,0,0,.1);
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          color:#6b7280; transition:all .16s;
        }
        .pd-x:hover { background:#fee2e2; color:#dc2626; transform:rotate(90deg); border-color:#fca5a5; }

        /* ══ LEFT ══ */
        .pd-left {
          background: #f8fafc;
          border-right: 1px solid #e9ecef;
          display: flex; flex-direction: column; gap: 14px;
          padding: 24px 20px;
          overflow-y: auto;
        }

        .pd-img-box {
          position:relative; width:100%; aspect-ratio:1;
          border-radius:16px; overflow:hidden; background:#e9ecef; flex-shrink:0;
          box-shadow:0 4px 14px rgba(0,0,0,.1);
        }
        .pd-img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
        .pd-img-box:hover .pd-img { transform:scale(1.04); }
        .pd-img-empty {
          width:100%; height:100%; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:8px; color:#9ca3af; font-size:12px;
        }
        .pd-badge {
          position:absolute; top:10px; left:10px; z-index:2;
          background:linear-gradient(135deg,#EC1940,#F89C1C);
          color:white; padding:4px 10px; border-radius:999px;
          font-size:11px; font-weight:800;
          display:flex; align-items:center; gap:4px;
          box-shadow:0 3px 10px rgba(236,25,64,.4);
        }

        .pd-price-block {
          background:white; border-radius:12px;
          border:1px solid #e9ecef; padding:12px 14px;
        }
        .pd-price-row { display:flex; align-items:baseline; gap:8px; flex-wrap:wrap; }
        .pd-price { font-size:26px; font-weight:800; color:#059669; letter-spacing:-.5px; }
        .pd-strike { font-size:14px; color:#9ca3af; text-decoration:line-through; }
        .pd-save-pill {
          display:inline-flex; align-items:center; gap:5px; margin-top:6px;
          background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0;
          padding:3px 9px; border-radius:8px; font-size:11px; font-weight:700;
        }

        .pd-rating {
          display:flex; align-items:center; gap:4px;
          padding:9px 12px; background:white; border-radius:10px; border:1px solid #e9ecef;
        }
        .pd-rating-n { font-size:13px; font-weight:700; color:#1f2937; }
        .pd-rating-c { font-size:11.5px; color:#9ca3af; }

        /* Highlights — replaces separate trust + stats */
        .pd-highlights {
          background:white; border-radius:12px;
          border:1px solid #e9ecef; padding:12px 14px;
          display:flex; flex-direction:column; gap:10px;
        }
        .pd-hl {
          display:flex; align-items:flex-start; gap:10px;
        }
        .pd-hl svg { color:#EC1940; flex-shrink:0; margin-top:1px; }
        .pd-hl div { display:flex; flex-direction:column; gap:1px; }
        .pd-hl strong { font-size:12px; font-weight:700; color:#1f2937; }
        .pd-hl span   { font-size:11px; color:#9ca3af; }

        /* ══ RIGHT ══ */
        .pd-right {
          padding:32px 36px 28px;
          overflow-y:auto; display:flex; flex-direction:column;
          background:#fff;
        }

        .pd-cat {
          display:inline-flex; align-self:flex-start;
          background:#FFF1F2; color:#E11D48; border:1px solid #FECDD3;
          padding:3px 10px; border-radius:999px;
          font-size:10px; font-weight:700;
          text-transform:uppercase; letter-spacing:.07em; margin-bottom:10px;
        }

        .pd-title {
          font-size:30px; font-weight:800; color:#0d1117;
          line-height:1.2; letter-spacing:-.5px; margin:0 0 14px;
        }

        /* Mobile price — hidden on desktop */
        .pd-price-mobile { display:none; }

        .pd-sep { height:1px; background:#f1f5f9; margin-bottom:16px; }

        .pd-section-lbl {
          font-size:10px; font-weight:700; color:#94a3b8;
          text-transform:uppercase; letter-spacing:.08em; margin-bottom:8px;
        }
        .pd-desc {
          font-size:15px; line-height:1.85; color:#475569;
          margin:0 0 14px; white-space:pre-line;
        }

        /* Perks */
        .pd-perks {
          display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px;
        }
        .pd-perk {
          display:flex; align-items:center; gap:7px;
          padding:8px 12px; background:#f8fafc;
          border:1px solid #e9ecef; border-radius:9px;
          font-size:12.5px; font-weight:600; color:#374151;
        }
        .pd-perk svg { color:#059669; flex-shrink:0; }

        /* CTA */
        .pd-cta { margin-top:auto; }
        .pd-btn-cta {
          width:100%; padding:16px 24px;
          background:linear-gradient(135deg,#EC1940 0%,#F89C1C 100%);
          color:#fff; border:none; border-radius:14px;
          font-size:17px; font-weight:800;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;
          box-shadow:0 8px 24px rgba(236,25,64,.3);
          transition:all .2s; font-family:inherit;
        }
        .pd-btn-cta:hover { transform:translateY(-2px); box-shadow:0 14px 32px rgba(236,25,64,.4); }
        .pd-cta-note { text-align:center; font-size:11.5px; color:#94a3b8; margin:8px 0 0; }

        /* Box */
        .pd-box {
          margin-top:auto; border-radius:16px; padding:18px;
          display:flex; flex-direction:column; gap:12px;
          animation:pdBoxIn .22s ease;
        }
        @keyframes pdBoxIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .pd-box--blue  { background:#F0F9FF; border:1.5px solid #BAE6FD; }
        .pd-box--white { background:#f8fafc; border:1.5px solid #e2e8f0; }

        .pd-box-top { display:flex; gap:12px; align-items:flex-start; }
        .pd-box-ico {
          width:42px; height:42px; border-radius:11px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center; color:white;
        }
        .pd-box-ico--blue { background:linear-gradient(135deg,#0EA5E9,#0284C7); }
        .pd-box-ico--red  { background:linear-gradient(135deg,#EC1940,#F89C1C); }
        .pd-box-top h4 { font-size:14px; font-weight:800; color:#0d1117; margin:0 0 2px; }
        .pd-box-top p  { font-size:12px; color:#64748b; margin:0; }
        .pd-box-top p strong { color:#0d1117; }

        .pd-info-list { background:white; border-radius:10px; border:1px solid #e2e8f0; overflow:hidden; }
        .pd-info-row {
          display:flex; align-items:center; gap:9px;
          padding:9px 12px; border-bottom:1px solid #f8fafc;
        }
        .pd-info-row:last-child { border-bottom:none; }
        .pd-info-ico {
          width:22px; height:22px; border-radius:6px; background:#f1f5f9;
          display:flex; align-items:center; justify-content:center; color:#64748b; flex-shrink:0;
        }
        .pd-info-k {
          font-size:10px; font-weight:700; color:#94a3b8;
          text-transform:uppercase; letter-spacing:.05em; min-width:36px; flex-shrink:0;
        }
        .pd-info-v { font-size:13px; font-weight:600; color:#0d1117; flex:1; word-break:break-all; }

        .pd-ph-wrap { flex:1; display:flex; flex-direction:column; gap:3px; }
        .pd-ph {
          width:100%; padding:5px 9px; border:1.5px solid #e2e8f0; border-radius:7px;
          font-size:13px; font-family:inherit; outline:none; color:#0d1117;
          transition:border-color .15s; box-sizing:border-box;
        }
        .pd-ph:focus { border-color:#EC1940; box-shadow:0 0 0 3px rgba(236,25,64,.08); }
        .pd-ph--err  { border-color:#dc2626 !important; }
        .pd-ph-err   { font-size:11px; color:#dc2626; }

        .pd-box-btns { display:flex; gap:8px; }
        .pd-btn-ghost {
          padding:10px 16px; border-radius:10px;
          border:1.5px solid #e2e8f0; background:white;
          color:#64748b; font-size:13px; font-weight:600;
          cursor:pointer; transition:all .15s; font-family:inherit;
        }
        .pd-btn-ghost:hover { background:#f8fafc; }
        .pd-btn-ghost:disabled { opacity:.5; cursor:not-allowed; }
        .pd-btn-primary {
          flex:1; padding:10px 16px; border-radius:10px;
          background:linear-gradient(135deg,#EC1940,#F89C1C);
          color:white; border:none; font-size:13px; font-weight:700;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px;
          box-shadow:0 4px 12px rgba(236,25,64,.25); transition:all .15s; font-family:inherit;
        }
        .pd-btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(236,25,64,.35); }
        .pd-btn-primary:disabled { opacity:.6; cursor:not-allowed; }

        .pd-spin {
          width:12px; height:12px; border-radius:50%;
          border:2px solid rgba(255,255,255,.3); border-top-color:white;
          animation:pdSpin .55s linear infinite; display:inline-block;
        }
        @keyframes pdSpin { to{transform:rotate(360deg)} }

        .pd-success {
          margin-top:auto; display:flex; flex-direction:column; align-items:center;
          text-align:center; gap:8px; padding:20px;
          background:linear-gradient(135deg,#f0fdf4,#dcfce7);
          border:1.5px solid #86efac; border-radius:16px;
          animation:pdScaleIn .36s cubic-bezier(.34,1.3,.64,1);
        }
        @keyframes pdScaleIn { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
        .pd-success-ring {
          width:64px; height:64px; border-radius:50%;
          background:linear-gradient(135deg,#059669,#10b981);
          display:flex; align-items:center; justify-content:center;
          color:white; box-shadow:0 8px 20px rgba(5,150,105,.3);
        }
        .pd-success h4 { font-size:17px; font-weight:800; color:#0d1117; margin:0; }
        .pd-success p  { font-size:13px; color:#64748b; margin:0; }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 900px) {
          .pd-card {
            width: 94vw;
            grid-template-columns: 260px 1fr;
          }
        }

        @media (max-width: 700px) {
          .pd-card {
            grid-template-columns: 1fr;
            width: 96vw; height: 92vh; max-height: 100%;
            border-radius: 20px; overflow-y: auto;
          }
          .pd-left {
            flex-direction: row; flex-wrap: wrap; gap: 10px;
            padding: 14px; border-right: none; border-bottom: 1px solid #e9ecef;
          }
          .pd-img-box { width:110px; height:110px; aspect-ratio:unset; border-radius:12px; flex-shrink:0; }
          .pd-price-block { flex:1; min-width:150px; }
          .pd-rating, .pd-highlights { flex:1 0 100%; }
          .pd-right { padding:18px 18px 22px; }
          .pd-title { font-size:20px; }
          .pd-perks { grid-template-columns: 1fr; }
        }

        @media (max-width: 540px) {
          .pd-overlay { padding:0; align-items:flex-end; }
          .pd-card {
            width:100%; border-radius:22px 22px 0 0;
            height:94vh; max-height:100%;
          }
          .pd-left { flex-direction:column; padding:0; gap:0; }
          .pd-img-box { width:100%; aspect-ratio:16/7; height:auto; border-radius:0; }
          .pd-price-block, .pd-rating, .pd-highlights { margin:0 14px; }
          .pd-left { padding-bottom:12px; gap:10px; }
          .pd-right { padding:14px 16px 24px; }
          .pd-title { font-size:19px; }
          .pd-price-mobile {
            display:flex; align-items:baseline; gap:8px; flex-wrap:wrap;
            margin-bottom:10px;
          }
          .pd-price-block { display:none; }
          .pd-highlights { display:none; }
          .pd-box-btns { flex-direction:column; }
          .pd-btn-ghost, .pd-btn-primary { width:100%; }
        }
      `}</style>
    </>
  );
};

export default ProductDescription;