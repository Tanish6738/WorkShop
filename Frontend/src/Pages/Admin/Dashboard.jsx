import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlatformStats } from '../../Services/Admin.service';
import { Users, FileText, FolderOpen, Eye, Heart, Star, Repeat2, Activity } from 'lucide-react';

export default function Dashboard(){
  const [stats, setStats] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading]= useState(true);

  useEffect(()=>{ let mounted=true; (async()=>{ try { const res = await getPlatformStats(); if(mounted) setStats(res.data); } catch(e){ setError(e?.error?.message||'Failed to load'); } finally { if(mounted) setLoading(false);} })(); return ()=>{ mounted=false; }; },[]);

  const cards = useMemo(()=> stats ? [
    { label:'Users', value: stats.users, icon: Users },
    { label:'Prompts', value: stats.prompts, icon: FileText },
    { label:'Collections', value: stats.collections, icon: FolderOpen },
    { label:'Views', value: stats.totals?.views||0, icon: Eye },
    { label:'Likes', value: stats.totals?.likes||0, icon: Heart },
    { label:'Favorites', value: stats.totals?.favorites||0, icon: Star },
    { label:'Remixes', value: stats.totals?.remixes||0, icon: Repeat2 }
  ]: [], [stats]);

  if (loading) return <div className="text-sm text-[var(--pv-text-dim)]">Loading platform stats...</div>;
  if (error) return <div className="form-error text-sm">{error}</div>;
  if (!stats) return null;

  return (
    <main aria-labelledby="admin-dashboard-heading" className="relative px-5 md:px-6 py-8 max-w-7xl mx-auto">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.04]" />
      </div>
      <header className="mb-10 space-y-3">
        <h1 id="admin-dashboard-heading" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]"><Activity className="h-6 w-6 text-[var(--pv-orange)]" /></span>
          Platform Overview
        </h1>
        <p className="text-sm md:text-base text-[var(--pv-text-dim)] max-w-2xl leading-relaxed">High-level activity and growth metrics across users, prompts, collections, and engagement signals.</p>
      </header>
      <section aria-labelledby="stats-cards-heading" className="space-y-10">
        <h2 id="stats-cards-heading" className="sr-only">Key metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {cards.map(c=> {
            const Icon = c.icon;
            return (
              <motion.div key={c.label} whileHover={{ y:-4 }} whileTap={{ scale:.97 }} className="relative p-4 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] flex flex-col gap-2 overflow-hidden group">
                <div aria-hidden="true" className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[var(--pv-orange)]/5 via-transparent to-transparent" />
                <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--pv-text-dim)] font-medium">
                  <Icon className="h-3.5 w-3.5 text-[var(--pv-orange)]" /> {c.label}
                </span>
                <span className="text-lg font-semibold tracking-tight">{c.value}</span>
              </motion.div>
            );
          })}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }} className="p-5 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]">
            <h3 className="text-sm font-semibold mb-4">Prompts (last 7 days)</h3>
            <ul className="text-[11px] space-y-1">
              {stats.recent?.promptsPerDay?.length ? stats.recent.promptsPerDay.map(d=> <li key={d.date} className="flex justify-between"><span className="text-[var(--pv-text-dim)]">{d.date}</span><span className="font-medium">{d.count}</span></li>) : <li className="text-[var(--pv-text-dim)]">No data</li>}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.05 }} className="p-5 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]">
            <h3 className="text-sm font-semibold mb-4">Users (last 7 days)</h3>
            <ul className="text-[11px] space-y-1">
              {stats.recent?.usersPerDay?.length ? stats.recent.usersPerDay.map(d=> <li key={d.date} className="flex justify-between"><span className="text-[var(--pv-text-dim)]">{d.date}</span><span className="font-medium">{d.count}</span></li>) : <li className="text-[var(--pv-text-dim)]">No data</li>}
            </ul>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
