import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listUsers, banUser, unbanUser, changeUserRole, bulkBan, bulkUnban, bulkUserRole } from '../../Services/Admin.service';

export default function Users(){
  const [data, setData] = useState({ items:[], page:1, total:0, limit:20 });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selection, setSelection] = useState([]);

  const load = async (page=1)=>{
    setLoading(true); setError(null);
    try { const res = await listUsers({ page, q, stats:'true'}); if(res?.data) setData(res.data); }
    catch(e){ setError(e?.error?.message||'Failed'); }
    finally{ setLoading(false); }
  };
  useEffect(()=>{ load(1); },[]);

  const toggleSel = (id)=> setSelection(s=> s.includes(id)? s.filter(x=>x!==id): [...s,id]);
  const allSelected = data.items.length>0 && selection.length===data.items.length;
  const toggleAll = ()=> setSelection(allSelected? [] : data.items.map(i=> i._id));

  const act = async (fn, ...args)=>{ try { await fn(...args); await load(data.page); setSelection([]);} catch(e){ /* ignore */ } };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wide text-[var(--pv-text-dim)]">Search</label>
          <input value={q} onChange={e=> setQ(e.target.value)} onKeyDown={e=> { if(e.key==='Enter') load(1); }} placeholder="Name or email" className="px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60" />
        </div>
        <button onClick={()=> load(1)} className="mt-5 px-4 py-2 rounded-md text-xs font-medium bg-[var(--pv-orange)] text-[var(--pv-black)]">Apply</button>
        {selection.length>0 && (
          <div className="flex gap-2 items-center mt-5">
            <button onClick={()=> act(bulkBan, selection)} className="px-3 py-2 rounded-md text-[11px] font-medium bg-red-600/80 hover:bg-red-600 text-white">Ban ({selection.length})</button>
            <button onClick={()=> act(bulkUnban, selection)} className="px-3 py-2 rounded-md text-[11px] font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Unban</button>
            <button onClick={()=> act(bulkUserRole, selection, 'admin')} className="px-3 py-2 rounded-md text-[11px] font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Make Admin</button>
            <button onClick={()=> act(bulkUserRole, selection, 'user')} className="px-3 py-2 rounded-md text-[11px] font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Set User</button>
          </div>
        )}
      </div>
      {loading && <div className="text-sm text-[var(--pv-text-dim)]">Loading users...</div>}
      {error && <div className="form-error text-sm">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto border border-[var(--pv-border)] rounded-xl">
          <table className="w-full text-xs">
            <thead className="bg-[var(--pv-surface-alt)]/60">
              <tr className="text-[10px] uppercase tracking-wide text-left">
                <th className="px-3 py-2"><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Prompts</th>
                <th className="px-3 py-2">Collections</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map(u=> (
                <motion.tr key={u._id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="border-t border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]/40">
                  <td className="px-3 py-2 align-top"><input type="checkbox" checked={selection.includes(u._id)} onChange={()=> toggleSel(u._id)} /></td>
                  <td className="px-3 py-2 align-top font-medium">{u.name}</td>
                  <td className="px-3 py-2 align-top">{u.email}</td>
                  <td className="px-3 py-2 align-top">{u.role}</td>
                  <td className="px-3 py-2 align-top">{u.promptCount ?? '-'}</td>
                  <td className="px-3 py-2 align-top">{u.collectionCount ?? '-'}</td>
                  <td className="px-3 py-2 align-top">{u.banned? <span className="text-red-400">Banned</span>: <span className="text-green-400">Active</span>}</td>
                  <td className="px-3 py-2 align-top flex gap-2 flex-wrap">
                    {u.banned? (
                      <button onClick={()=> act(unbanUser, u._id)} className="px-2 py-1 rounded bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)] text-[10px]">Unban</button>
                    ) : (
                      <button onClick={()=> act(banUser, u._id)} className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-[10px]">Ban</button>
                    )}
                    {u.role==='admin'? (
                      <button onClick={()=> act(changeUserRole, u._id, 'user')} className="px-2 py-1 rounded bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)] text-[10px]">Set User</button>
                    ) : (
                      <button onClick={()=> act(changeUserRole, u._id, 'admin')} className="px-2 py-1 rounded bg-[var(--pv-orange)] text-[var(--pv-black)] text-[10px]">Make Admin</button>
                    )}
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
