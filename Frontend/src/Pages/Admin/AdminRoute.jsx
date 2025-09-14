import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { Shield } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="relative px-6 py-16 flex flex-col items-center justify-center gap-6" aria-busy="true" aria-live="polite">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[50rem] h-[50rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.05]" />
        </div>
        <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ type:'spring', stiffness:160, damping:18 }} className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] flex items-center justify-center overflow-hidden">
              <motion.div className="absolute inset-0 bg-gradient-to-tr from-[var(--pv-orange)]/15 via-transparent to-transparent" animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:8, ease:'linear' }} />
              <motion.div className="h-6 w-6 text-[var(--pv-orange)]" animate={{ rotate:[0,0,10,-10,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}>
                <Shield className="h-6 w-6" />
              </motion.div>
            </div>
            <motion.span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[var(--pv-orange)] text-[var(--pv-black)] text-[10px] font-bold flex items-center justify-center shadow shadow-[var(--pv-orange)]/40" initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:.25, type:'spring', stiffness:200, damping:18 }}>⚡</motion.span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-[var(--pv-text)]">Preparing secure admin space</p>
            <p className="text-[11px] text-[var(--pv-text-dim)]">Verifying your session & role…</p>
          </div>
          <motion.div className="flex gap-1" initial="hidden" animate="visible" variants={{ visible:{ transition:{ staggerChildren:.14 } } }}>
            {[0,1,2].map(i=> (
              <motion.span key={i} className="h-1.5 w-8 rounded-full bg-[var(--pv-orange)]/40 overflow-hidden relative" variants={{ hidden:{ opacity:0, y:6 }, visible:{ opacity:1, y:0 } }}>
                <motion.span className="absolute inset-0 bg-[var(--pv-orange)]" initial={{ x:'-100%' }} animate={{ x:['-100%','100%'] }} transition={{ repeat:Infinity, duration:1.8, delay:i*.25, ease:'easeInOut' }} />
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminRoute;
