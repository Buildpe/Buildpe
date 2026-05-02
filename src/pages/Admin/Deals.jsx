import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, RefreshCw, Zap, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Toast, ConfirmDialog, Loading, Empty, Err, ActBtn } from './shared';
import { getAllDeals, addDeal, removeDeal, updateDealPosition, getAllServices } from '../../Services/adminAPI';

const DEAL_GROUPS = [
  { key: 'LIVE_SERVICE', label: 'Live Services', icon: Zap,       color: '#2563eb', desc: 'Services shown in the Live Services strip on the homepage' },
  { key: 'TOP_DEAL',     label: 'Top Deals',     icon: TrendingUp, color: '#ea580c', desc: 'Services shown in the Top Deals section on the homepage' },
];

// ─── Deal Group Tab ───────────────────────────────────────────
function DealGroupPanel({ groupKey, desc, deals, services, onAdd, onRemove, onMoveUp, onMoveDown, busy }) {
  const [selectedServiceId, setSelectedServiceId] = useState('');

  // Services not already in this group
  const currentServiceIds = new Set(deals.map(d => String(d.serviceId)));
  const available = services.filter(s => !currentServiceIds.has(String(s.id)));

  const handleAdd = () => {
    if (!selectedServiceId) return;
    onAdd(groupKey, selectedServiceId);
    setSelectedServiceId('');
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>{desc}</p>

      {/* Add service row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <select
          className="form-control"
          value={selectedServiceId}
          onChange={e => setSelectedServiceId(e.target.value)}
          style={{ flex: 1 }}
          disabled={busy}
        >
          <option value="">— Select a service to add —</option>
          {available.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={!selectedServiceId || busy}
          style={{ flexShrink: 0 }}
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Current deals list */}
      {!deals.length ? (
        <Empty message="No services added to this group yet." />
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, index) => (
                  <tr key={deal.dealId}>
                    <td className="td-muted" style={{ width: 70 }}>#{deal.position}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {deal.imgUrl ? (
                          <img
                            src={deal.imgUrl}
                            alt={deal.title}
                            style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--surface-2)', flexShrink: 0 }} />
                        )}
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{deal.title}</span>
                      </div>
                    </td>
                    <td>{deal.price ? `₹${Number(deal.price).toLocaleString('en-IN')}` : 'Get Quote'}</td>
                    <td>{deal.discount && Number(deal.discount) > 0 ? `${deal.discount}%` : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => onMoveUp(deal.dealId, deal.position)}
                          disabled={index === 0 || busy}
                          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 6px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => onMoveDown(deal.dealId, deal.position)}
                          disabled={index === deals.length - 1 || busy}
                          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 6px', cursor: index === deals.length - 1 ? 'not-allowed' : 'pointer', opacity: index === deals.length - 1 ? 0.3 : 1 }}
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <ActBtn
                        label="Remove" icon={Trash2}
                        bg="#fef2f2" color="#dc2626" border="#fecaca"
                        onClick={() => onRemove(deal.dealId, deal.title)}
                        disabled={busy}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Deals Page ──────────────────────────────────────────
export default function Deals() {
  const [deals,    setDeals]    = useState({});
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [activeTab, setActiveTab] = useState('LIVE_SERVICE');
  const [toast,    setToast]    = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [busy,     setBusy]     = useState(false);

  const toast$ = (msg, type = 'success') => setToast({ message: msg, type });

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [dealsData, svcs] = await Promise.all([
        getAllDeals().catch(() => ({})),
        getAllServices().catch(() => []),
      ]);
      setDeals(dealsData);
      setServices(svcs);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (dealName, serviceId) => {
    setBusy(true);
    try {
      await addDeal(dealName, serviceId);
      toast$('Service added to deal group');
      load();
    } catch (e) {
      toast$(e.response?.data?.error || e.message, 'error');
    }
    setBusy(false);
  };

  const handleRemove = (dealId, title) => {
    setConfirm({
      message: `Remove "${title}" from this deal group?`,
      onConfirm: async () => {
        setBusy(true);
        try {
          await removeDeal(dealId);
          toast$('Service removed from deal group');
          load();
        } catch (e) {
          toast$(e.response?.data?.error || e.message, 'error');
        }
        setBusy(false);
        setConfirm(null);
      },
    });
  };

  const handleMoveUp = async (dealId, currentPosition) => {
    if (currentPosition <= 1) return;
    setBusy(true);
    try {
      await updateDealPosition(dealId, currentPosition - 1);
      load();
    } catch (e) {
      toast$(e.response?.data?.error || e.message, 'error');
    }
    setBusy(false);
  };

  const handleMoveDown = async (dealId, currentPosition) => {
    setBusy(true);
    try {
      await updateDealPosition(dealId, currentPosition + 1);
      load();
    } catch (e) {
      toast$(e.response?.data?.error || e.message, 'error');
    }
    setBusy(false);
  };

  const activeGroup = DEAL_GROUPS.find(g => g.key === activeTab);

  return (
    <AdminLayout activeKey="deals">
      {/* Header */}
      <div className="page-hdr">
        <div className="page-hdr__left">
          <div className="page-hdr__icon" style={{ background: '#eff6ff' }}>
            <Zap size={20} color="#2563eb" />
          </div>
          <div>
            <h2 className="page-hdr__title">Deals Manager</h2>
            <p className="page-hdr__sub">Control which services appear in each deal section</p>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={load} disabled={loading}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid var(--border)' }}>
        {DEAL_GROUPS.map(group => (
          <button
            key={group.key}
            onClick={() => setActiveTab(group.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 22px',
              background: 'none', border: 'none',
              borderBottom: activeTab === group.key ? `2px solid ${group.color}` : '2px solid transparent',
              marginBottom: -2,
              color: activeTab === group.key ? group.color : 'var(--text-3)',
              fontWeight: activeTab === group.key ? 700 : 500,
              fontSize: 14, cursor: 'pointer',
              fontFamily: 'var(--font)',
              transition: 'all 0.15s',
            }}
          >
            <group.icon size={15} />
            {group.label}
            <span style={{
              background: activeTab === group.key ? `${group.color}18` : 'var(--surface-2)',
              color: activeTab === group.key ? group.color : 'var(--text-4)',
              borderRadius: 999, padding: '1px 8px', fontSize: 11, fontWeight: 700,
            }}>
              {deals[group.key]?.length ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? <Loading /> : error ? <Err message={error} onRetry={load} /> : (
        <DealGroupPanel
          key={activeTab}
          groupKey={activeTab}
          label={activeGroup.label}
          desc={activeGroup.desc}
          color={activeGroup.color}
          deals={deals[activeTab] || []}
          services={services}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          busy={busy}
        />
      )}

      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} loading={busy} />}
      {toast   && <Toast {...toast} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}
