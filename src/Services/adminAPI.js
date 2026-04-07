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

export const changeUserRole = async (id, roleName) => {
  const res = await apiClient.put(`/api/admin/users/${id}/role`, { roleName });
  return res.data;
};

export const updateUserStatus = async (id, enabled) => {
  const res = await apiClient.put(`/api/admin/users/${id}/status`, { enabled });
  return res.data;
};

export const getUserLoginHistory = async (id) => {
  const res = await apiClient.get(`/api/admin/users/${id}/login-history`);
  return Array.isArray(res.data) ? res.data : [];
};

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

export const createCategory = async (name) => {
  const res = await apiClient.post('/api/admin/categories', { name });
  return res.data;
};

export const updateCategory = async (id, name) => {
  const res = await apiClient.put(`/api/admin/categories/${id}`, { name });
  return res.data;
};

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

export const getAllDeals = async () => {
  const res = await apiClient.get('/api/admin/deals');
  return res.data;
};

export const getPublicDealsByName = async (name) => {
  const res = await apiClient.get('/api/public/deals', { params: { name } });
  return Array.isArray(res.data) ? res.data : [];
};

export const addDeal = async (dealName, serviceId) => {
  const res = await apiClient.post('/api/admin/deals', {
    dealName: dealName.toUpperCase(),
    serviceId: Number(serviceId),
  });
  return res.data;
};

export const removeDeal = async (dealId) => {
  const res = await apiClient.delete(`/api/admin/deals/${dealId}`);
  return res.data;
};

export const updateDealPosition = async (dealId, position) => {
  const res = await apiClient.put(`/api/admin/deals/${dealId}/position`, { position });
  return res.data;
};

// ─────────────────────────────────────────────────────────────
// SPECIFICATION MANAGEMENT  ← NEW
// ─────────────────────────────────────────────────────────────

// GET /api/public/services/{serviceId}/specifications
export const getServiceSpecs = async (serviceId) => {
  const res = await apiClient.get(`/api/public/services/${serviceId}/specifications`);
  return Array.isArray(res.data) ? res.data : [];
};

// POST /api/admin/specifications
// body: { serviceId, name, allowMultiple, displayOrder }
export const createSpec = async ({ serviceId, name, allowMultiple = false, displayOrder = 0 }) => {
  const res = await apiClient.post('/api/admin/specifications', {
    serviceId: Number(serviceId),
    name,
    allowMultiple,
    displayOrder,
  });
  return res.data;
};

// PUT /api/admin/specifications/{id}
export const updateSpec = async (id, { name, allowMultiple, displayOrder }) => {
  const res = await apiClient.put(`/api/admin/specifications/${id}`, {
    name,
    allowMultiple,
    displayOrder,
  });
  return res.data;
};

// DELETE /api/admin/specifications/{id}
export const deleteSpec = async (id) => {
  await apiClient.delete(`/api/admin/specifications/${id}`);
};

// POST /api/admin/specifications/{specId}/options
// body: { label, displayOrder }
export const addOption = async (specId, { label, displayOrder = 0 }) => {
  const res = await apiClient.post(`/api/admin/specifications/${specId}/options`, {
    label,
    displayOrder,
  });
  return res.data;
};

// PUT /api/admin/options/{id}
export const updateOption = async (id, { label, displayOrder }) => {
  const res = await apiClient.put(`/api/admin/options/${id}`, { label, displayOrder });
  return res.data;
};

// DELETE /api/admin/options/{id}
export const deleteOption = async (id) => {
  await apiClient.delete(`/api/admin/options/${id}`);
};