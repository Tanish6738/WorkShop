import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, FileText, FolderOpen } from 'lucide-react';

const base = 'relative px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-black)]';

const navItems = [
  { to:'/admin', end:true, label:'Dashboard', icon: LayoutGrid },
  { to:'/admin/users', label:'Users', icon: Users },
  { to:'/admin/prompts', label:'Prompts', icon: FileText },
  { to:'/admin/collections', label:'Collections', icon: FolderOpen },
];

export default function AdminLayout(){
  return (
    <motion.main initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55, ease:[0.4,0,0.2,1] }} className="relative px-5 md:px-6 py-8 max-w-7xl mx-auto" aria-labelledby="admin-root-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[65rem] h-[65rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_72%)] opacity-[0.035]" />
      </div>
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] flex items-center justify-center relative overflow-hidden">
            <motion.div className="absolute inset-0 bg-gradient-to-tr from-[var(--pv-orange)]/15 via-transparent to-transparent" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }} />
            <LayoutGrid className="h-6 w-6 text-[var(--pv-orange)]" />
          </div>
          <div>
            <h1 id="admin-root-heading" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">Admin Console</h1>
            <p className="mt-1 text-[11px] md:text-xs text-[var(--pv-text-dim)]">Observe, moderate and optimize the platform.</p>
          </div>
        </div>
        <nav aria-label="Admin sections" className="flex flex-wrap gap-1.5 pt-2 border-b border-[var(--pv-border)] pb-4">
          {navItems.map(item=> {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={({isActive})=> `${base} ${isActive? 'bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)] shadow-sm shadow-[var(--pv-orange)]/30':'bg-[var(--pv-surface-alt)] border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'} `}>
                {({isActive})=> (
                  <>
                    <Icon className={`h-4 w-4 ${isActive? '':'text-[var(--pv-text-dim)] group-hover:text-[var(--pv-text)]'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span layoutId="admin-active-pill" className="absolute inset-0 rounded-lg -z-10" transition={{ type:'spring', stiffness:300, damping:30 }} />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </header>
      <div className="mt-4" id="admin-outlet-region">
        <Outlet />
      </div>
    </motion.main>
  );
}
