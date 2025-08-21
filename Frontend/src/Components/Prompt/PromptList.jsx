import React, { useEffect, useState } from 'react';
import { listPrompts } from '../../Services/prompt.service';
import PromptCard from './PromptCard.jsx';

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
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <input placeholder="Search prompts" value={query} onChange={e=>{ setPage(1); setQuery(e.target.value);} } style={input} />
      </div>
      {loading && <div>Loading prompts...</div>}
      {error && <div style={err}>{error}</div>}
      {!loading && !error && items.length === 0 && <div>No prompts found.</div>}
      <div style={grid}>
        {items.map(p => <PromptCard key={p._id || p.id} prompt={p} />)}
      </div>
      <Pagination page={page} limit={limit} total={total} onChange={setPage} />
    </div>
  );
};

const Pagination = ({ page, limit, total, onChange }) => {
  const pages = Math.ceil(total / limit) || 1;
  if (pages <= 1) return null;
  return (
    <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:16 }}>
      {Array.from({ length: pages }).map((_,i)=>{
        const n = i+1;
        return <button key={n} onClick={()=>onChange(n)} disabled={n===page} style={n===page?btnActive:btn}>{n}</button>;
      })}
    </div>
  );
};

const grid = { display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))' };
const input = { flex:1, padding:'8px 10px', border:'1px solid #ccc', borderRadius:6 };
const err = { background:'#ffe6e6', color:'#a40000', padding:'6px 8px', borderRadius:4, marginTop:8 };
const btn = { padding:'6px 10px', border:'1px solid #ccc', background:'#fff', cursor:'pointer', borderRadius:4 };
const btnActive = { ...btn, background:'#222', color:'#fff' };

export default PromptList;
