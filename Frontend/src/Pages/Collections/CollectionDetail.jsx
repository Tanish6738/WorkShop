import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCollection, addPromptToCollection, removePromptFromCollection, updateCollection, deleteCollection } from '../../Services/collection.service';
import { listPrompts } from '../../Services/prompt.service';
import { useAuth } from '../../context/AuthContext.jsx';
import PromptCard from '../../Components/Prompt/PromptCard.jsx';
import CollectionForm from '../../Components/Collection/CollectionForm.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { PenLine, Trash2, PlusCircle, Search, Layers3, Eye, EyeOff, X } from 'lucide-react';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  // Search-based add prompt UI state
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchScope, setSearchScope] = useState('all'); // 'all' or 'mine'
  const [addingPromptId, setAddingPromptId] = useState(null);
  const debounceRef = useRef();

  // Browse section state (public or mine with pagination independent of quick search)
  const [browseScope, setBrowseScope] = useState('all');
  const [browseQuery, setBrowseQuery] = useState('');
  const [browseItems, setBrowseItems] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseError, setBrowseError] = useState(null);
  const [browsePage, setBrowsePage] = useState(1);
  const [browseTotal, setBrowseTotal] = useState(0);
  const browseLimit = 8;

  const isOwner = user && collection && (collection.createdBy === user.id || collection.createdBy === user._id);

  const load = () => {
    setLoading(true); setError(null);
    getCollection(id)
      .then(r=> setCollection(r.data))
      .catch(e=> setError(e?.error?.message || 'Failed to load'))
      .finally(()=> setLoading(false));
  };
  useEffect(()=>{ load(); }, [id]);

  const addPrompt = async (pid) => {
    if(!pid) return; setAddingPromptId(pid);
    try { const res = await addPromptToCollection(id, pid); if(res?.data) setCollection(res.data); } catch(_){} finally{ setAddingPromptId(null);} };
  const removePrompt = async (pid) => {
    try { const res = await removePromptFromCollection(id, pid); if(res?.data) setCollection(res.data); } catch(_){}
  };
  const handleDelete = async () => { if(!isOwner) return; if(!window.confirm('Delete this collection?')) return; try { await deleteCollection(id); navigate('/collections'); } catch(_){} };

  if(loading) return <div className="px-6 py-10 max-w-5xl mx-auto text-sm text-[var(--pv-text-dim)]">Loading...</div>;
  if(error) return <div className="px-6 py-10 max-w-5xl mx-auto form-error">{error}</div>;
  if(!collection) return <div className="px-6 py-10 max-w-5xl mx-auto text-sm text-[var(--pv-text-dim)]">Not found.</div>;

  return (
    <main aria-labelledby="collection-heading" className="relative px-5 md:px-6 py-8 max-w-5xl mx-auto">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[55rem] h-[55rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.04]" />
      </div>
      <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, ease:[0.4,0,0.2,1] }}>
      <AnimatePresence mode="wait" initial={false}>
        {!editing ? (
          <motion.div key="view" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:.4 }} className="mb-6">
            <header className="space-y-4">
              <h1 id="collection-heading" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]"><Layers3 className="h-6 w-6 text-[var(--pv-orange)]" /></span>
                {collection.name}
                {collection.visibility === 'private' && <span className="px-2 py-1 rounded-md text-[10px] font-medium bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-[var(--pv-text-dim)] uppercase tracking-wide inline-flex items-center gap-1"><EyeOff className="h-3.5 w-3.5" /> Private</span>}
                {collection.visibility !== 'private' && <span className="px-2 py-1 rounded-md text-[10px] font-medium bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-[var(--pv-text-dim)] uppercase tracking-wide inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> Public</span>}
              </h1>
              {collection.description && <p className="mt-1 text-sm md:text-base text-[var(--pv-text-dim)] leading-relaxed max-w-prose">{collection.description}</p>}
              <ul className="flex flex-wrap gap-4 text-[11px] font-medium text-[var(--pv-text-dim)]">
                <li className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]/60"><span className="text-[var(--pv-text)]">{collection.promptIds?.length||0}</span>Prompts</li>
              </ul>
            </header>
            {isOwner && <div className="flex flex-wrap gap-3 mt-4">
              <motion.button whileHover={{ y:-2 }} whileTap={{ scale:.94 }} onClick={()=>setEditing(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]"><PenLine className="h-4 w-4" /> Edit</motion.button>
              <motion.button whileHover={{ y:-2 }} whileTap={{ scale:.94 }} onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-red-600/90 hover:bg-red-600 text-white shadow-sm"><Trash2 className="h-4 w-4" /> Delete</motion.button>
            </div>}
          </motion.div>
        ) : (
          <motion.div key="edit" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:.4 }} className="mb-8 card border border-[var(--pv-border)] rounded-xl p-6 bg-[var(--pv-surface)]/60 backdrop-blur-sm">
            <CollectionForm existing={collection} onSaved={(c)=>{ setCollection(c); setEditing(false); }} onCancel={()=>setEditing(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      {isOwner && !editing && (
        <div className="mt-2 card border border-[var(--pv-border)] rounded-xl p-5 bg-[var(--pv-surface)]/60 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-[var(--pv-orange)] rounded"/><PlusCircle className="h-5 w-5 text-[var(--pv-orange)]" /> Add Prompts</h3>
          <div className="flex flex-wrap items-center gap-3 w-full">
            <input
              placeholder={searchScope==='mine' ? 'Search your prompts...' : 'Search public prompts...'}
              value={search}
              onChange={e=>{ setSearch(e.target.value); setSearchResults([]); setSearchError(null); }}
              className="flex-1 min-w-[220px] px-3 py-2 pl-9 border border-[var(--pv-border)] rounded-md bg-[var(--pv-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 relative"
            />
            <Search className="h-4 w-4 text-[var(--pv-text-dim)] -ml-14 pointer-events-none" aria-hidden="true" />
            <div className="flex gap-1">
              {['all','mine'].map(scope => (
                <button
                  key={scope}
                  type="button"
                  onClick={()=> setSearchScope(scope)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${searchScope===scope ? 'bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]' : 'bg-[var(--pv-surface-alt)] border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}
                >
                  {scope==='all' ? 'All Public' : 'My'}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-[var(--pv-text-dim)]">Search and add {searchScope==='mine' ? 'your own (public or private)' : 'public'} prompts. Already-added prompts are hidden.</p>
          <PromptSearchResults
            search={search}
            scope={searchScope}
            excludeIds={new Set((collection.promptIds||[]).map(p=> (typeof p==='object' ? (p._id||p.id) : p)))}
            onAdd={addPrompt}
            addingPromptId={addingPromptId}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            setSearchLoading={setSearchLoading}
            setSearchError={setSearchError}
            searchLoading={searchLoading}
            searchError={searchError}
            debounceRef={debounceRef}
          />
          <div className="mt-8">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Layers3 className="h-4 w-4" /> Browse {browseScope==='mine' ? 'My Prompts' : 'Public Prompts'}</h4>
            <div className="flex flex-wrap items-center gap-3 mb-3 w-full">
              <input
                placeholder={browseScope==='mine' ? 'Filter my prompts...' : 'Filter public prompts...'}
                value={browseQuery}
                onChange={e=>{ setBrowseQuery(e.target.value); setBrowsePage(1);} }
                className="flex-1 min-w-[220px] px-3 py-2 pl-9 border border-[var(--pv-border)] rounded-md bg-[var(--pv-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 relative"
              />
              <Search className="h-4 w-4 text-[var(--pv-text-dim)] -ml-14 pointer-events-none" aria-hidden="true" />
              <div className="flex gap-1">
                {['all','mine'].map(scope => (
                  <button
                    key={scope}
                    type="button"
                    onClick={()=>{ setBrowseScope(scope); setBrowsePage(1); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${browseScope===scope ? 'bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]' : 'bg-[var(--pv-surface-alt)] border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}
                  >
                    {scope==='all' ? 'All Public' : 'My'}
                  </button>
                ))}
              </div>
            </div>
            <BrowsePromptList
              scope={browseScope}
              query={browseQuery}
              page={browsePage}
              setPage={setBrowsePage}
              excludeIds={new Set((collection.promptIds||[]).map(p=> (typeof p==='object' ? (p._id||p.id) : p)))}
              onAdd={addPrompt}
              addingPromptId={addingPromptId}
              items={browseItems}
              setItems={setBrowseItems}
              loading={browseLoading}
              setLoading={setBrowseLoading}
              error={browseError}
              setError={setBrowseError}
              total={browseTotal}
              setTotal={setBrowseTotal}
              limit={browseLimit}
            />
          </div>
        </div>
      )}
      <section className="mt-12" aria-labelledby="collection-prompts-heading">
        <h3 id="collection-prompts-heading" className="text-lg font-semibold mb-4 inline-flex items-center gap-2"><Layers3 className="h-5 w-5" /> Prompts</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {collection.promptIds?.map(p => (
            <motion.div key={p._id || p.id || p} layout className="relative group">
              {typeof p === 'object' && p.title ? (
                <PromptCard prompt={p} />
              ) : (
                <div className="p-4 border border-[var(--pv-border)] rounded-lg bg-[var(--pv-surface-alt)] text-[10px] break-all text-[var(--pv-text-dim)]">{p.toString()}</div>
              )}
              {isOwner && !editing && (
                <motion.button
                  whileHover={{ scale:1.05 }}
                  whileTap={{ scale:.9 }}
                  onClick={()=>removePrompt(p._id || p.id || p)}
                  title="Remove"
                  className="absolute -top-2 -right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white shadow-lg shadow-red-900/30 border border-red-400/40"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove prompt from collection</span>
                </motion.button>
              )}
            </motion.div>
          ))}
          {(!collection.promptIds || collection.promptIds.length===0) && <p className="text-sm text-[var(--pv-text-dim)]">No prompts yet.</p>}
        </div>
      </section>
      </motion.div>
    </main>
  );
};
// Removed legacy inline style objects in favor of Tailwind + CSS variables.

// Inline component for searching prompts
const PromptSearchResults = ({ search, scope='all', excludeIds, onAdd, addingPromptId, searchResults, setSearchResults, setSearchLoading, setSearchError, searchLoading, searchError, debounceRef }) => {
  useEffect(()=>{
    if(!search){ setSearchResults([]); setSearchError(null); return; }
    if(debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(()=>{
      setSearchLoading(true); setSearchError(null);
    const params = { q: search, limit: 8, page:1 };
    if(scope==='mine') params.mine = 'true';
    listPrompts(params)
        .then(r=> {
          const items = r.data.items.filter(p=> !excludeIds.has(p._id || p.id));
          setSearchResults(items);
        })
        .catch(e=> setSearchError(e?.error?.message || 'Search failed'))
        .finally(()=> setSearchLoading(false));
    }, 400);
    return ()=> { if(debounceRef.current) clearTimeout(debounceRef.current); };
  },[search, scope]);

  if(!search) return null;
  return (
    <div className="mt-4">
      {searchLoading && <div className="text-[11px] text-[var(--pv-text-dim)]">Searching...</div>}
      {searchError && <div className="form-error text-xs">{searchError}</div>}
      {!searchLoading && !searchError && searchResults.length === 0 && <div className="text-[11px] text-[var(--pv-text-dim)]">No matches.</div>}
      <div className="flex flex-col gap-2 mt-2">
        {searchResults.map(p=>{
          const id = p._id || p.id;
            return (
              <motion.div
                key={id}
                initial={{ opacity:0, y:8 }}
                animate={{ opacity:1, y:0 }}
                className="flex gap-3 items-start p-3 border border-[var(--pv-border)] rounded-lg bg-[var(--pv-surface-alt)]/60 hover:bg-[var(--pv-surface-alt)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-[10px] text-[var(--pv-text-dim)] line-clamp-2">{(p.description || p.content || '').slice(0,100)}</div>
                </div>
                <button disabled={addingPromptId===id} onClick={()=>onAdd(id)} className="px-3 py-1.5 text-[11px] font-medium rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed">
                  {addingPromptId===id? 'Adding...':'Add'}
                </button>
              </motion.div>
            );
        })}
      </div>
    </div>
  );
};

const resultRow = { display:'flex', gap:12, alignItems:'flex-start', padding:'8px 10px', border:'1px solid #eee', borderRadius:6, background:'#fafafa' };
const smallBtn = { padding:'4px 10px', background:'#222', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', fontSize:12 };
const errBox = { background:'#ffe6e6', color:'#a40000', padding:'4px 6px', borderRadius:4, fontSize:12 };

// Browse prompt list with pagination independent of typed search
const BrowsePromptList = ({ scope='all', query, page, setPage, excludeIds, onAdd, addingPromptId, items, setItems, loading, setLoading, error, setError, total, setTotal, limit }) => {
  useEffect(()=>{
    setLoading(true); setError(null);
    const params = { page, limit };
    if(query) params.q = query;
    if(scope==='mine') params.mine = 'true';
    listPrompts(params)
      .then(r=>{
        const filtered = r.data.items.filter(p=> !excludeIds.has(p._id || p.id));
        setItems(filtered); setTotal(r.data.total);
      })
      .catch(e=> setError(e?.error?.message || 'Failed to load prompts'))
      .finally(()=> setLoading(false));
  },[scope, query, page]);

  if(loading) return <div className="text-[11px] text-[var(--pv-text-dim)]">Loading prompts...</div>;
  if(error) return <div className="form-error text-xs">{error}</div>;
  return (
    <div>
      {items.length === 0 && <div className="text-[11px] text-[var(--pv-text-dim)]">No prompts.</div>}
      <div className="flex flex-col gap-2">
        {items.map(p=>{
          const id = p._id || p.id;
          return (
            <motion.div
              key={id}
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              className="flex gap-3 items-start p-3 border border-[var(--pv-border)] rounded-lg bg-[var(--pv-surface-alt)]/60 hover:bg-[var(--pv-surface-alt)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.title}</div>
                <div className="text-[10px] text-[var(--pv-text-dim)] line-clamp-2">{(p.description || p.content || '').slice(0,100)}</div>
              </div>
              <button disabled={addingPromptId===id} onClick={()=>onAdd(id)} className="px-3 py-1.5 text-[11px] font-medium rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed">
                {addingPromptId===id? 'Adding...':'Add'}
              </button>
            </motion.div>
          );
        })}
      </div>
      <BrowsePagination page={page} total={total} limit={limit} onChange={setPage} />
    </div>
  );
};

const BrowsePagination = ({ page, total, limit, onChange }) => {
  const pages = Math.ceil(total/limit) || 1; if(pages<=1) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Array.from({ length: pages }).map((_,i)=>{ const n=i+1; const active = n===page; return (
        <motion.button
          key={n}
          whileHover={{ y:-2 }}
          whileTap={{ scale:.9 }}
          disabled={active}
          onClick={()=>onChange(n)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${active ? 'bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]' : 'bg-[var(--pv-surface-alt)] border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]'}`}
        >{n}</motion.button>
      ); })}
    </div>
  );
};

export default CollectionDetail;
