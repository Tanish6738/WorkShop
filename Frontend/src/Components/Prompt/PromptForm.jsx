import React, { useState, useEffect } from 'react';
import { createPrompt, updatePrompt } from '../../Services/prompt.service';
import { listCollections, addPromptToCollection } from '../../Services/collection.service';

const empty = { title:'', description:'', content:'', category:'', tags:'', visibility:'public' };

const PromptForm = ({ existing, onSaved, onCancel, allowCollectionSelect=false }) => {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');

  useEffect(() => { if (existing) setForm({ ...existing, tags: (existing.tags||[]).join(',') }); }, [existing]);
  useEffect(()=>{ if(allowCollectionSelect && !existing){ setCollectionsLoading(true); listCollections({ mine:'true', limit:100 }).then(r=> setCollections(r.data.items || [])).catch(()=>{}).finally(()=> setCollectionsLoading(false)); } },[allowCollectionSelect, existing]);

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      content: form.content,
      category: form.category || undefined,
      tags: form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : [],
      visibility: form.visibility,
    };
    try {
      let res;
      if (existing) res = await updatePrompt(existing._id || existing.id, payload);
      else res = await createPrompt(payload);
      if (res?.data) {
        const created = res.data;
        if(!existing && allowCollectionSelect && selectedCollection){
          try { await addPromptToCollection(selectedCollection, created._id || created.id); } catch(_) { /* ignore add fail */ }
        }
        onSaved?.(created);
      }
    } catch (e) { setError(e?.error?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <h3 style={{ margin:0 }}>{existing ? 'Edit Prompt' : 'New Prompt'}</h3>
      <label>Title
        <input name="title" value={form.title} onChange={change} required style={input} />
      </label>
      <label>Description
        <input name="description" value={form.description} onChange={change} style={input} />
      </label>
      <label>Content
        <textarea name="content" value={form.content} onChange={change} rows={6} required style={textarea} />
      </label>
      <div style={{ display:'flex', gap:12 }}>
        <label style={{ flex:1 }}>Category
          <input name="category" value={form.category} onChange={change} style={input} />
        </label>
        <label style={{ flex:1 }}>Tags (comma)
          <input name="tags" value={form.tags} onChange={change} style={input} />
        </label>
      </div>
      <label>Visibility
        <select name="visibility" value={form.visibility} onChange={change} style={input}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </label>
      {!existing && allowCollectionSelect && (
        <label>Add to Collection (optional)
          {collectionsLoading ? (
            <div style={{ fontSize:12, color:'#666', marginTop:4 }}>Loading collections...</div>
          ) : collections.length === 0 ? (
            <div style={{ fontSize:12, color:'#666', marginTop:4 }}>No collections yet.</div>
          ) : (
            <select value={selectedCollection} onChange={e=>setSelectedCollection(e.target.value)} style={input}>
              <option value="">-- None --</option>
              {collections.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
            </select>
          )}
        </label>
      )}
      {error && <div style={err}>{error}</div>}
      <div style={{ display:'flex', gap:8 }}>
        <button type="submit" disabled={loading} style={btnPrimary}>{loading ? 'Saving...' : 'Save'}</button>
        {onCancel && <button type="button" onClick={onCancel} style={btnSecondary}>Cancel</button>}
      </div>
    </form>
  );
};

const input = { width:'100%', padding:'8px 10px', marginTop:4, border:'1px solid #ccc', borderRadius:4 };
const textarea = { ...input, resize:'vertical' };
const err = { background:'#ffe6e6', color:'#a40000', padding:'6px 8px', borderRadius:4 };
const btnPrimary = { padding:'8px 14px', background:'#222', color:'#fff', border:'none', borderRadius:4, cursor:'pointer' };
const btnSecondary = { ...btnPrimary, background:'#666' };

export default PromptForm;
