// Admin service: wraps administrative backend endpoints
// Requires authenticated admin user; relies on global axios interceptors (Auth.service registers them)
import api from "../Axios/axios";

const PREFIX = "/admin";

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

// ---------- Platform ----------
export const getPlatformStats = async () => {
  try {
    const { data } = await api.get(`${PREFIX}/stats`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};

// ---------- Users ----------
export const listUsers = async (params = {}) => {
  try {
    const { data } = await api.get(`${PREFIX}/users`, { params });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const getUserAdmin = async (id) => {
  try {
    const { data } = await api.get(`${PREFIX}/users/${id}`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const banUser = async (id) => {
  try {
    const { data } = await api.patch(`${PREFIX}/users/${id}/ban`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const unbanUser = async (id) => {
  try {
    const { data } = await api.patch(`${PREFIX}/users/${id}/unban`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const changeUserRole = async (id, role) => {
  try {
    const { data } = await api.patch(`${PREFIX}/users/${id}/role`, { role });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const bulkUserRole = async (userIds, role) => {
  try {
    const { data } = await api.post(`${PREFIX}/users/bulk/role`, {
      userIds,
      role,
    });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const bulkBan = async (userIds) => {
  try {
    const { data } = await api.post(`${PREFIX}/users/bulk/ban`, { userIds });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const bulkUnban = async (userIds) => {
  try {
    const { data } = await api.post(`${PREFIX}/users/bulk/unban`, { userIds });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};

// ---------- Prompts ----------
export const listAllPrompts = async (params = {}) => {
  try {
    const { data } = await api.get(`${PREFIX}/prompts/all`, { params });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const listPublicPromptsAdmin = async (params = {}) => {
  try {
    const { data } = await api.get(`${PREFIX}/prompts`, { params });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const deletePromptAdmin = async (id) => {
  try {
    const { data } = await api.delete(`${PREFIX}/prompts/${id}`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const bulkDeletePrompts = async (promptIds) => {
  try {
    const { data } = await api.post(`${PREFIX}/prompts/bulk/delete`, {
      promptIds,
    });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};

// ---------- Collections ----------
export const listAllCollections = async (params = {}) => {
  try {
    const { data } = await api.get(`${PREFIX}/collections/all`, { params });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const listPublicCollectionsAdmin = async (params = {}) => {
  try {
    const { data } = await api.get(`${PREFIX}/collections`, { params });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const deleteCollectionAdmin = async (id) => {
  try {
    const { data } = await api.delete(`${PREFIX}/collections/${id}`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const bulkDeleteCollections = async (collectionIds) => {
  try {
    const { data } = await api.post(`${PREFIX}/collections/bulk/delete`, {
      collectionIds,
    });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};

export default {
  // platform
  getPlatformStats,
  // users
  listUsers,
  getUserAdmin,
  banUser,
  unbanUser,
  changeUserRole,
  bulkUserRole,
  bulkBan,
  bulkUnban,
  // prompts
  listAllPrompts,
  listPublicPromptsAdmin,
  deletePromptAdmin,
  bulkDeletePrompts,
  // collections
  listAllCollections,
  listPublicCollectionsAdmin,
  deleteCollectionAdmin,
  bulkDeleteCollections,
};
