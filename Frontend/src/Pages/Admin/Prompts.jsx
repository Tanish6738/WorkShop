import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listAllPrompts, deletePromptAdmin, bulkDeletePrompts } from '../../Services/Admin.service';

export default function AdminPrompts(){
  const [data, setData] = useState({ items:[], page:1, limit:50, total:0 });
  const [q, setQ] = useState('');
  const [visibility, setVisibility] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selection, setSelection] = useState([]);

  const load = async (page=1)=>{ setLoading(true); setError(null); try { const res = await listAllPrompts({ page, q, visibility }); if(res?.data) setData(res.data); } catch(e){ setError(e?.error?.message||'Failed'); } finally { setLoading(false);} };
  useEffect(()=>{ load(1); },[]);
  const toggleSel = (id)=> setSelection(s=> s.includes(id)? s.filter(x=>x!==id): [...s,id]);
  const allSelected = data.items.length>0 && selection.length===data.items.length;
  const toggleAll = ()=> setSelection(allSelected? []: data.items.map(i=> i._id));
  const act = async (fn, ...args)=>{ try { await fn(...args); await load(data.page); setSelection([]);} catch(_){} };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wide text-[var(--pv-text-dim)]">Search</label>
          <input value={q} onChange={e=> setQ(e.target.value)} onKeyDown={e=> { if(e.key==='Enter') load(1); }} placeholder="Title, content..." className="px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wide text-[var(--pv-text-dim)]">Visibility</label>
          <select value={visibility} onChange={e=> setVisibility(e.target.value)} className="px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs">
            <option value=''>All</option>
            <option value='public'>Public</option>
            <option value='private'>Private</option>
          </select>
        </div>
        <button onClick={()=> load(1)} className="mt-5 px-4 py-2 rounded-md text-xs font-medium bg-[var(--pv-orange)] text-[var(--pv-black)]">Apply</button>
        {selection.length>0 && (
          <div className="flex gap-2 items-center mt-5">
            <button onClick={()=> act(bulkDeletePrompts, selection)} className="px-3 py-2 rounded-md text-[11px] font-medium bg-red-600/80 hover:bg-red-600 text-white">Delete ({selection.length})</button>
          </div>
        )}
      </div>
      {loading && <div className="text-sm text-[var(--pv-text-dim)]">Loading prompts...</div>}
      {error && <div className="form-error text-sm">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto border border-[var(--pv-border)] rounded-xl">
          <table className="w-full text-xs">
            <thead className="bg-[var(--pv-surface-alt)]/60">
              <tr className="text-[10px] uppercase tracking-wide text-left">
                <th className="px-3 py-2"><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Author</th>
                <th className="px-3 py-2">Visibility</th>
                <th className="px-3 py-2">Likes</th>
                <th className="px-3 py-2">Views</th>
                <th className="px-3 py-2">Remixes</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map(p=> (
                <motion.tr key={p._id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="border-t border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]/40">
                  <td className="px-3 py-2 align-top"><input type="checkbox" checked={selection.includes(p._id)} onChange={()=> toggleSel(p._id)} /></td>
                  <td className="px-3 py-2 align-top font-medium max-w-[240px] truncate"><a href={`/prompts/${p._id}`} className="hover:underline">{p.title}</a></td>
                  <td className="px-3 py-2 align-top text-[var(--pv-text-dim)]">{p.createdBy}</td>
                  <td className="px-3 py-2 align-top">{p.visibility}</td>
                  <td className="px-3 py-2 align-top">{p.stats?.likes||0}</td>
                  <td className="px-3 py-2 align-top">{p.stats?.views||0}</td>
                  <td className="px-3 py-2 align-top">{p.stats?.remixes||0}</td>
                  <td className="px-3 py-2 align-top">
                    <button onClick={()=> act(deletePromptAdmin, p._id)} className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-[10px]">Delete</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
