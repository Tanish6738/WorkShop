import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PromptCard = ({ prompt }) => {
  const id = prompt._id || prompt.id;
  const likes = prompt.stats?.likes ?? 0;
  const views = prompt.stats?.views ?? 0;
  const category = prompt.category || 'General';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: .35, ease: 'easeOut' }}
      whileHover={{ y:-4 }}
      whileTap={{ scale:.97 }}
      className="group relative"
    >
      <Link
        to={`/prompts/${id}`}
        className="card hover-lift block h-full rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/90 px-5 py-4 no-underline outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-black)] transition-colors"
      >
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_80%_20%,rgba(48,195,244,.18),transparent_70%)]" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start mb-2">
            <h4 className="m-0 text-base font-semibold tracking-tight text-[var(--pv-white)] group-hover:text-[var(--pv-orange)] transition-colors line-clamp-2">
              {prompt.title}
            </h4>
          </div>
          {prompt.description && (
            <p className="mb-3 text-xs leading-relaxed text-[var(--pv-text-dim)] line-clamp-3">
              {prompt.description}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-3 text-[11px] font-medium text-[var(--pv-text-dim)]">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--pv-saffron)]" />
              {category}
            </span>
            <span className="inline-flex items-center gap-1 text-[var(--pv-orange)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M12 20l-7 3 1.9-8.3L2 9.2l8.4-.7L12 1l1.6 7.5 8.4.7-4.9 5.5L19 23z"/></svg>
              {likes}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {views}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PromptCard;
