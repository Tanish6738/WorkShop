import React, { useEffect, useState } from 'react';
import { createCollection, updateCollection } from '../../Services/collection.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers3, Eye, EyeOff, Save, X, Loader2, FileText } from 'lucide-react';

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

  const activeVis = form.visibility;
  return (
    <motion.form
      onSubmit={submit}
      className="flex flex-col gap-5"
      noValidate
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .45, ease: [0.4,0,0.2,1] }}
      aria-labelledby="collection-form-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 id="collection-form-heading" className="m-0 text-lg font-semibold tracking-tight flex items-center gap-2 bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">
          <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]"><Layers3 className="h-5 w-5 text-[var(--pv-orange)]" /></span>
          {existing ? 'Edit Collection' : 'Create Collection'}
          {existing && <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--pv-text-dim)]">Editing</span>}
        </h3>
        {onCancel && (
          <motion.button type="button" onClick={onCancel} whileHover={{ y:-2 }} whileTap={{ scale:.92 }} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] text-[var(--pv-text-dim)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60">
            <X className="h-3.5 w-3.5" /> Close
          </motion.button>
        )}
      </div>
      <div className="flex flex-col gap-1 text-[var(--pv-text-dim)] text-sm">
        <label htmlFor="collection-name" className="text-[11px] uppercase tracking-wide font-medium">Name</label>
        <div className="relative">
          <FileText className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)]" />
          <motion.input
            id="collection-name"
            name="name"
            value={form.name}
            onChange={change}
            required
            placeholder="e.g. Creative Blog Intros"
            className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none"
            whileFocus={{ scale: 1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 text-[var(--pv-text-dim)] text-sm">
        <label htmlFor="collection-description" className="text-[11px] uppercase tracking-wide font-medium">Description <span className="text-[var(--pv-text-dim)] font-normal lowercase">(optional)</span></label>
        <motion.textarea
          id="collection-description"
          name="description"
          value={form.description}
          onChange={change}
          rows={3}
          placeholder="Short description to help you and others understand its purpose."
          className="w-full resize-y pl-3 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none"
          whileFocus={{ scale: 1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-wide text-[var(--pv-text-dim)] font-medium">Visibility</span>
        <div className="inline-flex rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] p-1 gap-1 w-fit" role="radiogroup" aria-label="Collection visibility">
          <VisibilityButton active={activeVis==='public'} icon={Eye} label="Public" description="Anyone can view" onClick={()=> setForm(f=>({...f, visibility:'public'}))} />
          <VisibilityButton active={activeVis==='private'} icon={EyeOff} label="Private" description="Only you" onClick={()=> setForm(f=>({...f, visibility:'private'}))} />
        </div>
      </div>
      <AnimatePresence>{error && (
        <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} className="form-error text-xs flex items-center gap-2" role="alert">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          {error}
        </motion.div>
      )}</AnimatePresence>
      <div className="flex flex-wrap gap-3 pt-1">
        <motion.button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] font-medium text-sm tracking-wide hover:brightness-110 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{loading ? 'Saving…' : existing ? 'Save Changes' : 'Create Collection'}</span>
        </motion.button>
        {onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] text-sm text-[var(--pv-text-dim)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

const VisibilityButton = ({ active, icon:Icon, label, description, onClick }) => (
  <button type="button" role="radio" aria-checked={active} onClick={onClick} className={`relative px-3 py-2 rounded-md text-xs font-medium inline-flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 ${active? 'bg-[var(--pv-orange)] text-[var(--pv-black)] shadow-sm':'bg-[var(--pv-surface)] text-[var(--pv-text-dim)] hover:bg-[var(--pv-surface-hover)]'}`}>
    <Icon className="h-4 w-4" />
    <span className="flex flex-col text-left leading-tight">
      <span>{label}</span>
      <span className="text-[9px] font-normal opacity-70 -mt-0.5">{description}</span>
    </span>
    {active && (
      <motion.span layoutId="vis-active-pill" className="absolute inset-0 rounded-md -z-10" transition={{ type:'spring', stiffness:300, damping:30 }} />
    )}
  </button>
);

// Legacy inline style constants removed (replaced by Tailwind + CSS variables + motion)

export default CollectionForm;
