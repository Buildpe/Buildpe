import { useState, useEffect, useCallback } from 'react';
import {
  SlidersHorizontal, Plus, Pencil, Trash2, ChevronDown,
  ChevronRight, X, Loader2, RefreshCw, Search, ToggleLeft, ToggleRight,
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Toast, ConfirmDialog, Badge, ActBtn, Loading, Empty, Err } from './shared';
import {
  getAllCategories, getServicesByCategory,
  getServiceSpecs, createSpec, updateSpec, deleteSpec,
  addOption, deleteOption,
} from '../../Services/adminAPI';

// ─── Spec Form Modal ──────────────────────────────────────────
function SpecModal({ title, initial = {}, onSave, onClose, loading }) {
  const [name, setName]               = useState(initial.name || '');
  const [allowMultiple, setAllow]     = useState(initial.allowMultiple || false);
  const [displayOrder, setOrder]      = useState(initial.displayOrder ?? 0);

  return (
    <div className="admin-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal__hdr">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave({ name, allowMultiple, displayOrder }); }}>
          <div className="modal__body">

            <div className="form-group">
              <label className="form-label">Spec Name <span className="form-required">*</span></label>
              <input
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g. Material, Quality, Finish"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input
                className="form-control"
                type="number"
                value={displayOrder}
                onChange={e => setOrder(Number(e.target.value))}
                min={0}
              />
            </div>

            {/* Allow Multiple toggle */}
            <div className="form-group">
              <label className="form-label">Allow Multiple Selection</label>
              <button
                type="button"
                onClick={() => setAllow(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb',
                  background: allowMultiple ? '#f0fdf4' : '#f9fafb',
                  color: allowMultiple ? '#16a34a' : '#6b7280',
                  cursor: 'pointer', fontWeight: 600, fontSize: 13,
                }}
              >
                {allowMultiple
                  ? <><ToggleRight size={20} /> Enabled — customer can pick multiple</>
                  : <><ToggleLeft size={20} /> Disabled — customer picks one only</>
                }
              </button>
            </div>

          </div>
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

// ─── Option Form Modal ────────────────────────────────────────
function OptionModal({ specName, onSave, onClose, loading }) {
  const [label, setLabel]       = useState('');
  const [displayOrder, setOrder] = useState(0);

  return (
    <div className="admin-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div className="modal__hdr">
          <div>
            <h3 className="modal__title">Add Option</h3>
            <p className="modal__sub">To: {specName}</p>
          </div>
          <button className="modal__close" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave({ label, displayOrder }); }}>
          <div className="modal__body">
            <div className="form-group">
              <label className="form-label">Option Label <span className="form-required">*</span></label>
              <input
                className="form-control"
                value={label}
                onChange={e => setLabel(e.target.value)}
                required
                placeholder="e.g. Wood, Steel, Premium, Matte"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input
                className="form-control"
                type="number"
                value={displayOrder}
                onChange={e => setOrder(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
          <div className="modal__ftr">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <Loader2 size={13} className="spin" />}
              {loading ? 'Adding...' : 'Add Option'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Spec Row with expandable options ────────────────────────
function SpecRow({ spec, onEdit, onDelete, onAddOption, onDeleteOption, busy }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden',
      marginBottom: 8, background: 'white',
    }}>
      {/* Spec header row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px', background: '#f9fafb',
        borderBottom: open ? '1px solid #e5e7eb' : 'none',
      }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0, display: 'flex' }}
        >
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827', flex: 1 }}>
          {spec.name}
        </span>

        <Badge
          label={spec.allowMultiple ? 'Multi-select' : 'Single-select'}
          color={spec.allowMultiple ? 'green' : 'gray'}
        />
        <Badge label={`${spec.options?.length || 0} options`} color="blue" />

        <ActBtn
          label="Edit" icon={Pencil}
          bg="#eff6ff" color="#2563eb" border="#bfdbfe"
          onClick={() => onEdit(spec)}
        />
        <ActBtn
          label="Delete" icon={Trash2}
          bg="#fef2f2" color="#dc2626" border="#fecaca"
          onClick={() => onDelete(spec)}
        />
      </div>

      {/* Options panel */}
      {open && (
        <div style={{ padding: '12px 16px' }}>
          {spec.options?.length === 0 && (
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 10 }}>
              No options yet. Add some below.
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {spec.options?.map(opt => (
              <div key={opt.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 20,
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                fontSize: 13, fontWeight: 500, color: '#374151',
              }}>
                {opt.label}
                <button
                  onClick={() => onDeleteOption(opt, spec)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#9ca3af', padding: 0, display: 'flex',
                    lineHeight: 1,
                  }}
                  disabled={busy}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => onAddOption(spec)}
            disabled={busy}
          >
            <Plus size={12} /> Add Option
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Specifications Page ─────────────────────────────────
export default function Specifications() {
  const [services,    setServices]    = useState([]);
  const [selectedSvc, setSelectedSvc] = useState(null); // { id, title, categoryName }
  const [specs,       setSpecs]       = useState([]);
  const [search,      setSearch]      = useState('');
  const [loading,     setLoading]     = useState(false);
  const [svcsLoading, setSvcsLoading] = useState(true);
  const [error,       setError]       = useState(null);
  const [toast,       setToast]       = useState(null);
  const [confirm,     setConfirm]     = useState(null);
  const [specModal,   setSpecModal]   = useState(null); // { mode: 'create'|'edit', spec? }
  const [optModal,    setOptModal]    = useState(null); // spec to add option to
  const [busy,        setBusy]        = useState(false);

  const toast$ = (msg, type = 'success') => setToast({ message: msg, type });

  // ── Load all services (for the service selector) ──────────
  useEffect(() => {
    const loadServices = async () => {
      setSvcsLoading(true);
      try {
        const cats = await getAllCategories();
        const perCat = await Promise.all(
          cats.map(c =>
            getServicesByCategory(c.id)
              .then(svcs => svcs.map(s => ({ ...s, categoryName: c.name })))
              .catch(() => [])
          )
        );
        const all    = perCat.flat();
        const unique = Array.from(new Map(all.map(s => [s.id, s])).values());
        unique.sort((a, b) => a.id - b.id);
        setServices(unique);
      } catch {
        setError('Failed to load services');
      } finally {
        setSvcsLoading(false);
      }
    };
    loadServices();
  }, []);

  // ── Load specs for selected service ───────────────────────
  const loadSpecs = useCallback(async (svc) => {
    if (!svc) return;
    setLoading(true); setError(null);
    try {
      const data = await getServiceSpecs(svc.id);
      setSpecs(data);
    } catch {
      setError('Failed to load specifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectService = (svc) => {
    setSelectedSvc(svc);
    setSpecs([]);
    loadSpecs(svc);
  };

  // ── Spec CRUD ──────────────────────────────────────────────
  const handleSaveSpec = async (form) => {
    setBusy(true);
    try {
      if (specModal.mode === 'create') {
        await createSpec({ serviceId: selectedSvc.id, ...form });
        toast$('Specification created');
      } else {
        await updateSpec(specModal.spec.id, form);
        toast$('Specification updated');
      }
      setSpecModal(null);
      loadSpecs(selectedSvc);
    } catch (e) {
      toast$(e.response?.data?.error || e.message, 'error');
    }
    setBusy(false);
  };

  const handleDeleteSpec = (spec) => setConfirm({
    message: `Delete spec "${spec.name}" and all its options? This cannot be undone.`,
    onConfirm: async () => {
      setBusy(true);
      try {
        await deleteSpec(spec.id);
        toast$('Specification deleted');
        loadSpecs(selectedSvc);
      } catch (e) {
        toast$(e.response?.data?.error || e.message, 'error');
      }
      setBusy(false);
      setConfirm(null);
    },
  });

  // ── Option CRUD ────────────────────────────────────────────
  const handleSaveOption = async (form) => {
    setBusy(true);
    try {
      await addOption(optModal.id, form);
      toast$('Option added');
      setOptModal(null);
      loadSpecs(selectedSvc);
    } catch (e) {
      toast$(e.response?.data?.error || e.message, 'error');
    }
    setBusy(false);
  };

  const handleDeleteOption = (opt, spec) => setConfirm({
    message: `Delete option "${opt.label}" from "${spec.name}"?`,
    onConfirm: async () => {
      setBusy(true);
      try {
        await deleteOption(opt.id);
        toast$('Option deleted');
        loadSpecs(selectedSvc);
      } catch (e) {
        toast$(e.response?.data?.error || e.message, 'error');
      }
      setBusy(false);
      setConfirm(null);
    },
  });

  const filteredServices = services.filter(s =>
    !search.trim() ||
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout activeKey="specifications">

      <div className="page-hdr">
        <div className="page-hdr__left">
          <div className="page-hdr__icon" style={{ background: '#f5f3ff' }}>
            <SlidersHorizontal size={20} color="#7c3aed" />
          </div>
          <div>
            <h2 className="page-hdr__title">Specifications</h2>
            <p className="page-hdr__sub">
              {selectedSvc
                ? `Managing specs for: ${selectedSvc.title}`
                : 'Select a service to manage its specifications'}
            </p>
          </div>
        </div>
        {selectedSvc && (
          <div className="page-hdr__actions">
            <button className="btn btn-ghost" onClick={() => loadSpecs(selectedSvc)}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setSpecModal({ mode: 'create' })}
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
            >
              <Plus size={13} /> Add Specification
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── Left panel: service selector ── */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#374151' }}>
              Select Service
            </p>
          </div>

          <div style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                style={{
                  width: '100%', padding: '7px 9px 7px 30px',
                  border: '1px solid #e5e7eb', borderRadius: 7,
                  fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ maxHeight: 480, overflowY: 'auto' }}>
            {svcsLoading ? (
              <div style={{ padding: 20, textAlign: 'center' }}>
                <Loader2 size={20} className="spin" style={{ color: '#9ca3af' }} />
              </div>
            ) : filteredServices.length === 0 ? (
              <p style={{ padding: 16, fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
                No services found
              </p>
            ) : (
              filteredServices.map(svc => (
                <button
                  key={svc.id}
                  onClick={() => handleSelectService(svc)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '10px 16px',
                    border: 'none', borderBottom: '1px solid #f3f4f6',
                    background: selectedSvc?.id === svc.id ? '#f5f3ff' : 'white',
                    borderLeft: selectedSvc?.id === svc.id ? '3px solid #7c3aed' : '3px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{svc.title}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                    #{svc.id} · {svc.categoryName}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right panel: specs ── */}
        <div>
          {!selectedSvc ? (
            <div className="card">
              <Empty message="Select a service from the left to manage its specifications." />
            </div>
          ) : loading ? (
            <div className="card"><Loading /></div>
          ) : error ? (
            <div className="card"><Err message={error} onRetry={() => loadSpecs(selectedSvc)} /></div>
          ) : specs.length === 0 ? (
            <div className="card">
              <Empty message={`No specifications for "${selectedSvc.title}" yet. Click "Add Specification" to start.`} />
            </div>
          ) : (
            <div>
              {specs.map(spec => (
                <SpecRow
                  key={spec.id}
                  spec={spec}
                  onEdit={(s) => setSpecModal({ mode: 'edit', spec: s })}
                  onDelete={handleDeleteSpec}
                  onAddOption={(s) => setOptModal(s)}
                  onDeleteOption={handleDeleteOption}
                  busy={busy}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {specModal && (
        <SpecModal
          key={specModal.mode + (specModal.spec?.id ?? 'new')}
          title={specModal.mode === 'create' ? 'Add Specification' : 'Edit Specification'}
          initial={specModal.spec || {}}
          onSave={handleSaveSpec}
          onClose={() => setSpecModal(null)}
          loading={busy}
        />
      )}

      {optModal && (
        <OptionModal
          specName={optModal.name}
          onSave={handleSaveOption}
          onClose={() => setOptModal(null)}
          loading={busy}
        />
      )}

      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} loading={busy} />}
      {toast   && <Toast {...toast} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}
