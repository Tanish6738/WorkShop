import React, { useEffect, useState } from 'react';
import { listPrompts } from '../../Services/prompt.service';
import PromptCard from './PromptCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle } from 'lucide-react';

const PromptList = ({ mine=false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    let ignore = false;
    setLoading(true); setError(null);
    listPrompts({ q: query || undefined, mine: mine ? 'true' : undefined, page, limit })
      .then(r => { if (!ignore) { setItems(r.data.items); setTotal(r.data.total);} })
      .catch(e => { if (!ignore) setError(e?.error?.message || 'Failed to load'); })
      .finally(()=> !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [query, mine, page]);

  return (
    <section className="space-y-6" aria-labelledby={`prompt-list-heading-${mine? 'mine':'all'}`}>      
      <h2 id={`prompt-list-heading-${mine? 'mine':'all'}`} className="sr-only">{mine? 'My Prompts' : 'All Prompts'}</h2>
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)] pointer-events-none" />
          <input
            aria-label="Search prompts"
            placeholder="Search prompts..."
            value={query}
            onChange={e=>{ setPage(1); setQuery(e.target.value);} }
            className="w-full pl-9 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/50"
          />
        </div>
        {query && (
          <motion.button type="button" onClick={()=>{ setQuery(''); setPage(1); }} whileHover={{ y:-2 }} whileTap={{ scale:.9 }}
            className="text-[11px] px-3 py-2 rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] text-[var(--pv-text-dim)] hover:bg-[var(--pv-surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/50">
            Clear
          </motion.button>
        )}
      </div>
      <div className="min-h-6" aria-live="polite" aria-atomic="true">
        {loading && <span className="sr-only">Loading prompts…</span>}
      </div>
      {loading && (
        <div role="status" aria-label="Loading" className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_,i)=>(
            <div key={i} className="rounded-xl p-4 shimmer h-40 bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]" />
          ))}
        </div>
      )}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} role="alert" className="form-error flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4" /> {error}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!loading && !error && items.length === 0 && (
          <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} className="text-sm text-[var(--pv-text-dim)]">
            No prompts found{query? ` for "${query}"`:''}.
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        <motion.ul
          key={page + query + (mine?'-mine':'')}
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 list-none p-0 m-0"
          initial="hidden"
            animate="show"
          variants={{ hidden:{}, show:{ transition:{ staggerChildren:.05 } } }}
          role="list"
          aria-busy={loading? 'true':'false'}
        >
          {items.map(p => (
            <li key={p._id || p.id} className="contents">
              <PromptCard prompt={p} />
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      <Pagination page={page} limit={limit} total={total} onChange={setPage} />
    </section>
  );
};

const Pagination = ({ page, limit, total, onChange }) => {
  const pages = Math.ceil(total / limit) || 1; if (pages <= 1) return null;
  return (
    <nav className="flex flex-wrap gap-2 pt-2" role="navigation" aria-label="Prompts pagination">
      {Array.from({ length: pages }).map((_,i)=>{
        const n = i+1; const active = n===page;
        return (
          <motion.button
            key={n}
            onClick={()=>onChange(n)}
            type="button"
            aria-current={active? 'page':undefined}
            aria-label={active? `Page ${n}, current page` : `Go to page ${n}`}
            whileHover={!active ? { y:-2 } : undefined}
            whileTap={!active ? { scale:.9 } : undefined}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 ${active ? 'bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]' : 'bg-[var(--pv-surface)] border-[var(--pv-border)] text-[var(--pv-text-dim)] hover:text-[var(--pv-white)]'}`}
            disabled={active}
          >{n}</motion.button>
        );
      })}
    </nav>
  );
};

export default PromptList;
