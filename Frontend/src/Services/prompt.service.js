import api from "../Axios/axios";

const PREFIX = "/prompts";
const ME_PREFIX = '/me'; // for favorites/likes lists

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

export const createPrompt = async (payload) => {
  try {
    const { data } = await api.post(PREFIX, payload);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const listPrompts = async (params = {}) => {
  try {
    const { data } = await api.get(PREFIX, { params });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const getPrompt = async (id) => {
  try {
    const { data } = await api.get(`${PREFIX}/${id}`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const updatePrompt = async (id, payload) => {
  try {
    const { data } = await api.put(`${PREFIX}/${id}`, payload);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const changePromptVisibility = async (id, visibility) => {
  try {
    const { data } = await api.patch(`${PREFIX}/${id}/visibility`, {
      visibility,
    });
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const deletePrompt = async (id) => {
  try {
    const { data } = await api.delete(`${PREFIX}/${id}`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const listVersions = async (id) => {
  try {
    const { data } = await api.get(`${PREFIX}/${id}/versions`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const getVersion = async (id, versionNumber) => {
  try {
    const { data } = await api.get(`${PREFIX}/${id}/versions/${versionNumber}`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const likePrompt = async (id) => {
  try {
    const { data } = await api.post(`${PREFIX}/${id}/like`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const unlikePrompt = async (id) => {
  try {
    const { data } = await api.delete(`${PREFIX}/${id}/like`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const remixPrompt = async (id, payload = {}) => {
  try {
    const { data } = await api.post(`${PREFIX}/${id}/remix`, payload);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const listRemixes = async (id) => {
  try {
    const { data } = await api.get(`${PREFIX}/${id}/remixes`);
    return data;
  } catch (e) {
    throw normalizeError(e);
  }
};
export const incrementView = async (id) => {
  try {
    const { data } = await api.post(`${PREFIX}/${id}/view`);
    return data;
  } catch (e) {
    /* ignore view errors */ return { success: false };
  }
};

// Engagement (like already implemented above); add favorites & aggregate engagement fetch
export const favoritePrompt = async (id) => { try { const { data } = await api.post(`${PREFIX}/${id}/favorite`); return data; } catch (e){ throw normalizeError(e);} };
export const unfavoritePrompt = async (id) => { try { const { data } = await api.delete(`${PREFIX}/${id}/favorite`); return data; } catch (e){ throw normalizeError(e);} };
export const getEngagement = async (id) => { try { const { data } = await api.get(`${PREFIX}/${id}/engagement`); return data; } catch(e){ throw normalizeError(e);} };
export const listFavorites = async () => { try { const { data } = await api.get(`${ME_PREFIX}/favorites`); return data; } catch(e){ throw normalizeError(e);} };
export const listLikes = async () => { try { const { data } = await api.get(`${ME_PREFIX}/likes`); return data; } catch(e){ throw normalizeError(e);} };

// Version management
export const createVersion = async (id, content) => {
  try { const { data } = await api.post(`${PREFIX}/${id}/versions`, { content }); return data; } catch (e) { throw normalizeError(e); }
};
export const restoreVersion = async (id, versionNumber) => {
  try { const { data } = await api.post(`${PREFIX}/${id}/versions/${versionNumber}/restore`); return data; } catch (e) { throw normalizeError(e); }
};
export const deleteVersion = async (id, versionNumber) => {
  try { const { data } = await api.delete(`${PREFIX}/${id}/versions/${versionNumber}`); return data; } catch (e) { throw normalizeError(e); }
};

export default {
  createPrompt,
  listPrompts,
  getPrompt,
  updatePrompt,
  changePromptVisibility,
  deletePrompt,
  listVersions,
  getVersion,
  likePrompt,
  unlikePrompt,
  remixPrompt,
  listRemixes,
  incrementView,
  createVersion,
  restoreVersion,
  deleteVersion,
  favoritePrompt,
  unfavoritePrompt,
  getEngagement,
  listFavorites,
  listLikes,
};
