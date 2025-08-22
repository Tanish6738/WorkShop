import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UserPrompts = ({ loading, error, prompts }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
        <span className="w-1.5 h-5 rounded bg-[var(--pv-saffron)]" />
        Public Prompts
      </h3>
      {loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_,i)=>(<div key={i} className="h-20 card shimmer rounded-lg"/>))}
        </div>
      )}
      {error && <div className="form-error text-xs">{error}</div>}
      {!loading && !error && (!prompts || prompts.length === 0) && (
        <div className="text-sm text-[var(--pv-text-dim)]">No public prompts yet.</div>
      )}
      <AnimatePresence mode="popLayout">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
          {prompts?.map(p => (
            <motion.li
              key={p._id || p.id}
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }}
              transition={{ duration:.35, ease:'easeOut' }}
              whileHover={{ y:-3 }}
              whileTap={{ scale:.97 }}
              className="card p-4 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)]/90"
            >
              <div className="flex flex-col gap-1">
                <strong className="text-sm font-semibold text-[var(--pv-white)] line-clamp-2">{p.title || 'Untitled Prompt'}</strong>
                {p.description && <span className="text-[11px] leading-snug text-[var(--pv-text-dim)] line-clamp-3">{p.description}</span>}
              </div>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
};

export default UserPrompts;
