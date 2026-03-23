import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, X, RefreshCw, Wrench, Loader2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Toast, ConfirmDialog, Badge, ActBtn, Loading, Empty, Err } from './shared';
import ImageUpload from './shared/ImageUpload';
import {
  getAllCategories, getServicesByCategory,
  createService, updateService, deleteService,
} from '../../Services/adminAPI';

// ─── Service Form Modal ───────────────────────────────────────
// Custom modal so we can embed ImageUpload alongside normal fields
function ServiceModal({ title, subtitle, initial = {}, cats, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div
      className="admin-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: 520 }}>
        {/* Header */}
        <div className="modal__hdr">
          <div>
            <h3 className="modal__title">{title}</h3>
            {subtitle && <p className="modal__sub">{subtitle}</p>}
          </div>
          <button className="modal__close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div className="modal__body">

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title <span className="form-required">*</span></label>
              <input
                className="form-control"
                type="text"
                value={form.title || ''}
                onChange={e => set('title', e.target.value)}
                required
                placeholder="e.g. AC Repair"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description <span className="form-required">*</span></label>
              <textarea
                className="form-control form-control--textarea"
                value={form.description || ''}
                onChange={e => set('description', e.target.value)}
                required
                placeholder="Describe the service..."
                rows={3}
              />
            </div>

            {/* Price + Discount side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Price (₹) <span className="form-required">*</span></label>
                <input
                  className="form-control"
                  type="number"
                  value={form.price || ''}
                  onChange={e => set('price', e.target.value)}
                  required
                  placeholder="500"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Discount (%)</label>
                <input
                  className="form-control"
                  type="number"
                  value={form.discount ?? '0'}
                  onChange={e => set('discount', e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category <span className="form-required">*</span></label>
              <select
                className="form-control"
                value={form.categoryId || ''}
                onChange={e => set('categoryId', e.target.value)}
                required
              >
                <option value="">— Select Category —</option>
                {cats.map(c => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Service Image</label>
              <ImageUpload
                value={form.imgUrl || ''}
                onChange={url => set('imgUrl', url)}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="modal__ftr">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <Loader2 size={13} className="spin" />}
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Services Page ───────────────────────────────────────
export default function Services() {
  const [services,  setServices]  = useState([]);
  const [cats,      setCats]      = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [toast,     setToast]     = useState(null);
  const [modal,     setModal]     = useState(null); // { mode: 'create'|'edit', svc? }
  const [confirm,   setConfirm]   = useState(null);
  const [busy,      setBusy]      = useState(false);

  const toast$ = (msg, type = 'success') => setToast({ message: msg, type });

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const catData = await getAllCategories();
      setCats(catData);

      const perCat = await Promise.all(
        catData.map(c =>
          getServicesByCategory(c.id)
            .then(svcs => svcs.map(s => ({ ...s, categoryId: c.id, categoryName: c.name })))
            .catch(() => [])
        )
      );

      const all    = perCat.flat();
      const unique = Array.from(new Map(all.map(s => [s.id, s])).values());
      unique.sort((a, b) => a.id - b.id);
      setServices(unique);
      setFiltered(unique);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let result = services;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        String(s.id).includes(q)
      );
    }
    if (catFilter) {
      result = result.filter(s => String(s.categoryId) === catFilter);
    }
    setFiltered(result);
  }, [search, catFilter, services]);

  // ── Save handler — used by both create and edit ────────────
  const handleSave = async (form) => {
    setBusy(true);
    try {
      const payload = {
        title:      form.title,
        description: form.description,
        price:      form.price,
        discount:   form.discount,
        imgUrl:     form.imgUrl || '',
        categoryId: form.categoryId,
      };

      if (modal.mode === 'create') {
        await createService(payload);
        toast$('Service created successfully');
      } else {
        await updateService(modal.svc.id, payload);
        toast$('Service updated successfully');
      }
      load();
      setModal(null);
    } catch (e) {
      toast$(e.response?.data?.error || e.message, 'error');
    }
    setBusy(false);
  };

  const handleDelete = (svc) => setConfirm({
    message: `Delete service "${svc.title}"? This cannot be undone.`,
    onConfirm: async () => {
      setBusy(true);
      try {
        await deleteService(svc.id);
        toast$('Service deleted');
        load();
      } catch (e) {
        toast$(e.response?.data?.error || e.message, 'error');
      }
      setBusy(false);
      setConfirm(null);
    },
  });

  // ── Modal initial data ─────────────────────────────────────
  const getInitial = (svc) => ({
    title:      svc?.title       || '',
    description: svc?.description || '',
    price:      String(svc?.price    ?? ''),
    discount:   String(svc?.discount ?? '0'),
    imgUrl:     svc?.imgUrl      || '',
    categoryId: String(svc?.categoryId ?? ''),
  });

  return (
    <AdminLayout activeKey="services">
      <div className="page-hdr">
        <div className="page-hdr__left">
          <div className="page-hdr__icon" style={{ background: '#fff7ed' }}>
            <Wrench size={20} color="#ea580c" />
          </div>
          <div>
            <h2 className="page-hdr__title">Services</h2>
            <p className="page-hdr__sub">{services.length} total</p>
          </div>
        </div>
        <div className="page-hdr__actions">
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={13} /> Refresh</button>
          <button className="btn btn-primary" onClick={() => setModal({ mode: 'create' })}>
            <Plus size={13} /> New Service
          </button>
        </div>
      </div>

      <div className="card">
        <div className="search-row">
          <Search size={15} className="search-row__icon" />
          <input
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-row__clear" onClick={() => setSearch('')}>
              <X size={13} />
            </button>
          )}
          {cats.length > 0 && (
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              <option value="">All Categories</option>
              {cats.map(c => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {loading ? <Loading /> :
         error   ? <Err message={error} onRetry={load} /> :
         !filtered.length ? <Empty message={search ? `No results for "${search}"` : 'No services yet.'} /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td className="td-id">#{s.id}</td>
                    <td style={{ padding: '8px 15px' }}>
                      {s.imgUrl ? (
                        <img
                          src={s.imgUrl}
                          alt={s.title}
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #E5E7EB' }}
                        />
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: 6, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Wrench size={14} color="#9CA3AF" />
                        </div>
                      )}
                    </td>
                    <td className="td-bold">{s.title}</td>
                    <td>₹{Number(s.price).toLocaleString('en-IN')}</td>
                    <td>
                      {s.discount && Number(s.discount) > 0
                        ? <Badge label={`${s.discount}% off`} color="green" />
                        : <span className="td-muted">—</span>
                      }
                    </td>
                    <td><Badge label={s.categoryName || '—'} color="gray" /></td>
                    <td className="td-actions">
                      <ActBtn
                        label="Edit" icon={Pencil}
                        bg="#eff6ff" color="#2563eb" border="#bfdbfe"
                        onClick={() => setModal({ mode: 'edit', svc: s })}
                      />
                      <ActBtn
                        label="Delete" icon={Trash2}
                        bg="#fef2f2" color="#dc2626" border="#fecaca"
                        onClick={() => handleDelete(s)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Service Modal */}
      {modal && (
        <ServiceModal
          key={modal.mode + (modal.svc?.id ?? 'new')}
          title={modal.mode === 'create' ? 'Create New Service' : 'Edit Service'}
          subtitle={modal.mode === 'edit' ? `ID #${modal.svc.id}` : undefined}
          initial={getInitial(modal.svc)}
          cats={cats}
          onSave={handleSave}
          onClose={() => setModal(null)}
          loading={busy}
        />
      )}

      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} loading={busy} />}
      {toast   && <Toast {...toast} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}