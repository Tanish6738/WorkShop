import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const linkBase = 'px-3 py-2 rounded-md text-xs font-medium transition-colors';

export default function AdminLayout(){
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, ease:[0.4,0,0.2,1] }} className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">Admin</h1>
      <nav className="mt-6 flex flex-wrap gap-2 border-b border-[var(--pv-border)] pb-4">
        <NavLink to="/admin" end className={({isActive})=> `${linkBase} ${isActive? 'bg-[var(--pv-orange)] text-[var(--pv-black)]' : 'bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}>Dashboard</NavLink>
        <NavLink to="/admin/users" className={({isActive})=> `${linkBase} ${isActive? 'bg-[var(--pv-orange)] text-[var(--pv-black)]' : 'bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}>Users</NavLink>
        <NavLink to="/admin/prompts" className={({isActive})=> `${linkBase} ${isActive? 'bg-[var(--pv-orange)] text-[var(--pv-black)]' : 'bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}>Prompts</NavLink>
        <NavLink to="/admin/collections" className={({isActive})=> `${linkBase} ${isActive? 'bg-[var(--pv-orange)] text-[var(--pv-black)]' : 'bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}>Collections</NavLink>
      </nav>
      <div className="mt-8"><Outlet /></div>
    </motion.div>
  );
}
