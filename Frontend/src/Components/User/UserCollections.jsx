import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers3, ArrowRight } from 'lucide-react';

const UserCollections = ({ loading, error, collections }) => {
  return (
    <section className="mt-6" aria-labelledby="public-collections-heading">
      <h3 id="public-collections-heading" className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
        <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]"><Layers3 className="h-4 w-4 text-[var(--pv-orange)]" /></span>
        <span className="bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">Public Collections</span>
      </h3>
      {loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_,i)=>(<div key={i} className="h-20 card shimmer rounded-lg"/>))}
        </div>
      )}
      {error && <div className="form-error text-xs">{error}</div>}
      {!loading && !error && (!collections || collections.length === 0) && (
        <div className="text-sm text-[var(--pv-text-dim)]">No public collections yet.</div>
      )}
      <AnimatePresence mode="popLayout">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0" role="list">
          {collections?.map(c => (
            <motion.li
              key={c._id || c.id}
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }}
              transition={{ duration:.35, ease:'easeOut' }}
              whileHover={{ y:-3 }}
              whileTap={{ scale:.97 }}
              className="group card p-4 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)]/90 hover:border-[var(--pv-orange)]/60 transition-colors"
            >
              <Link to={`/collections/${c._id || c.id}`} className="flex flex-col gap-1 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 rounded-md">
                <strong className="text-sm font-semibold text-[var(--pv-white)] line-clamp-2 group-hover:text-[var(--pv-orange)] transition-colors">{c.name || 'Untitled Collection'}</strong>
                {c.description && <span className="text-[11px] leading-snug text-[var(--pv-text-dim)] line-clamp-3">{c.description}</span>}
                <span className="mt-1 text-[10px] text-[var(--pv-text-dim)] group-hover:text-[var(--pv-orange)] transition-colors inline-flex items-center gap-1">Open<ArrowRight className="h-3 w-3" /></span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </section>
  );
};

export default UserCollections;
