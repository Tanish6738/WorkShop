import React, { useState, useEffect } from 'react';
import { createPrompt, updatePrompt } from '../../Services/prompt.service';
import { listCollections, addPromptToCollection } from '../../Services/collection.service';
import { motion } from 'framer-motion';

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
    <motion.form
      onSubmit={submit}
      className="flex flex-col gap-4"
      initial={{ opacity:0, y:24 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:.45, ease:[0.4,0,0.2,1] }}
    >
      <h3 className="m-0 text-lg font-semibold tracking-tight flex items-center gap-2">
        {existing ? 'Edit Prompt' : 'New Prompt'}
        {existing && <span className="badge">Edit</span>}
      </h3>
      <FormRow label="Title">
        <motion.input name="title" value={form.title} onChange={change} required className="w-full" whileFocus={{ scale:1.01, borderColor:'var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
      </FormRow>
      <FormRow label="Description">
        <motion.input name="description" value={form.description} onChange={change} className="w-full" whileFocus={{ scale:1.01, borderColor:'var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
      </FormRow>
      <FormRow label="Content">
        <motion.textarea name="content" value={form.content} onChange={change} rows={6} required className="w-full resize-y" whileFocus={{ scale:1.01, borderColor:'var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
      </FormRow>
      <div className="flex flex-col md:flex-row gap-4">
        <FormRow className="flex-1" label="Category">
          <motion.input name="category" value={form.category} onChange={change} className="w-full" whileFocus={{ scale:1.01, borderColor:'var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
        </FormRow>
        <FormRow className="flex-1" label="Tags (comma)">
          <motion.input name="tags" value={form.tags} onChange={change} className="w-full" placeholder="e.g. chatgpt, code" whileFocus={{ scale:1.01, borderColor:'var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
        </FormRow>
      </div>
      <FormRow label="Visibility">
        <motion.select name="visibility" value={form.visibility} onChange={change} className="w-full" whileFocus={{ scale:1.01, borderColor:'var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </motion.select>
      </FormRow>
      {!existing && allowCollectionSelect && (
        <FormRow label="Add to Collection (optional)">
          {collectionsLoading ? (
            <div className="text-xs text-[var(--pv-text-dim)] mt-1">Loading collections...</div>
          ) : collections.length === 0 ? (
            <div className="text-xs text-[var(--pv-text-dim)] mt-1">No collections yet.</div>
          ) : (
            <motion.select value={selectedCollection} onChange={e=>setSelectedCollection(e.target.value)} className="w-full" whileFocus={{ scale:1.01, borderColor:'var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }}>
              <option value="">-- None --</option>
              {collections.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
            </motion.select>
          )}
        </FormRow>
      )}
      {error && <div className="form-error text-xs">{error}</div>}
      <div className="flex gap-3 pt-2">
        <motion.button type="submit" disabled={loading} className="btn btn-primary px-6" whileHover={{ y:-2 }} whileTap={{ scale:.95 }} transition={{ duration:.18, ease:'easeOut' }}>{loading ? 'Saving…' : 'Save'}</motion.button>
        {onCancel && <motion.button type="button" onClick={onCancel} className="btn btn-secondary" whileHover={{ y:-2 }} whileTap={{ scale:.95 }} transition={{ duration:.18, ease:'easeOut' }}>Cancel</motion.button>}
      </div>
    </motion.form>
  );
};

const FormRow = ({ label, children, className='' }) => (
  <label className={`flex flex-col gap-1 text-[var(--pv-text-dim)] text-sm ${className}`}>
    <span className="text-xs uppercase tracking-wide">{label}</span>
    {children}
  </label>
);

export default PromptForm;
