import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CollectionCard = ({ collection }) => {
  const id = collection._id || collection.id;
  const promptCount = collection.promptIds?.length || 0;
  const isPrivate = collection.visibility === 'private';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group relative"
    >
      <Link
        to={`/collections/${id}`}
        className="card hover-lift block h-full rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/90 px-5 py-4 no-underline outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-saffron)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-black)] transition-colors"
      >
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_20%_15%,rgba(0,102,255,.15),transparent_70%)]" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start gap-2 mb-2">
            <h4 className="m-0 text-base font-semibold tracking-tight text-[var(--pv-white)] group-hover:text-[var(--pv-saffron)] transition-colors">
              {collection.name}
            </h4>
            {isPrivate && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg-alt)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--pv-text-dim)]">
                <span aria-hidden>🔒</span> Private
              </span>
            )}
          </div>
          {collection.description && (
            <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-[var(--pv-text-dim)]">
              {collection.description}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-3 text-[11px] font-medium text-[var(--pv-text-dim)]">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--pv-orange)] animate-pulse" />
              {promptCount} {promptCount === 1 ? 'prompt' : 'prompts'}
            </span>
            {!isPrivate && (
              <span className="inline-flex items-center gap-1 text-[var(--pv-saffron)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8.9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.46.46 1.12.61 1.82.33H9A1.65 1.65 0 0 0 10.6 4.6 1.65 1.65 0 0 0 11 3.09V3a2 2 0 1 1 4 0v.09c0 .65.38 1.24.97 1.51.7.28 1.36.13 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.28.7.94 1.18 1.6 1.18H21a2 2 0 1 1 0 4h-.09c-.65 0-1.24.38-1.51.97Z"/></svg>
                Public
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CollectionCard;
