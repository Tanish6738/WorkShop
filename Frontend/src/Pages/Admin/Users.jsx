import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listUsers, banUser, unbanUser, changeUserRole, bulkBan, bulkUnban, bulkUserRole } from '../../Services/Admin.service';
import { Search, UserX, UserCheck, Shield, ShieldOff, RefreshCcw, Users as UsersIcon, Trash2 } from 'lucide-react';

export default function Users(){
  const [data, setData] = useState({ items:[], page:1, total:0, limit:20 });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selection, setSelection] = useState([]);

  const load = useCallback(async (page=1)=>{
    setLoading(true); setError(null);
    try { const res = await listUsers({ page, q, stats:'true'}); if(res?.data) setData(res.data); }
    catch(e){ setError(e?.error?.message||'Failed'); }
    finally{ setLoading(false); }
  },[q]);
  useEffect(()=>{ load(1); },[load]);

  const toggleSel = useCallback((id)=> setSelection(s=> s.includes(id)? s.filter(x=>x!==id): [...s,id]),[]);
  const allSelected = data.items.length>0 && selection.length===data.items.length;
  const toggleAll = ()=> setSelection(allSelected? [] : data.items.map(i=> i._id));
  const act = async (fn, ...args)=>{ try { await fn(...args); await load(data.page); setSelection([]);} catch(_){} };

  const meta = useMemo(()=>({ heading:'Manage Users', sub:'Search, moderate, and adjust roles for platform users.' }),[]);

  return (
    <main aria-labelledby="admin-users-heading" className="relative px-5 md:px-6 py-8 max-w-7xl mx-auto">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.04]" />
      </div>
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
        <div className="max-w-2xl">
          <h1 id="admin-users-heading" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]">
              <UsersIcon className="h-6 w-6 text-[var(--pv-orange)]" />
            </span>
            {meta.heading}
          </h1>
          <p className="mt-2 text-sm md:text-base text-[var(--pv-text-dim)] leading-relaxed">{meta.sub}</p>
        </div>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-[var(--pv-text-dim)]">Search</label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)]" />
              <input value={q} onChange={e=> setQ(e.target.value)} onKeyDown={e=> { if(e.key==='Enter') load(1); }} placeholder="Name or email" className="pl-9 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 w-56" />
            </div>
          </div>
          <button onClick={()=> load(1)} className="px-4 py-2 rounded-md text-xs font-medium bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110">Apply</button>
          {selection.length>0 && (
            <AnimatePresence initial={false}>
              <motion.div key="bulk" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} className="flex gap-2 items-center bg-[var(--pv-surface-alt)]/60 border border-[var(--pv-border)] rounded-lg px-3 py-2">
                <span className="text-[10px] font-medium text-[var(--pv-text-dim)]">{selection.length} selected</span>
                <button onClick={()=> act(bulkBan, selection)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-[10px]"><UserX className="h-3.5 w-3.5" /> Ban</button>
                <button onClick={()=> act(bulkUnban, selection)} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[var(--pv-border)] bg-[var(--pv-surface)] hover:bg-[var(--pv-surface-hover)] text-[10px]"><UserCheck className="h-3.5 w-3.5" /> Unban</button>
                <button onClick={()=> act(bulkUserRole, selection, 'admin')} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[var(--pv-border)] bg-[var(--pv-surface)] hover:bg-[var(--pv-surface-hover)] text-[10px]"><Shield className="h-3.5 w-3.5" /> Make Admin</button>
                <button onClick={()=> act(bulkUserRole, selection, 'user')} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[var(--pv-border)] bg-[var(--pv-surface)] hover:bg-[var(--pv-surface-hover)] text-[10px]"><ShieldOff className="h-3.5 w-3.5" /> Set User</button>
                <button onClick={()=> setSelection([])} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[var(--pv-border)] bg-[var(--pv-surface)] hover:bg-[var(--pv-surface-hover)] text-[10px]"><RefreshCcw className="h-3.5 w-3.5" /> Clear</button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </header>
      <div className="space-y-6">
        {loading && <div className="text-sm text-[var(--pv-text-dim)]">Loading users...</div>}
        {error && <div className="form-error text-sm">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto border border-[var(--pv-border)] rounded-xl shadow-sm">
            <table className="w-full text-xs">
              <thead className="bg-[var(--pv-surface-alt)]/60">
                <tr className="text-[10px] uppercase tracking-wide text-left">
                  <th className="px-3 py-2"><input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all users" /></th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Prompts</th>
                  <th className="px-3 py-2">Collections</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2" aria-label="Row actions"></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map(u=> (
                  <motion.tr key={u._id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="border-t border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]/40">
                    <td className="px-3 py-2 align-top"><input type="checkbox" checked={selection.includes(u._id)} onChange={()=> toggleSel(u._id)} aria-label={`Select user ${u.name}`} /></td>
                    <td className="px-3 py-2 align-top font-medium">{u.name}</td>
                    <td className="px-3 py-2 align-top">{u.email}</td>
                    <td className="px-3 py-2 align-top">{u.role}</td>
                    <td className="px-3 py-2 align-top">{u.promptCount ?? '-'}</td>
                    <td className="px-3 py-2 align-top">{u.collectionCount ?? '-'}</td>
                    <td className="px-3 py-2 align-top">{u.banned? <span className="text-red-400 inline-flex items-center gap-1"><UserX className="h-3.5 w-3.5" /> Banned</span>: <span className="text-green-400 inline-flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" /> Active</span>}</td>
                    <td className="px-3 py-2 align-top flex gap-2 flex-wrap">
                      {u.banned? (
                        <button onClick={()=> act(unbanUser, u._id)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)] text-[10px]"><UserCheck className="h-3 w-3" /> Unban</button>
                      ) : (
                        <button onClick={()=> act(banUser, u._id)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-[10px]"><UserX className="h-3 w-3" /> Ban</button>
                      )}
                      {u.role==='admin'? (
                        <button onClick={()=> act(changeUserRole, u._id, 'user')} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)] text-[10px]"><ShieldOff className="h-3 w-3" /> Set User</button>
                      ) : (
                        <button onClick={()=> act(changeUserRole, u._id, 'admin')} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--pv-orange)] text-[var(--pv-black)] text-[10px]"><Shield className="h-3 w-3" /> Make Admin</button>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {data.items.length===0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-[11px] text-[var(--pv-text-dim)]">No users found.</td>
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
