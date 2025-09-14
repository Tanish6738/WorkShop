import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Eye, Tag } from 'lucide-react';

const PromptCard = ({ prompt }) => {
  const id = prompt._id || prompt.id;
  const likes = prompt.stats?.likes ?? 0;
  const views = prompt.stats?.views ?? 0;
  const category = prompt.category || 'General';
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:.35, ease:'easeOut' }} whileHover={{ y:-4 }} whileTap={{ scale:.97 }} className="group relative">
      <Link to={`/prompts/${id}`} className="block h-full rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/90 px-5 py-4 no-underline outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-black)] transition-colors" aria-label={`Open prompt ${prompt.title}`}>
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_80%_20%,rgba(255,160,0,.15),transparent_70%)]" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start mb-2">
            <h4 className="m-0 text-base font-semibold tracking-tight text-[var(--pv-white)] group-hover:text-[var(--pv-orange)] transition-colors line-clamp-2">
              {prompt.title}
            </h4>
          </div>
          {prompt.description && (
            <p className="mb-3 text-xs leading-relaxed text-[var(--pv-text-dim)] line-clamp-3">{prompt.description}</p>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-4 text-[11px] font-medium text-[var(--pv-text-dim)]">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-[var(--pv-saffron)]" />
              {category}
            </span>
            <span className="inline-flex items-center gap-1 text-[var(--pv-orange)]">
              <Star className="h-3.5 w-3.5" />
              {likes}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 opacity-80" />
              {views}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PromptCard;
