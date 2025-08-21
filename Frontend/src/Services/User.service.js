// User service: profile & related resources
import api from "../Axios/axios";
import { getAccessToken } from "./Auth.service"; // ensure token header via interceptor already

const USERS_PREFIX = "/users"; // baseURL already set (e.g., /api)

function normalizeError(error) {
  const resp = error?.response;
  if (!resp)
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error.message || "Network error",
      },
    };
  return (
    resp.data || {
      success: false,
      error: { code: "SERVER_ERROR", message: "Unexpected error" },
    }
  );
}

// Public profile fetch
export const getUserProfile = async (userId) => {
  try {
    const { data } = await api.get(`${USERS_PREFIX}/${userId}`);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
};

// Public prompts by user (optionally pass pagination params)
export const getUserPrompts = async (userId, params = {}) => {
  try {
    const { data } = await api.get(`${USERS_PREFIX}/${userId}/prompts`, {
      params,
    });
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
};

// Public collections by user
export const getUserCollections = async (userId, params = {}) => {
  try {
    const { data } = await api.get(`${USERS_PREFIX}/${userId}/collections`, {
      params,
    });
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
};

// Convenience: fetch profile + prompts concurrently (basic example)
export const getUserOverview = async (
  userId,
  { promptsParams = {}, collectionsParams = {} } = {}
) => {
  try {
    const [profileRes, promptsRes, collectionsRes] = await Promise.all([
      api.get(`${USERS_PREFIX}/${userId}`),
      api.get(`${USERS_PREFIX}/${userId}/prompts`, { params: promptsParams }),
      api.get(`${USERS_PREFIX}/${userId}/collections`, {
        params: collectionsParams,
      }),
    ]);
    return {
      profile: profileRes.data,
      prompts: promptsRes.data,
      collections: collectionsRes.data,
    };
  } catch (err) {
    throw normalizeError(err);
  }
};

// Helper to know if current client is authenticated (access token present)
export const isAuthenticated = () => Boolean(getAccessToken());

export default {
  getUserProfile,
  getUserPrompts,
  getUserCollections,
  getUserOverview,
  isAuthenticated,
};
