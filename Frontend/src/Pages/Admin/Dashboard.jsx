import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPlatformStats } from '../../Services/Admin.service';

export default function Dashboard(){
  const [stats, setStats] = useState(null); const [error, setError] = useState(null); const [loading, setLoading]= useState(true);
  useEffect(()=>{ let mounted=true; (async()=>{ try { const res = await getPlatformStats(); if(mounted) setStats(res.data); } catch(e){ setError(e?.error?.message||'Failed to load'); } finally { if(mounted) setLoading(false);} })(); return ()=>{ mounted=false; }; },[]);
  if (loading) return <div className="text-sm text-[var(--pv-text-dim)]">Loading platform stats...</div>;
  if (error) return <div className="form-error text-sm">{error}</div>;
  if (!stats) return null;
  const cards = [
    { label:'Users', value: stats.users },
    { label:'Prompts', value: stats.prompts },
    { label:'Collections', value: stats.collections },
    { label:'Views', value: stats.totals?.views||0 },
    { label:'Likes', value: stats.totals?.likes||0 },
    { label:'Favorites', value: stats.totals?.favorites||0 },
    { label:'Remixes', value: stats.totals?.remixes||0 },
  ];
  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {cards.map(c=> (
          <motion.div key={c.label} whileHover={{ y:-4 }} className="p-4 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-[var(--pv-text-dim)]">{c.label}</span>
            <span className="text-lg font-semibold">{c.value}</span>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-5 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]">
          <h3 className="text-sm font-semibold mb-4">Prompts (last 7 days)</h3>
          <ul className="text-[11px] space-y-1">
            {stats.recent?.promptsPerDay?.map(d=> <li key={d.date} className="flex justify-between"><span className="text-[var(--pv-text-dim)]">{d.date}</span><span>{d.count}</span></li>) || <li>No data</li>}
          </ul>
        </div>
        <div className="p-5 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]">
          <h3 className="text-sm font-semibold mb-4">Users (last 7 days)</h3>
            <ul className="text-[11px] space-y-1">
              {stats.recent?.usersPerDay?.map(d=> <li key={d.date} className="flex justify-between"><span className="text-[var(--pv-text-dim)]">{d.date}</span><span>{d.count}</span></li>) || <li>No data</li>}
            </ul>
        </div>
      </div>
    </div>
  );
}
