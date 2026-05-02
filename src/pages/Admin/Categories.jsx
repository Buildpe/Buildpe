import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, X, RefreshCw, Tag } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Toast, ConfirmDialog, Modal, ActBtn, Loading, Empty, Err } from './shared';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../Services/adminAPI';

// ⚠️ Category entity has only: id, name
// There is NO description field — do not add it to the form

export default function Categories() {
  const [cats,     setCats]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState(null);
  const [modal,    setModal]    = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [busy,     setBusy]     = useState(false);

  const toast$ = (msg, type = 'success') => setToast({ message: msg, type });

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // GET /api/public/categories
      // Response: [{ id, name, services: [...] }]
      const data = await getAllCategories();
      setCats(data);
      setFiltered(data);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(cats); return; }
    const q = search.toLowerCase();
    setFiltered(cats.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      String(c.id).includes(q)
    ));
  }, [search, cats]);

  // Category form has only ONE field: name
  const CAT_FIELDS = [
    { key: 'name', label: 'Category Name', required: true, placeholder: 'e.g. Home Services' },
  ];

  // POST /api/admin/categories  body: { "name": "..." }
  const handleCreate = () => setModal({
    title: 'Create New Category',
    fields: CAT_FIELDS,
    initial: {},
    onSave: async (form) => {
      if (!form.name?.trim()) return;
      setBusy(true);
      try {
        await createCategory(form.name.trim());
        toast$('Category created successfully');
        load(); setModal(null);
      } catch (e) { toast$(e.response?.data?.error || e.message, 'error'); }
      setBusy(false);
    },
  });

  // PUT /api/admin/categories/{id}  body: { "name": "..." }
  const handleEdit = (cat) => setModal({
    title: 'Edit Category',
    subtitle: `ID #${cat.id}`,
    fields: CAT_FIELDS,
    initial: { name: cat.name },
    onSave: async (form) => {
      if (!form.name?.trim()) return;
      setBusy(true);
      try {
        await updateCategory(cat.id, form.name.trim());
        toast$('Category updated successfully');
        load(); setModal(null);
      } catch (e) { toast$(e.response?.data?.error || e.message, 'error'); }
      setBusy(false);
    },
  });

  // DELETE /api/admin/categories/{id}  — 204 No Content or 409 if has services
  const handleDelete = (cat) => setConfirm({
    message: `Delete category "${cat.name}"? This will fail if it has services — remove services first.`,
    onConfirm: async () => {
      setBusy(true);
      try {
        await deleteCategory(cat.id);
        toast$('Category deleted');
        load();
      } catch (e) {
        // 409 Conflict if category still has services
        toast$(e.response?.data?.error || e.message, 'error');
      }
      setBusy(false); setConfirm(null);
    },
  });

  return (
    <AdminLayout activeKey="categories">
      <div className="page-hdr">
        <div className="page-hdr__left">
          <div className="page-hdr__icon" style={{ background: '#fef2f2' }}>
            <Tag size={20} color="#EC1940" />
          </div>
          <div>
            <h2 className="page-hdr__title">Categories</h2>
            <p className="page-hdr__sub">{cats.length} total</p>
          </div>
        </div>
        <div className="page-hdr__actions">
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={13} /> Refresh</button>
          <button className="btn btn-primary" onClick={handleCreate}><Plus size={13} /> New Category</button>
        </div>
      </div>

      <div className="card">
        <div className="search-row">
          <Search size={15} className="search-row__icon" />
          <input
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-row__clear" onClick={() => setSearch('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {loading ? <Loading /> :
         error   ? <Err message={error} onRetry={load} /> :
         !filtered.length ? <Empty message={search ? `No results for "${search}"` : 'No categories yet.'} /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Services Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(cat => (
                  <tr key={cat.id}>
                    <td className="td-id">#{cat.id}</td>
                    <td className="td-bold">{cat.name}</td>
                    {/* services array comes back with categories — show count */}
                    <td className="td-muted">
                      {cat.services?.length ?? '—'} service{cat.services?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="td-actions">
                      <ActBtn
                        label="Edit" icon={Pencil}
                        bg="#eff6ff" color="#2563eb" border="#bfdbfe"
                        onClick={() => handleEdit(cat)}
                      />
                      <ActBtn
                        label="Delete" icon={Trash2}
                        bg="#fef2f2" color="#dc2626" border="#fecaca"
                        onClick={() => handleDelete(cat)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal   && <Modal key={modal.title + JSON.stringify(modal.initial)} {...modal} onClose={() => setModal(null)} loading={busy} />}
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} loading={busy} />}
      {toast   && <Toast {...toast} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}
