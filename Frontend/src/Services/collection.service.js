import api from '../Axios/axios';

const PREFIX = '/collections';

function normalizeError(error){
  const resp = error?.response; if(!resp) return { success:false, error:{ code:'NETWORK_ERROR', message:error.message||'Network error'}}; return resp.data || { success:false, error:{ code:'SERVER_ERROR', message:'Unexpected error'}};
}

export const createCollection = async (payload)=>{ try { const { data } = await api.post(PREFIX, payload); return data; } catch(e){ throw normalizeError(e);} };
export const listCollections = async (params={})=>{ try { const { data } = await api.get(PREFIX, { params }); return data; } catch(e){ throw normalizeError(e);} };
export const getCollection = async (id)=>{ try { const { data } = await api.get(`${PREFIX}/${id}`); return data; } catch(e){ throw normalizeError(e);} };
export const updateCollection = async (id,payload)=>{ try { const { data } = await api.put(`${PREFIX}/${id}`, payload); return data; } catch(e){ throw normalizeError(e);} };
export const deleteCollection = async (id)=>{ try { const { data } = await api.delete(`${PREFIX}/${id}`); return data; } catch(e){ throw normalizeError(e);} };
export const addPromptToCollection = async (id,promptId)=>{ try { const { data } = await api.post(`${PREFIX}/${id}/prompts`, { promptId }); return data; } catch(e){ throw normalizeError(e);} };
export const removePromptFromCollection = async (id,promptId)=>{ try { const { data } = await api.delete(`${PREFIX}/${id}/prompts/${promptId}`); return data; } catch(e){ throw normalizeError(e);} };

export default { createCollection, listCollections, getCollection, updateCollection, deleteCollection, addPromptToCollection, removePromptFromCollection };
