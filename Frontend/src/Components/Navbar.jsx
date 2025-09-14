import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, Layers3, Home, FolderOpen, FileText, PlusCircle, Shield, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/"); };

  const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
  // Close on route change
  useEffect(()=>{ setMobileOpen(false); }, [location.pathname]);
  // Escape key
  useEffect(()=>{ const onKey = e=>{ if(e.key==='Escape') setMobileOpen(false); }; if(mobileOpen) window.addEventListener('keydown', onKey); return ()=>window.removeEventListener('keydown', onKey); }, [mobileOpen]);

  const navItems = useMemo(()=>[
    { to:'/', label:'Home', icon: Home, end:true },
    { to:'/prompts', label:'Browse', icon: Search, end:true },
    ...(user? [{ to:'/prompts/mine', label:'My Prompts', icon: FileText }] : []),
    { to:'/collections', label:'Collections', icon: FolderOpen, end:true },
    ...(user? [{ to:'/collections/mine', label:'My Collections', icon: Layers3 }] : []),
    ...(user?.role==='admin'? [{ to:'/admin', label:'Admin', icon: Shield, end:true }] : []),
    ...(user? [{ to:'/profile', label:'My Profile', icon: User }] : [])
  ],[user]);

  const showNewPrompt = user && location.pathname.startsWith('/prompts/mine');
  const showNewCollection = user && location.pathname.startsWith('/collections/mine');

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur anim-fade-in" aria-label="Primary navigation">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-6">
            <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }} transition={{ type:'spring', stiffness:260, damping:18 }}>
              <Link to="/" className="text-lg font-semibold brand-glow bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 rounded-md px-1">PromptVault</Link>
            </motion.div>
            <motion.button whileTap={{ scale:.9 }} onClick={toggleMobile} aria-label="Toggle navigation" aria-expanded={mobileOpen} className="inline-flex sm:hidden relative w-10 h-10 items-center justify-center rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
            <nav className="hidden sm:flex items-center gap-1 text-sm" aria-label="Main">
              {navItems.map(item=> <DesktopNavLink key={item.to} item={item} />)}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {showNewPrompt && (
              <motion.div whileHover={{ y:-2 }} whileTap={{ scale:.96 }}>
                <Link to="/prompts/mine" state={{ openForm:true }} className="btn btn-ghost hidden sm:inline-flex items-center gap-1 text-sm"><PlusCircle className="h-4 w-4" /> New Prompt</Link>
              </motion.div>
            )}
            {showNewCollection && (
              <motion.div whileHover={{ y:-2 }} whileTap={{ scale:.96 }}>
                <Link to="/collections/mine" state={{ openForm:true }} className="btn btn-ghost hidden sm:inline-flex items-center gap-1 text-sm"><PlusCircle className="h-4 w-4" /> New Collection</Link>
              </motion.div>
            )}
            {!user && (
              <motion.div whileHover={{ y:-2 }} whileTap={{ scale:.96 }}>
                <Link to="/auth" className="btn btn-primary text-sm">Login / Register</Link>
              </motion.div>
            )}
            {user && (
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ y:-2 }} whileTap={{ scale:.95 }} className="flex">
                  <Link to={`/users/${user.id || user._id}`} className="flex items-center gap-2 text-sm text-[var(--pv-text-dim)] hover:text-[var(--pv-white)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 rounded-md px-1" title="Public profile">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)] text-[var(--pv-black)] flex items-center justify-center font-semibold">
                      {(user.name || user.email || '?').slice(0,1).toUpperCase()}
                    </span>
                    <span className="hidden sm:inline-block max-w-[140px] truncate">{user.name || user.email}</span>
                  </Link>
                </motion.div>
                <motion.button whileHover={{ y:-2 }} whileTap={{ scale:.92 }} onClick={handleLogout} className="inline-flex items-center gap-1 btn btn-secondary text-sm px-3 py-1.5">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="nav-overlay" initial={{ opacity:0 }} animate={{ opacity:.5 }} exit={{ opacity:0 }} transition={{ duration:.25 }} onClick={()=>setMobileOpen(false)} className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm" />
            <motion.nav key="nav-panel" initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:.35, ease:[0.4,0,0.2,1] }} className="absolute left-0 right-0 top-14 z-30 mx-auto w-full max-w-7xl px-4 md:px-6" aria-label="Mobile">
              <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/95 backdrop-blur-sm shadow-lg overflow-hidden">
                <ul className="grid gap-1 py-3 text-sm list-none m-0" role="list">
                  {navItems.map(item=> <MobileNavLink key={item.to} item={item} onNavigate={()=> setMobileOpen(false)} />)}
                  {!user && (
                    <li className="px-3 pt-2">
                      <Link to="/auth" onClick={()=> setMobileOpen(false)} className="w-full inline-flex justify-center rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] px-4 py-2 font-medium text-sm hover:brightness-110">Login / Register</Link>
                    </li>
                  )}
                  {user && (
                    <li className="flex gap-2 px-3 pt-2">
                      <Link to={`/users/${user.id || user._id}`} onClick={()=> setMobileOpen(false)} className="flex-1 inline-flex justify-center rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] px-4 py-2 text-xs font-medium hover:bg-[var(--pv-surface-hover)]">Public Profile</Link>
                      <button onClick={()=>{ handleLogout(); setMobileOpen(false); }} className="flex-1 inline-flex justify-center rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] px-4 py-2 text-xs font-medium hover:brightness-110">Logout</button>
                    </li>
                  )}
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

const DesktopNavLink = ({ item }) => (
  <NavLink to={item.to} end={item.end} className={({ isActive }) => `relative px-3 py-2 rounded-md inline-flex items-center gap-2 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 transition-colors ${isActive? 'text-[var(--pv-orange)] font-semibold':'text-[var(--pv-text-dim)] hover:text-[var(--pv-white)]'}`}>
    {({ isActive })=> {
      const Icon = item.icon;
      return <>
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
        {isActive && <motion.span layoutId="nav-active-underline" className="absolute inset-x-2 bottom-1 h-px bg-[var(--pv-orange)]" />}
      </>;
    }}
  </NavLink>
);

const MobileNavLink = ({ item, onNavigate }) => (
  <NavLink to={item.to} end={item.end} onClick={onNavigate} className={({ isActive }) => `mx-2 rounded-md px-3 py-2 flex items-center justify-between gap-2 transition-colors ${isActive? 'bg-[var(--pv-surface-alt)] text-[var(--pv-orange)] font-semibold':'text-[var(--pv-text-dim)] hover:text-[var(--pv-white)] hover:bg-[var(--pv-surface-alt)]'}`}>
    {({ isActive })=> { const Icon = item.icon; return <>
      <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4" /> {item.label}</span>
      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[var(--pv-orange)]" />}
    </>; }}
  </NavLink>
);

export default Navbar;
