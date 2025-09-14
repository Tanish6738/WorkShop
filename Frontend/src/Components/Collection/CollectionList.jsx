import React, { useEffect, useState } from 'react';
import { listCollections } from '../../Services/collection.service';
import CollectionCard from './CollectionCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const CollectionList = ({ mine=false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(()=>{
    let ignore=false; setLoading(true); setError(null);
    listCollections({ mine: mine? 'true': undefined, page, limit })
      .then(r=>{ if(!ignore){ setItems(r.data.items); setTotal(r.data.total); }})
      .catch(e=>{ if(!ignore) setError(e?.error?.message || 'Failed to load'); })
      .finally(()=> !ignore && setLoading(false));
    return ()=>{ ignore=true; };
  },[mine,page]);

  return (
    <section className="space-y-6" aria-label={mine? 'Your collections':'Collections'}>
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" role="status" aria-live="polite" aria-busy="true">
          {Array.from({ length: 6 }).map((_,i)=>(
            <div key={i} className="card rounded-xl p-4 shimmer h-32" aria-hidden="true" />
          ))}
        </div>
      )}
      {error && <div className="form-error" role="alert">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-[var(--pv-text-dim)]" role="status">No collections found.</p>
      )}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={page + (mine?'-mine':'')}
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          animate="show"
          variants={{ hidden:{}, show:{ transition:{ staggerChildren:.05 } } }}
          role="list"
        >
          {items.map(c => (
            <CollectionCard key={c._id || c.id} collection={c} />
          ))}
        </motion.div>
      </AnimatePresence>
      <Pagination page={page} limit={limit} total={total} onChange={setPage} />
    </section>
  );
};

const Pagination = ({ page, limit, total, onChange }) => {
  const pages = Math.ceil(total/limit) || 1; if(pages<=1) return null;
  return (
    <nav className="flex flex-wrap gap-2 pt-2" aria-label="Pagination">
      {Array.from({ length: pages }).map((_,i)=>{ const n=i+1; const active = n===page; return (
        <motion.button
          key={n}
          onClick={()=>onChange(n)}
          whileHover={!active ? { y:-2 } : undefined}
            whileTap={!active ? { scale:.9 } : undefined}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 ${active ? 'bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]' : 'bg-[var(--pv-surface)] border-[var(--pv-border)] text-[var(--pv-text-dim)] hover:text-[var(--pv-white)]'}`}
          aria-current={active? 'page': undefined}
          aria-label={`Page ${n}`}
          disabled={active}
        >{n}</motion.button>
      ); })}
    </nav>
  );
};

export default CollectionList;
