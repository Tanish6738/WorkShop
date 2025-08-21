// Auth service: handles authentication endpoints & access token lifecycle
import api from "../Axios/axios"; // pre-configured axios instance

const ACCESS_TOKEN_KEY = "pv_access_token";
const API_PREFIX = "/auth"; // instance already has baseURL (e.g., http://localhost:3000/api)

// ---------------- Token helpers ----------------
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token) => {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
};
export const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

// Attach interceptor once (idempotent pattern)
let interceptorsRegistered = false;
function ensureInterceptors() {
  if (interceptorsRegistered) return;
  // Request: inject Authorization header
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response: attempt single refresh on 401 (access token expired)
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      const status = error?.response?.status;
      // Only attempt refresh if: 401, not already retried, and refresh endpoint not the one failing
      if (
        status === 401 &&
        !original._retry &&
        !original.url?.endsWith(`${API_PREFIX}/refresh`)
      ) {
        original._retry = true;
        try {
          const { data } = await api.post(`${API_PREFIX}/refresh`); // refresh token expected via httpOnly cookie
          if (data?.data?.accessToken) {
            setAccessToken(data.data.accessToken);
            // Update header and replay original request
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return api(original);
          }
        } catch (refreshErr) {
          clearAccessToken();
        }
      }
      // If still failing propagate a normalized error
      return Promise.reject(normalizeError(error));
    }
  );
  interceptorsRegistered = true;
}

// Normalize backend error envelope or fallback
function normalizeError(error) {
  const resp = error?.response;
  if (!resp) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error.message || "Network error",
      },
    };
  }
  return (
    resp.data || {
      success: false,
      error: { code: "SERVER_ERROR", message: "Unexpected error" },
    }
  );
}

// --------------- Auth API Calls ---------------
export const register = async (userData) => {
  ensureInterceptors();
  try {
    const { data } = await api.post(`${API_PREFIX}/register`, userData);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
};

export const login = async (credentials) => {
  ensureInterceptors();
  try {
    const { data } = await api.post(`${API_PREFIX}/login`, credentials);
    // Expecting { success, data: { accessToken, user } }
    const token = data?.data?.accessToken;
    if (token) setAccessToken(token);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
};

export const refreshToken = async () => {
  ensureInterceptors();
  try {
    const { data } = await api.post(`${API_PREFIX}/refresh`);
    const token = data?.data?.accessToken;
    if (token) setAccessToken(token);
    return data;
  } catch (err) {
    clearAccessToken();
    throw normalizeError(err);
  }
};

export const logout = async () => {
  ensureInterceptors();
  try {
    const { data } = await api.post(`${API_PREFIX}/logout`);
    clearAccessToken();
    return data;
  } catch (err) {
    // Still clear token client-side
    clearAccessToken();
    throw normalizeError(err);
  }
};

export const getMe = async () => {
  ensureInterceptors();
  try {
    const { data } = await api.get(`${API_PREFIX}/me`);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
};

export const updateMe = async (payload) => {
  ensureInterceptors();
  try {
    const { data } = await api.patch(`${API_PREFIX}/me`, payload);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
};

export const changePassword = async (payload) => {
  ensureInterceptors();
  try {
    const { data } = await api.patch(`${API_PREFIX}/me/password`, payload);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
};

// Utility for conditional auth header usage (e.g., SSR or tests)
export const authHeader = () => {
  const t = getAccessToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// Helpful bulk clear (logout + other possible future keys)
export const purgeAuth = () => {
  clearAccessToken();
};

// Ensure interceptors initialized immediately (optional eager)
ensureInterceptors();

export default {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateMe,
  changePassword,
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  authHeader,
  purgeAuth,
};
