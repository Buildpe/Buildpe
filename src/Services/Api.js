import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://buildpe-platform.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,          // ✅ increased from 30s to 60s (Render free tier needs time to wake up)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,  // ✅ stops browser sending session cookies that trigger OAuth2 redirect
});

// ─── Request interceptor ──────────────────────────────────────
// ✅ Auto-attach Bearer token on every request if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ─── Response interceptor ─────────────────────────────────────
// ✅ Auto refresh token on 401, then retry the original request
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const refreshToken = localStorage.getItem('refreshToken');
              if (!refreshToken) throw new Error('No refresh token');

              const res = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, { refreshToken });
              const { accessToken, refreshToken: newRefresh } = res.data;

              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', newRefresh);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return apiClient(originalRequest);
            } catch (refreshError) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }
          break;
        case 403:
          console.error('❌ Forbidden - Access denied');
          break;
        case 404:
          console.error('❌ Not Found');
          break;
        case 500:
          console.error('❌ Server Error');
          break;
        default:
          console.error('❌ API Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('❌ Network Error: No response from server');
      console.error('Check if backend is running:', API_BASE_URL);
    } else {
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };