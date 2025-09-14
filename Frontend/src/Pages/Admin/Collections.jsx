import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listAllCollections, deleteCollectionAdmin, bulkDeleteCollections } from '../../Services/Admin.service';
import { Search, Eye, EyeOff, Trash2, FolderOpen, Filter } from 'lucide-react';

export default function AdminCollections(){
  const [data, setData] = useState({ items:[], page:1, limit:50, total:0 });
  const [q, setQ] = useState('');
  const [visibility, setVisibility] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selection, setSelection] = useState([]);

  const load = useCallback(async (page=1)=>{ setLoading(true); setError(null); try { const res = await listAllCollections({ page, q, visibility }); if(res?.data) setData(res.data); } catch(e){ setError(e?.error?.message||'Failed'); } finally { setLoading(false);} },[q, visibility]);
  useEffect(()=>{ load(1); },[load]);
  const toggleSel = useCallback((id)=> setSelection(s=> s.includes(id)? s.filter(x=>x!==id): [...s,id]),[]);
  const allSelected = data.items.length>0 && selection.length===data.items.length;
  const toggleAll = ()=> setSelection(allSelected? []: data.items.map(i=> i._id));
  const act = async (fn, ...args)=>{ try { await fn(...args); await load(data.page); setSelection([]);} catch(_){} };

  const meta = useMemo(()=>({ heading:'Manage Collections', sub:'Moderate and curate collections across the platform.' }),[]);

  return (
    <main aria-labelledby="admin-collections-heading" className="relative px-5 md:px-6 py-8 max-w-7xl mx-auto">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.04]" />
      </div>
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
        <div className="max-w-2xl">
          <h1 id="admin-collections-heading" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]"><FolderOpen className="h-6 w-6 text-[var(--pv-orange)]" /></span>
            {meta.heading}
          </h1>
          <p className="mt-2 text-sm md:text-base text-[var(--pv-text-dim)] leading-relaxed">{meta.sub}</p>
        </div>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-[var(--pv-text-dim)]">Search</label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)]" />
              <input value={q} onChange={e=> setQ(e.target.value)} onKeyDown={e=> { if(e.key==='Enter') load(1); }} placeholder="Name or description" className="pl-9 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 w-60" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-[var(--pv-text-dim)]">Visibility</label>
            <div className="flex gap-1">
              <button onClick={()=> setVisibility('')} className={`px-3 py-2 rounded-md text-[11px] font-medium border flex items-center gap-1 ${visibility===''? 'bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]':'bg-[var(--pv-surface-alt)] border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}> <Filter className="h-3.5 w-3.5" /> All</button>
              <button onClick={()=> setVisibility('public')} className={`px-3 py-2 rounded-md text-[11px] font-medium border flex items-center gap-1 ${visibility==='public'? 'bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]':'bg-[var(--pv-surface-alt)] border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}> <Eye className="h-3.5 w-3.5" /> Public</button>
              <button onClick={()=> setVisibility('private')} className={`px-3 py-2 rounded-md text-[11px] font-medium border flex items-center gap-1 ${visibility==='private'? 'bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]':'bg-[var(--pv-surface-alt)] border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}> <EyeOff className="h-3.5 w-3.5" /> Private</button>
            </div>
          </div>
          <button onClick={()=> load(1)} className="px-4 py-2 rounded-md text-xs font-medium bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110">Apply</button>
          {selection.length>0 && (
            <AnimatePresence initial={false}>
              <motion.div key="bulk" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} className="flex gap-2 items-center bg-[var(--pv-surface-alt)]/60 border border-[var(--pv-border)] rounded-lg px-3 py-2">
                <span className="text-[10px] font-medium text-[var(--pv-text-dim)]">{selection.length} selected</span>
                <button onClick={()=> act(bulkDeleteCollections, selection)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-[10px]"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                <button onClick={()=> setSelection([])} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[var(--pv-border)] bg-[var(--pv-surface)] hover:bg-[var(--pv-surface-hover)] text-[10px]">Clear</button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </header>
      <div className="space-y-6">
        {loading && <div className="text-sm text-[var(--pv-text-dim)]">Loading collections...</div>}
        {error && <div className="form-error text-sm">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto border border-[var(--pv-border)] rounded-xl shadow-sm">
            <table className="w-full text-xs">
              <thead className="bg-[var(--pv-surface-alt)]/60">
                <tr className="text-[10px] uppercase tracking-wide text-left">
                  <th className="px-3 py-2"><input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all collections" /></th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Author</th>
                  <th className="px-3 py-2">Visibility</th>
                  <th className="px-3 py-2">Prompts</th>
                  <th className="px-3 py-2" aria-label="Row actions"></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map(c=> (
                  <motion.tr key={c._id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="border-t border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]/40">
                    <td className="px-3 py-2 align-top"><input type="checkbox" checked={selection.includes(c._id)} onChange={()=> toggleSel(c._id)} aria-label={`Select collection ${c.name}`} /></td>
                    <td className="px-3 py-2 align-top font-medium max-w-[240px] truncate">{c.name}</td>
                    <td className="px-3 py-2 align-top text-[var(--pv-text-dim)]">{c.createdBy}</td>
                    <td className="px-3 py-2 align-top">{c.visibility}</td>
                    <td className="px-3 py-2 align-top">{c.promptIds?.length||0}</td>
                    <td className="px-3 py-2 align-top">
                      <button onClick={()=> act(deleteCollectionAdmin, c._id)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-[10px]"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                    </td>
                  </motion.tr>
                ))}
                {data.items.length===0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-[11px] text-[var(--pv-text-dim)]">No collections found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
