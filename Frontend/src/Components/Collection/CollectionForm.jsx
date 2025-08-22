import React, { useEffect, useState } from 'react';
import { createCollection, updateCollection } from '../../Services/collection.service';

const empty = { name:'', description:'', visibility:'public' };

const CollectionForm = ({ existing, onSaved, onCancel }) => {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(()=>{ if(existing) setForm({ name: existing.name||'', description: existing.description||'', visibility: existing.visibility||'public'}); },[existing]);

  const change = e => setForm(f=>({...f,[e.target.name]: e.target.value}));
  const submit = async e => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      let res;
      if(existing) res = await updateCollection(existing._id || existing.id, form);
      else res = await createCollection(form);
      if(res?.data) onSaved?.(res.data);
    } catch(err){ setError(err?.error?.message || 'Save failed'); } finally { setLoading(false);} }

  return (
    <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <h3 style={{ margin:0 }}>{existing ? 'Edit Collection' : 'New Collection'}</h3>
      <label>Name
        <input name="name" value={form.name} onChange={change} required style={input} />
      </label>
      <label>Description
        <textarea name="description" value={form.description} onChange={change} rows={3} style={textarea} />
      </label>
      <label>Visibility
        <select name="visibility" value={form.visibility} onChange={change} style={input}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </label>
      {error && <div style={errBox}>{error}</div>}
      <div style={{ display:'flex', gap:8 }}>
        <button type="submit" disabled={loading} style={btnPrimary}>{loading ? 'Saving...' : 'Save'}</button>
        {onCancel && <button type="button" onClick={onCancel} style={btnSecondary}>Cancel</button>}
      </div>
    </form>
  );
};

const input = { width:'100%', padding:'8px 10px', marginTop:4, border:'1px solid #ccc', borderRadius:4 };
const textarea = { ...input, resize:'vertical' };
const btnPrimary = { padding:'8px 14px', background:'#222', color:'#fff', border:'none', borderRadius:4, cursor:'pointer' };
const btnSecondary = { ...btnPrimary, background:'#666' };
const errBox = { background:'#ffe6e6', color:'#a40000', padding:'6px 8px', borderRadius:4 };

export default CollectionForm;
