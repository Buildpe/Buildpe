import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../Services/Api';
import { Search, RefreshCw, CheckCircle, XCircle, Flag, Trash2, Eye, X, Loader2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Toast, ConfirmDialog } from './shared';

const API = {
  getAll:   (status, page, size) => apiClient.get(`/api/admin/listings?${new URLSearchParams({ ...(status ? { status } : {}), page, size })}`),
  getCounts:()                   => apiClient.get('/api/admin/listings/counts'),
  setStatus:(id, status, reason) => apiClient.put(`/api/admin/listings/${id}/status`, { status, reason }),
  delete:   (id)                 => apiClient.delete(`/api/admin/listings/${id}`),
};


const STATUS_COLORS = {
  PENDING:  { bg: '#FEF9C3', text: '#92400E', label: 'Pending'  },
  ACTIVE:   { bg: '#DCFCE7', text: '#166534', label: 'Active'   },
  REJECTED: { bg: '#FEE2E2', text: '#991B1B', label: 'Rejected' },
  FLAGGED:  { bg: '#FEF3C7', text: '#92400E', label: 'Flagged'  },
  DELETED:  { bg: '#F3F4F6', text: '#6B7280', label: 'Deleted'  },
  EXPIRED:  { bg: '#F3F4F6', text: '#6B7280', label: 'Expired'  },
};

const STATUSES = ['', 'PENDING', 'ACTIVE', 'REJECTED', 'FLAGGED', 'DELETED', 'EXPIRED'];

const fmt = (n) => {
  if (!n) return '—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

// ── Reject reason modal ────────────────────────────────────────
function RejectModal({ listing, onConfirm, onClose, loading }) {
  const [reason, setReason] = useState('');
  return (
    <div className="admin-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 460 }}>
        <div className="modal__hdr">
          <div><h3 className="modal__title">Reject Listing</h3><p className="modal__sub">"{listing.title}"</p></div>
          <button className="modal__close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal__body">
          <div className="form-group">
            <label className="form-label">Reason for rejection (shown to seller)</label>
            <textarea
              className="form-control form-control--textarea"
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Incomplete information, suspicious listing..."
            />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => onConfirm(reason)} disabled={loading}>
            {loading ? <Loader2 size={13} className="spin" /> : <XCircle size={13} />}
            {loading ? 'Rejecting...' : 'Reject Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View detail drawer ─────────────────────────────────────────
function DetailDrawer({ listing, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  if (!listing) return null;
  const imgs = listing.imgUrls || [];
  const s = STATUS_COLORS[listing.status] || STATUS_COLORS.PENDING;
  return (
    <div className="admin-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--wide" style={{ maxWidth: 640, maxHeight: '88vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="modal__hdr" style={{ flexShrink: 0 }}>
          <div>
            <h3 className="modal__title" style={{ fontSize: 16 }}>{listing.title}</h3>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.text }}>{s.label}</span>
          </div>
          <button className="modal__close" onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* Images */}
          {imgs.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <img src={imgs[activeImg]} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, display: 'block', marginBottom: 8 }} />
              {imgs.length > 1 && (
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                  {imgs.map((u, i) => (
                    <img key={i} src={u} alt="" onClick={() => setActiveImg(i)} style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: activeImg === i ? '2px solid #EC1940' : '2px solid transparent', opacity: activeImg === i ? 1 : 0.6 }} />
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Fields */}
          {[
            ['Price',       fmt(listing.price)],
            ['Category',    listing.category],
            ['Area',        listing.areaSqft ? `${listing.areaSqft} sqft` : null],
            ['BHK',         listing.bhkCount ? `${listing.bhkCount} BHK` : null],
            ['Facing',      listing.facing],
            ['Road Width',  listing.roadWidthFt ? `${listing.roadWidthFt} ft` : null],
            ['Approval',    listing.approvalType],
            ['Seller Type', listing.sellerType],
            ['City',        listing.city],
            ['Locality',    listing.locality],
            ['Address',     listing.address],
            ['Lat / Lng',   listing.latitude ? `${listing.latitude}, ${listing.longitude}` : null],
            ['User ID',     listing.userId],
            ['Listed',      listing.createdAt ? new Date(listing.createdAt).toLocaleString('en-IN') : null],
            ['Rejection',   listing.rejectionReason],
          ].filter(r => r[1]).map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
              <span style={{ color: '#9ca3af', fontWeight: 500 }}>{label}</span>
              <span style={{ color: '#111827', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{String(value)}</span>
            </div>
          ))}
          {listing.description && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, marginBottom: 6 }}>DESCRIPTION</div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0 }}>{listing.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function AdminListings() {
  const [listings,  setListings]  = useState([]);
  const [counts,    setCounts]    = useState({});
  const [loading,   setLoading]   = useState(true);
  const [actLoading,setActLoading]= useState(false);
  const [page,      setPage]      = useState(0);
  const [totalPages,setTotalPages]= useState(1);
  const [filter,    setFilter]    = useState('PENDING'); // default to pending queue
  const [search,    setSearch]    = useState('');
  const [toast,     setToast]     = useState(null);
  const [confirm,   setConfirm]   = useState(null);
  const [rejectFor, setRejectFor] = useState(null);
  const [detail,    setDetail]    = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // ── Fetch listings ─────────────────────────────────────────
  const fetchAll = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const res  = await API.getAll(filter, p, 20);
      const data = res.data;
      setListings(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch { showToast('Failed to load listings', 'error'); }
    finally  { setLoading(false); }
  }, [filter]);

  const fetchCounts = useCallback(async () => {
    try {
      const res  = await API.getCounts();
      const data = res.data;
      // data.byStatus is the map
      setCounts(data.byStatus || data);
    } catch (_e) { /* counts fetch is non-critical */ }
  }, []);

  useEffect(() => { fetchAll(0); fetchCounts(); }, [fetchAll, fetchCounts]);

  // ── Actions ────────────────────────────────────────────────
  const doStatus = async (id, status, reason = '') => {
    setActLoading(true);
    try {
      await API.setStatus(id, status, reason);
      showToast(`Listing ${status.toLowerCase()} successfully`);
      setRejectFor(null);
      fetchAll(page);
      fetchCounts();
    } catch { showToast('Action failed', 'error'); }
    finally  { setActLoading(false); }
  };

  const doDelete = async (id) => {
    setActLoading(true);
    try {
      await API.delete(id);
      showToast('Listing deleted');
      setConfirm(null);
      fetchAll(page);
      fetchCounts();
    } catch { showToast('Delete failed', 'error'); }
    finally  { setActLoading(false); }
  };

  // ── Client search filter ───────────────────────────────────
  const filtered = search.trim()
    ? listings.filter(l =>
        l.title?.toLowerCase().includes(search.toLowerCase()) ||
        l.city?.toLowerCase().includes(search.toLowerCase()) ||
        l.locality?.toLowerCase().includes(search.toLowerCase())
      )
    : listings;

  const s = (key) => STATUS_COLORS[key] || STATUS_COLORS.PENDING;

  return (
    <AdminLayout activeKey="listings">
      {toast     && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm   && <ConfirmDialog {...confirm} loading={actLoading} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {rejectFor && <RejectModal listing={rejectFor} loading={actLoading} onConfirm={r => doStatus(rejectFor.id, 'REJECTED', r)} onClose={() => setRejectFor(null)} />}
      {detail    && <DetailDrawer listing={detail} onClose={() => setDetail(null)} />}

      {/* ── Status count cards ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10, marginBottom: 20 }}>
        {['PENDING','ACTIVE','REJECTED','FLAGGED'].map(k => (
          <div
            key={k}
            onClick={() => setFilter(k)}
            style={{ background: filter === k ? s(k).bg : 'var(--surface)', border: `1.5px solid ${filter === k ? s(k).text + '40' : 'var(--border)'}`, borderRadius: 'var(--r-md)', padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s' }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: s(k).text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginTop: 2 }}>{counts[k] ?? '—'}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        {/* Status filter */}
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto', fontSize: 13 }}
        >
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 12px' }}>
          <Search size={14} color="var(--text-4)" />
          <input
            className="form-control"
            style={{ border: 'none', padding: 0, fontSize: 13, flex: 1 }}
            placeholder="Search by title, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <button className="btn btn-ghost" onClick={() => { fetchAll(0); fetchCounts(); }} title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Listed</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-4)' }}>
                <Loader2 size={22} className="spin" style={{ margin: '0 auto' }} />
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-4)' }}>
                No listings found.
              </td></tr>
            ) : filtered.map(l => {
              const sc = STATUS_COLORS[l.status] || STATUS_COLORS.PENDING;
              return (
                <tr key={l.id}>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'capitalize' }}>{l.category || '—'}{l.areaSqft ? ` · ${l.areaSqft} sqft` : ''}</div>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>{fmt(l.price)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{[l.locality, l.city].filter(Boolean).join(', ') || '—'}</td>
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: sc.bg, color: sc.text }}>{sc.label}</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>
                    {l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {/* View */}
                      <button className="act-btn" title="View details" onClick={() => setDetail(l)}>
                        <Eye size={13} />
                      </button>
                      {/* Approve */}
                      {(l.status === 'PENDING' || l.status === 'FLAGGED' || l.status === 'REJECTED') && (
                        <button className="act-btn act-btn--green" title="Approve" onClick={() => doStatus(l.id, 'ACTIVE')}>
                          <CheckCircle size={13} />
                        </button>
                      )}
                      {/* Reject */}
                      {(l.status === 'PENDING' || l.status === 'ACTIVE' || l.status === 'FLAGGED') && (
                        <button className="act-btn act-btn--red" title="Reject" onClick={() => setRejectFor(l)}>
                          <XCircle size={13} />
                        </button>
                      )}
                      {/* Flag */}
                      {l.status === 'ACTIVE' && (
                        <button className="act-btn act-btn--amber" title="Flag for review" onClick={() => doStatus(l.id, 'FLAGGED')}>
                          <Flag size={13} />
                        </button>
                      )}
                      {/* Delete */}
                      {l.status !== 'DELETED' && (
                        <button
                          className="act-btn act-btn--red"
                          title="Delete"
                          onClick={() => setConfirm({ message: `Delete "${l.title}"? This is a soft delete.`, onConfirm: () => doDelete(l.id) })}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ──────────────────────────────────────── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button className="btn btn-ghost" disabled={page === 0} onClick={() => fetchAll(page - 1)}>← Prev</button>
          <span style={{ padding: '8px 14px', fontSize: 13, color: 'var(--text-3)' }}>Page {page + 1} / {totalPages}</span>
          <button className="btn btn-ghost" disabled={page >= totalPages - 1} onClick={() => fetchAll(page + 1)}>Next →</button>
        </div>
      )}
    </AdminLayout>
  );
}
