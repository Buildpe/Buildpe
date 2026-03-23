import { useState, useEffect, useCallback } from 'react';
import { Plus, Lock, Unlock, Shield, History, Trash2, Search, X, RefreshCw, Users as UsersIcon } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Toast, ConfirmDialog, Modal, Badge, ActBtn, Loading, Empty, Err } from './shared/index';
import {
  getAllUsers, lockUser, unlockUser,
  changeUserRole, updateUserStatus,
  getUserLoginHistory, deleteUser, registerNewUser,
} from '../../Services/adminAPI';

// ─── Colors for action buttons ────────────────────────────────
const A = {
  lock:    { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  unlock:  { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  role:    { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  history: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  delete:  { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

// ─── Login History Modal ──────────────────────────────────────
// Fields from AdminService.getUserLoginHistory():
//   id, loginTime, loginStatus ("SUCCESS"/"FAILED"/"BLOCKED"),
//   ipAddress, userAgent, failureReason
function LoginHistoryModal({ user, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getUserLoginHistory(user.id)
      .then(data => setHistory(data))
      .catch(e  => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--wide">
        <div className="modal__hdr">
          <div>
            <h3 className="modal__title">Login History</h3>
            <p className="modal__sub">{user.email}</p>
          </div>
          <button className="modal__close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal__body">
          {loading  ? <Loading /> :
           error    ? <Err message={error} /> :
           !history.length ? <Empty message="No login history found." /> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Time</th>
                    <th>IP Address</th>
                    <th>Failure Reason</th>
                    <th>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id}>
                      <td>
                        {/* field: loginStatus — "SUCCESS", "FAILED", "BLOCKED" */}
                        <Badge
                          label={h.loginStatus}
                          color={h.loginStatus === 'SUCCESS' ? 'green' : h.loginStatus === 'BLOCKED' ? 'orange' : 'red'}
                        />
                      </td>
                      {/* field: loginTime (LocalDateTime) */}
                      <td className="td-muted">{h.loginTime ? new Date(h.loginTime).toLocaleString() : '—'}</td>
                      <td>{h.ipAddress || '—'}</td>
                      {/* field: failureReason */}
                      <td className="td-muted">{h.failureReason || '—'}</td>
                      <td style={{ maxWidth: 200 }} className="td-muted">{h.userAgent || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Users Page ──────────────────────────────────────────
export default function Users() {
  const [users,    setUsers]    = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState(null);
  const [modal,    setModal]    = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [histUser, setHistUser] = useState(null);
  const [busy,     setBusy]     = useState(false);

  const toast$ = (msg, type = 'success') => setToast({ message: msg, type });

  // ── Load ──────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // Response fields: id, email, phoneNumber, firstName, lastName,
      // role (string), enabled (Boolean), accountLocked (Boolean),
      // failedLoginAttempts, authProvider, lastLogin, createdAt
      const data = await getAllUsers();
      setUsers(data);
      setFiltered(data);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Search filter ─────────────────────────────────────────────
  useEffect(() => {
    if (!search.trim()) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.email?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      String(u.id).includes(q)
    ));
  }, [search, users]);

  // ── Handlers ──────────────────────────────────────────────────

  // Lock — PUT /api/admin/users/{id}/lock  (no body)
  const handleLock = u => setConfirm({
    message: `Lock account for "${u.email}"? They won't be able to log in.`,
    onConfirm: async () => {
      setBusy(true);
      try {
        await lockUser(u.id);
        toast$('Account locked successfully');
        load();
      } catch (e) { toast$(e.response?.data?.error || e.message, 'error'); }
      setBusy(false); setConfirm(null);
    },
  });

  // Unlock — PUT /api/admin/users/{id}/unlock  (no body)
  const handleUnlock = u => setConfirm({
    message: `Unlock account for "${u.email}"?`,
    onConfirm: async () => {
      setBusy(true);
      try {
        await unlockUser(u.id);
        toast$('Account unlocked successfully');
        load();
      } catch (e) { toast$(e.response?.data?.error || e.message, 'error'); }
      setBusy(false); setConfirm(null);
    },
  });

  // Delete (soft) — DELETE /api/admin/users/{id}
  const handleDelete = u => setConfirm({
    message: `Disable "${u.email}"? (Soft delete — account will be disabled, not removed)`,
    onConfirm: async () => {
      setBusy(true);
      try {
        await deleteUser(u.id);
        toast$('User disabled (soft deleted)');
        load();
      } catch (e) { toast$(e.response?.data?.error || e.message, 'error'); }
      setBusy(false); setConfirm(null);
    },
  });

  // Change role — PUT /api/admin/users/{id}/role  body: { roleName }
  const handleRole = u => setModal({
    title: 'Change Role',
    subtitle: u.email,
    fields: [
      {
        key: 'roleName', label: 'New Role', type: 'select', required: true,
        options: [{ value: 'USER', label: 'User' }, { value: 'ADMIN', label: 'Admin' }],
      },
    ],
    // ⚠️ field key must be "roleName" to match body key sent to API
    initial: { roleName: u.role === 'ADMIN' ? 'ADMIN' : 'USER' },
    onSave: async (form) => {
      setBusy(true);
      try {
        // changeUserRole(id, roleName) sends { roleName } in body
        await changeUserRole(u.id, form.roleName);
        toast$('Role updated successfully');
        load(); setModal(null);
      } catch (e) { toast$(e.response?.data?.error || e.message, 'error'); }
      setBusy(false);
    },
  });

  // Toggle status — PUT /api/admin/users/{id}/status  body: { enabled: Boolean }
  // ⚠️ NOT a toggle — we must send explicit value based on current state
  const handleStatusToggle = async (u) => {
    const newEnabled = !u.enabled;
    try {
      await updateUserStatus(u.id, newEnabled);
      toast$(`User ${newEnabled ? 'enabled' : 'disabled'} successfully`);
      load();
    } catch (e) { toast$(e.response?.data?.error || e.message, 'error'); }
  };

  // Create user — POST /api/auth/register
  const handleCreate = () => setModal({
    title: 'Create New User',
    fields: [
      { key: 'firstName',   label: 'First Name',   required: true },
      { key: 'lastName',    label: 'Last Name',    required: true },
      { key: 'email',       label: 'Email',        type: 'email',    required: true },
      { key: 'password',    label: 'Password',     type: 'password', required: true },
      { key: 'phoneNumber', label: 'Phone Number', placeholder: '10-15 digits' },
    ],
    initial: {},
    onSave: async (form) => {
      setBusy(true);
      try {
        await registerNewUser(form);
        toast$('User created successfully');
        load(); setModal(null);
      } catch (e) { toast$(e.response?.data?.error || e.message, 'error'); }
      setBusy(false);
    },
  });

  return (
    <AdminLayout activeKey="users">
      {/* Header */}
      <div className="page-hdr">
        <div className="page-hdr__left">
          <div className="page-hdr__icon" style={{ background: '#eff6ff' }}>
            <UsersIcon size={20} color="#2563eb" />
          </div>
          <div>
            <h2 className="page-hdr__title">Users</h2>
            <p className="page-hdr__sub">{users.length} total</p>
          </div>
        </div>
        <div className="page-hdr__actions">
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={13} /> Refresh</button>
          <button className="btn btn-primary" onClick={handleCreate}><Plus size={13} /> Create User</button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="search-row">
          <Search size={15} className="search-row__icon" />
          <input
            placeholder="Search by name, email, ID..."
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
         !filtered.length ? <Empty message={search ? `No results for "${search}"` : 'No users found.'} /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Account</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td className="td-id">#{u.id}</td>
                    {/* firstName + lastName from convertUserToMap */}
                    <td className="td-bold">{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td className="td-muted">{u.phoneNumber || '—'}</td>
                    {/* authProvider: "LOCAL", "GOOGLE", "BOTH" */}
                    <td>
                      <Badge
                        label={u.authProvider || 'LOCAL'}
                        color={u.authProvider === 'GOOGLE' ? 'blue' : 'gray'}
                      />
                    </td>
                    {/* enabled: Boolean — click to toggle */}
                    <td>
                      <span style={{ cursor: 'pointer' }} title="Click to toggle" onClick={() => handleStatusToggle(u)}>
                        <Badge label={u.enabled ? 'Active' : 'Inactive'} color={u.enabled ? 'green' : 'red'} />
                      </span>
                    </td>
                    {/* accountLocked: Boolean */}
                    <td>
                      <Badge label={u.accountLocked ? 'Locked' : 'Open'} color={u.accountLocked ? 'red' : 'gray'} />
                    </td>
                    {/* role: string "ADMIN" or "USER" */}
                    <td>
                      <Badge label={u.role} color={u.role === 'ADMIN' ? 'purple' : 'blue'} />
                    </td>
                    <td className="td-actions">
                      {u.accountLocked
                        ? <ActBtn label="Unlock" icon={Unlock}  {...A.unlock}  onClick={() => handleUnlock(u)} />
                        : <ActBtn label="Lock"   icon={Lock}    {...A.lock}    onClick={() => handleLock(u)}   />
                      }
                      <ActBtn label="Role"    icon={Shield}  {...A.role}    onClick={() => handleRole(u)}    />
                      <ActBtn label="History" icon={History} {...A.history} onClick={() => setHistUser(u)}   />
                      <ActBtn label="Delete"  icon={Trash2}  {...A.delete}  onClick={() => handleDelete(u)}  />
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
      {histUser && <LoginHistoryModal user={histUser} onClose={() => setHistUser(null)} />}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}