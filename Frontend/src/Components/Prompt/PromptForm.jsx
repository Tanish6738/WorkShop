import React, { useState, useEffect } from 'react';
import { createPrompt, updatePrompt } from '../../Services/prompt.service';
import { listCollections, addPromptToCollection } from '../../Services/collection.service';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Type, Tag as TagIcon, Layers3, Eye, EyeOff, Save, X, Loader2 } from 'lucide-react';

const empty = { title:'', description:'', content:'', category:'', tags:'', visibility:'public' };

const PromptForm = ({ existing, onSaved, onCancel, allowCollectionSelect=false }) => {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || '',
        description: existing.description || '',
        content: existing.content || '',
        category: existing.category || '',
        tags: (existing.tags || []).join(','),
        visibility: existing.visibility || 'public'
      });
    }
  }, [existing]);

  // Load collections if needed
  useEffect(() => {
    if (allowCollectionSelect && !existing) {
      setCollectionsLoading(true);
      listCollections({ mine: 'true', limit: 100 })
        .then(r => setCollections(r?.data?.items || []))
        .catch(() => {})
        .finally(() => setCollectionsLoading(false));
    }
  }, [allowCollectionSelect, existing]);

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (!form.title.trim()) throw new Error('Title is required');
      if (!form.content.trim()) throw new Error('Content is required');

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        content: form.content,
        category: form.category.trim(),
        tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean),
        visibility: form.visibility
      };

      let saved;
      if (existing?._id || existing?.id) {
        const id = existing._id || existing.id;
        const res = await updatePrompt(id, payload);
        saved = res.data;
      } else {
        const res = await createPrompt(payload);
        saved = res.data;
        if (allowCollectionSelect && selectedCollection) {
          try { await addPromptToCollection(selectedCollection, saved._id || saved.id); } catch { /* silent */ }
        }
      }
      onSaved && onSaved(saved);
      if (!existing) setForm(empty);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form onSubmit={submit} className="flex flex-col gap-6" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.45, ease:[0.4,0,0.2,1] }} aria-labelledby="prompt-form-heading" noValidate>
      <div className="flex items-start justify-between gap-4">
        <h3 id="prompt-form-heading" className="m-0 text-lg font-semibold tracking-tight flex items-center gap-2 bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">
          <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]"><FileText className="h-5 w-5 text-[var(--pv-orange)]" /></span>
          {existing ? 'Edit Prompt' : 'Create Prompt'}
          {existing && <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--pv-text-dim)]">Editing</span>}
        </h3>
        {onCancel && (
          <motion.button type="button" onClick={onCancel} whileHover={{ y:-2 }} whileTap={{ scale:.92 }} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] text-[var(--pv-text-dim)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60">
            <X className="h-3.5 w-3.5" /> Close
          </motion.button>
        )}
      </div>
      <Field label="Title" htmlFor="prompt-title" icon={Type} required>
        <motion.input id="prompt-title" name="title" value={form.title} onChange={change} required placeholder="e.g. Blog Post Outline Generator" className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none" whileFocus={{ scale:1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
      </Field>
      <Field label="Description" htmlFor="prompt-description" icon={FileText} optional>
        <motion.input id="prompt-description" name="description" value={form.description} onChange={change} placeholder="Short summary of what this prompt does" className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none" whileFocus={{ scale:1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
      </Field>
      <Field label="Content" htmlFor="prompt-content" icon={FileText} required>
        <motion.textarea id="prompt-content" name="content" value={form.content} onChange={change} rows={7} required placeholder="Full prompt content..." className="w-full resize-y pl-10 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm font-mono focus:outline-none" whileFocus={{ scale:1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
      </Field>
      <div className="flex flex-col md:flex-row gap-5">
        <Field label="Category" htmlFor="prompt-category" icon={Layers3} className="flex-1">
          <motion.input id="prompt-category" name="category" value={form.category} onChange={change} placeholder="e.g. Marketing" className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none" whileFocus={{ scale:1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
        </Field>
        <Field label="Tags (comma)" htmlFor="prompt-tags" icon={TagIcon} className="flex-1" optional>
          <motion.input id="prompt-tags" name="tags" value={form.tags} onChange={change} placeholder="chatgpt, code, seo" className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none" whileFocus={{ scale:1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} />
        </Field>
      </div>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Prompt visibility">
        <span className="text-[11px] uppercase tracking-wide text-[var(--pv-text-dim)] font-medium">Visibility</span>
        <div className="inline-flex rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] p-1 gap-1 w-fit">
          <VisButton active={form.visibility==='public'} icon={Eye} label="Public" description="Anyone can view" onClick={()=> setForm(f=>({...f, visibility:'public'}))} />
          <VisButton active={form.visibility==='private'} icon={EyeOff} label="Private" description="Only you" onClick={()=> setForm(f=>({...f, visibility:'private'}))} />
        </div>
      </div>
      {!existing && allowCollectionSelect && (
        <div className="flex flex-col gap-1 text-[var(--pv-text-dim)] text-sm">
          <label htmlFor="prompt-add-collection" className="text-[11px] uppercase tracking-wide font-medium">Add to Collection <span className="font-normal lowercase text-[var(--pv-text-dim)]">(optional)</span></label>
          {collectionsLoading ? (
            <div className="text-[11px] text-[var(--pv-text-dim)] mt-1">Loading collections...</div>
          ) : collections.length === 0 ? (
            <div className="text-[11px] text-[var(--pv-text-dim)] mt-1">No collections yet.</div>
          ) : (
            <motion.select id="prompt-add-collection" value={selectedCollection} onChange={e=>setSelectedCollection(e.target.value)} className="w-full pl-3 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none" whileFocus={{ scale:1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }}>
              <option value="">-- None --</option>
              {collections.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
            </motion.select>
          )}
        </div>
      )}
      <AnimatePresence>{error && (
        <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} className="form-error text-xs flex items-center gap-2" role="alert">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          {error}
        </motion.div>
      )}</AnimatePresence>
      <div className="flex flex-wrap gap-3 pt-1">
        <motion.button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] font-medium text-sm tracking-wide hover:brightness-110 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60" whileHover={{ y:-2 }} whileTap={{ scale:.95 }} transition={{ duration:.18, ease:'easeOut' }}>
          {loading? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{loading? 'Saving…' : existing? 'Save Changes':'Create Prompt'}</span>
        </motion.button>
        {onCancel && (
          <motion.button type="button" onClick={onCancel} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] text-sm text-[var(--pv-text-dim)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60" whileHover={{ y:-2 }} whileTap={{ scale:.95 }} transition={{ duration:.18, ease:'easeOut' }}>
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

// Reusable field wrapper with icon slot
const Field = ({ label, htmlFor, icon:Icon, children, required, optional, className='' }) => (
  <div className={`flex flex-col gap-1 text-[var(--pv-text-dim)] text-sm ${className}`}>
    <label htmlFor={htmlFor} className="text-[11px] uppercase tracking-wide font-medium">
      {label} {required && <span className="text-red-400" aria-hidden="true">*</span>} {optional && <span className="font-normal lowercase opacity-70">(optional)</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)]" />}
      {children}
    </div>
  </div>
);

// Segmented visibility button
const VisButton = ({ active, icon:Icon, label, description, onClick }) => (
  <button type="button" role="radio" aria-checked={active} onClick={onClick} className={`relative px-3 py-2 rounded-md text-xs font-medium inline-flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 ${active? 'bg-[var(--pv-orange)] text-[var(--pv-black)] shadow-sm':'bg-[var(--pv-surface)] text-[var(--pv-text-dim)] hover:bg-[var(--pv-surface-hover)]'}`}>
    <Icon className="h-4 w-4" />
    <span className="flex flex-col text-left leading-tight">
      <span>{label}</span>
      <span className="text-[9px] font-normal opacity-70 -mt-0.5">{description}</span>
    </span>
    {active && (
      <motion.span layoutId="prompt-vis-pill" className="absolute inset-0 rounded-md -z-10" transition={{ type:'spring', stiffness:300, damping:30 }} />
    )}
  </button>
);

export default PromptForm;
