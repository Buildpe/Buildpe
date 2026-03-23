import apiClient from './Api';

// ─────────────────────────────────────────────────────────────
// USER MANAGEMENT  /api/admin/users
// ─────────────────────────────────────────────────────────────

export const getAllUsers = async () => {
  const res = await apiClient.get('/api/admin/users');
  return Array.isArray(res.data) ? res.data : [];
};

export const getUserById = async (id) => {
  const res = await apiClient.get(`/api/admin/users/${id}`);
  return res.data;
};

export const lockUser = async (id) => {
  const res = await apiClient.put(`/api/admin/users/${id}/lock`);
  return res.data;
};

export const unlockUser = async (id) => {
  const res = await apiClient.put(`/api/admin/users/${id}/unlock`);
  return res.data;
};

// Body: { "roleName": "ADMIN" } or { "roleName": "USER" }
export const changeUserRole = async (id, roleName) => {
  const res = await apiClient.put(`/api/admin/users/${id}/role`, { roleName });
  return res.data;
};

// Body: { "enabled": true } or { "enabled": false }
export const updateUserStatus = async (id, enabled) => {
  const res = await apiClient.put(`/api/admin/users/${id}/status`, { enabled });
  return res.data;
};

// NOTE: URL has hyphen — /login-history
export const getUserLoginHistory = async (id) => {
  const res = await apiClient.get(`/api/admin/users/${id}/login-history`);
  return Array.isArray(res.data) ? res.data : [];
};

// Soft delete — sets enabled=false
export const deleteUser = async (id) => {
  const res = await apiClient.delete(`/api/admin/users/${id}`);
  return res.data;
};

export const getStats = async () => {
  const res = await apiClient.get('/api/admin/stats');
  return res.data;
};

// ─────────────────────────────────────────────────────────────
// CATEGORY MANAGEMENT
// ─────────────────────────────────────────────────────────────

export const getAllCategories = async () => {
  const res = await apiClient.get('/api/public/categories');
  return Array.isArray(res.data) ? res.data : [];
};

export const getCategoryById = async (id) => {
  const res = await apiClient.get(`/api/admin/categories/${id}`);
  return res.data;
};

// Body: { "name": "..." } — no description field
export const createCategory = async (name) => {
  const res = await apiClient.post('/api/admin/categories', { name });
  return res.data;
};

export const updateCategory = async (id, name) => {
  const res = await apiClient.put(`/api/admin/categories/${id}`, { name });
  return res.data;
};

// 204 No Content — 409 if category has services
export const deleteCategory = async (id) => {
  await apiClient.delete(`/api/admin/categories/${id}`);
};

// ─────────────────────────────────────────────────────────────
// SERVICE MANAGEMENT
// ─────────────────────────────────────────────────────────────

export const getAllServices = async () => {
  const res = await apiClient.get('/api/public/services');
  return Array.isArray(res.data) ? res.data : [];
};

export const getServicesByCategory = async (categoryId) => {
  const res = await apiClient.get(`/api/public/categories/${categoryId}/services`);
  return Array.isArray(res.data) ? res.data : [];
};

// Body: { title, description, price, discount, imgUrl, category: { id } }
export const createService = async ({ title, description, price, discount, imgUrl, categoryId }) => {
  const res = await apiClient.post('/api/admin/services', {
    title,
    description,
    price: parseFloat(price),
    discount: parseFloat(discount) || 0,
    imgUrl: imgUrl || '',
    category: { id: Number(categoryId) },
  });
  return res.data;
};

export const updateService = async (id, { title, description, price, discount, imgUrl, categoryId }) => {
  const res = await apiClient.put(`/api/admin/services/${id}`, {
    title,
    description,
    price: parseFloat(price),
    discount: parseFloat(discount) || 0,
    imgUrl: imgUrl || '',
    category: { id: Number(categoryId) },
  });
  return res.data;
};

// 204 No Content
export const deleteService = async (id) => {
  await apiClient.delete(`/api/admin/services/${id}`);
};

// ─────────────────────────────────────────────────────────────
// AUTH — register user from admin
// ─────────────────────────────────────────────────────────────

export const registerNewUser = async ({ email, password, firstName, lastName, phoneNumber }) => {
  const res = await apiClient.post('/api/auth/register', {
    email, password, firstName, lastName, phoneNumber,
  });
  return res.data;
};

// ─────────────────────────────────────────────────────────────
// DEAL MANAGEMENT
// ─────────────────────────────────────────────────────────────

// GET /api/admin/deals
// Returns: { "LIVE_SERVICE": [...], "TOP_DEAL": [...] }
// Each item: { dealId, position, serviceId, title, imgUrl, price, discount }
export const getAllDeals = async () => {
  const res = await apiClient.get('/api/admin/deals');
  return res.data;
};

// GET /api/public/deals?name=LIVE_SERVICE
// Returns enriched service list for a deal group (no auth needed)
export const getPublicDealsByName = async (name) => {
  const res = await apiClient.get('/api/public/deals', { params: { name } });
  return Array.isArray(res.data) ? res.data : [];
};

// POST /api/admin/deals
// Body: { dealName: "LIVE_SERVICE", serviceId: 5 }
export const addDeal = async (dealName, serviceId) => {
  const res = await apiClient.post('/api/admin/deals', {
    dealName: dealName.toUpperCase(),
    serviceId: Number(serviceId),
  });
  return res.data;
};

// DELETE /api/admin/deals/{id}  — removes by dealId (not serviceId)
export const removeDeal = async (dealId) => {
  const res = await apiClient.delete(`/api/admin/deals/${dealId}`);
  return res.data;
};

// PUT /api/admin/deals/{id}/position
// Body: { position: 2 }
export const updateDealPosition = async (dealId, position) => {
  const res = await apiClient.put(`/api/admin/deals/${dealId}/position`, { position });
  return res.data;
};