import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Globe2, Layers3 } from 'lucide-react';

const CollectionCard = ({ collection }) => {
  const id = collection._id || collection.id;
  const promptCount = collection.promptIds?.length || 0;
  const isPrivate = collection.visibility === 'private';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.4,0,0.2,1] }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.97 }}
      className="group relative"
    >
      <Link
        to={`/collections/${id}`}
        className="block h-full rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/90 px-5 py-4 no-underline outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-black)] transition-colors overflow-hidden"
        aria-label={`Open collection ${collection.name}`}
      >
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-[radial-gradient(circle_at_22%_18%,rgba(255,160,0,.20),transparent_70%)]" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start gap-2 mb-2">
            <h4 className="m-0 text-base font-semibold tracking-tight text-[var(--pv-white)] group-hover:text-[var(--pv-saffron)] transition-colors flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-[var(--pv-text-dim)] group-hover:text-[var(--pv-orange)] transition-colors"><Layers3 className="h-4 w-4" /></span>
              {collection.name}
            </h4>
            {isPrivate && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg-alt)]/70 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--pv-text-dim)]">
                <Lock className="h-3 w-3" /> Private
              </span>
            )}
            {!isPrivate && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg-alt)]/70 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--pv-saffron)]">
                <Globe2 className="h-3 w-3" /> Public
              </span>
            )}
          </div>
          {collection.description && (
            <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-[var(--pv-text-dim)]">
              {collection.description}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-4 text-[11px] font-medium text-[var(--pv-text-dim)]">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--pv-orange)] animate-pulse" />
              {promptCount} {promptCount === 1 ? 'prompt' : 'prompts'}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--pv-text-dim)]/40" />
              {isPrivate? 'Restricted access':'World readable'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CollectionCard;
