import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, AlertTriangle, Loader2, SearchX } from 'lucide-react';

// ─── Toast ────────────────────────────────────────────────────
// Uses .admin-toast class (not .toast) so it doesn't clash with
// any existing toast styles on the public site
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`admin-toast admin-toast--${type}`}>
      {type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
      <span style={{ flex: 1 }}>{message}</span>
      <button className="admin-toast__close" onClick={onClose}><X size={13} /></button>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────
export function ConfirmDialog({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="admin-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="dialog">
        <div className="dialog__icon"><AlertTriangle size={26} /></div>
        <h3 className="dialog__title">Are you sure?</h3>
        <p className="dialog__msg">{message}</p>
        <div className="dialog__actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 size={13} className="spin" /> : null}
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────
export function Modal({ title, subtitle, fields, initial = {}, onSave, onClose, loading, wide }) {
  const [form, setForm] = useState(initial);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="admin-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal${wide ? ' modal--wide' : ''}`}>
        <div className="modal__hdr">
          <div>
            <h3 className="modal__title">{title}</h3>
            {subtitle && <p className="modal__sub">{subtitle}</p>}
          </div>
          <button className="modal__close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div className="modal__body">
            {fields.map(field => (
              <div key={field.key} className="form-group">
                <label className="form-label">
                  {field.label}{field.required && <span className="form-required"> *</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    className="form-control"
                    value={form[field.key] ?? ''}
                    onChange={e => set(field.key, e.target.value)}
                    required={field.required}
                  >
                    <option value="">— Select {field.label} —</option>
                    {field.options?.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    className="form-control form-control--textarea"
                    value={form[field.key] ?? ''}
                    onChange={e => set(field.key, e.target.value)}
                    required={field.required}
                    placeholder={field.placeholder ?? ''}
                    rows={3}
                  />
                ) : (
                  <input
                    className="form-control"
                    type={field.type ?? 'text'}
                    value={form[field.key] ?? ''}
                    onChange={e => set(field.key, e.target.value)}
                    required={field.required}
                    placeholder={field.placeholder ?? ''}
                  />
                )}
              </div>
            ))}
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

// ─── Badge ────────────────────────────────────────────────────
export function Badge({ label, color = 'gray' }) {
  return <span className={`badge badge-${color}`}>{label}</span>;
}

// ─── Action Button (table rows) ───────────────────────────────
export function ActBtn({ label, icon: Icon, bg, color, border, onClick, disabled }) {
  return (
    <button
      className="act-btn"
      onClick={onClick}
      disabled={disabled}
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      {Icon && <Icon size={11} />}
      {label}
    </button>
  );
}

// ─── States ──────────────────────────────────────────────────
export function Loading() {
  return (
    <div className="state-box">
      <Loader2 size={30} className="spin" />
      <p>Loading...</p>
    </div>
  );
}

export function Empty({ message = 'No data found.' }) {
  return (
    <div className="state-box">
      <SearchX size={36} />
      <p>{message}</p>
    </div>
  );
}

export function Err({ message, onRetry }) {
  return (
    <div className="state-box state-box--error">
      <XCircle size={36} />
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-ghost" style={{ marginTop: 4 }} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
