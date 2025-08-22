import React, { useEffect, useState } from 'react';
import { createCollection, updateCollection } from '../../Services/collection.service';
import { motion } from 'framer-motion';

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
    <motion.form
      onSubmit={submit}
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4, ease: 'easeOut' }}
    >
      <h3 className="m-0 text-lg font-semibold tracking-tight flex items-center gap-2">
        {existing ? 'Edit Collection' : 'New Collection'}
        {existing && <span className="badge">Edit</span>}
      </h3>
      <label className="flex flex-col gap-1 text-[var(--pv-text-dim)] text-sm">
        <span className="text-xs uppercase tracking-wide">Name</span>
        <motion.input
          name="name"
          value={form.name}
          onChange={change}
          required
          className="w-full"
          whileFocus={{ scale: 1.01, borderColor: 'var(--pv-orange)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
      </label>
      <label className="flex flex-col gap-1 text-[var(--pv-text-dim)] text-sm">
        <span className="text-xs uppercase tracking-wide">Description</span>
        <motion.textarea
          name="description"
          value={form.description}
            onChange={change}
            rows={3}
            className="w-full resize-y"
            whileFocus={{ scale: 1.01, borderColor: 'var(--pv-orange)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
      </label>
      <label className="flex flex-col gap-1 text-[var(--pv-text-dim)] text-sm">
        <span className="text-xs uppercase tracking-wide">Visibility</span>
        <motion.select
          name="visibility"
          value={form.visibility}
          onChange={change}
          className="w-full"
          whileFocus={{ scale: 1.01, borderColor: 'var(--pv-orange)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </motion.select>
      </label>
      {error && <div className="form-error text-xs">{error}</div>}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={loading}
          className="btn btn-primary px-5"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {loading ? 'Saving…' : 'Save'}
        </motion.button>
        {onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            Cancel
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

// Legacy inline style constants removed (replaced by Tailwind + CSS variables + motion)

export default CollectionForm;
