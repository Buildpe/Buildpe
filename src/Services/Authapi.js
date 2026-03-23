import apiClient from './Api';

// ─── Token + User Storage ─────────────────────────────────────
export const tokenStorage = {
  // Tokens
  getAccessToken:  () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo'); // clear user info on logout too
  },
  isLoggedIn: () => !!localStorage.getItem('accessToken'),

  // User info — saved on login, cleared on logout
  // Shape: { id, email, firstName, lastName, phoneNumber, role }
  setUserInfo: (user) => {
    localStorage.setItem('userInfo', JSON.stringify(user));
  },
  getUserInfo: () => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};

// ─── Auth Endpoints ───────────────────────────────────────────

export async function registerUser({ email, password, firstName, lastName, phoneNumber }) {
  const res = await apiClient.post('/api/auth/register', {
    email, password, firstName, lastName, phoneNumber,
  });
  return res.data;
}

export async function loginUser({ identifier, password }) {
  const res = await apiClient.post('/api/auth/login', { identifier, password });

  if (res.data.accessToken && res.data.refreshToken) {
    tokenStorage.setTokens(res.data.accessToken, res.data.refreshToken);
  }

  // Save user info to localStorage so it's available everywhere
  // LoginResponse.UserInfo has: id, email, phoneNumber, firstName, lastName, role
  if (res.data.user) {
    tokenStorage.setUserInfo(res.data.user);
  }

  return res.data;
}

export async function refreshToken() {
  const storedRefresh = tokenStorage.getRefreshToken();
  if (!storedRefresh) throw new Error('No refresh token available');

  const res = await apiClient.post('/api/auth/refresh-token', {
    refreshToken: storedRefresh,
  });

  if (res.data.accessToken && res.data.refreshToken) {
    tokenStorage.setTokens(res.data.accessToken, res.data.refreshToken);
  }

  // Update user info if returned in refresh response
  if (res.data.user) {
    tokenStorage.setUserInfo(res.data.user);
  }

  return res.data;
}

export async function logoutUser() {
  const refreshTokenValue = tokenStorage.getRefreshToken();
  try {
    if (refreshTokenValue) {
      await apiClient.post('/api/auth/logout', { refreshToken: refreshTokenValue });
    }
  } finally {
    // clearTokens() also removes userInfo
    tokenStorage.clearTokens();
  }
}

export function initiateGoogleLogin() {
  const BASE_URL = 'https://buildpe-platform.onrender.com';
  window.location.href = `${BASE_URL}/oauth2/authorization/google`;
}

export async function authFetch(endpoint, options = {}) {
  const method = (options.method || 'GET').toLowerCase();
  const body = options.body ? JSON.parse(options.body) : undefined;
  const res = await apiClient[method](endpoint, body);
  return res.data;
}