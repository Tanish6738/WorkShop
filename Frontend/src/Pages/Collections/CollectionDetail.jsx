import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCollection, addPromptToCollection, removePromptFromCollection, updateCollection, deleteCollection } from '../../Services/collection.service';
import { listPrompts } from '../../Services/prompt.service';
import { useAuth } from '../../context/AuthContext.jsx';
import PromptCard from '../../Components/Prompt/PromptCard.jsx';
import CollectionForm from '../../Components/Collection/CollectionForm.jsx';

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

  if(loading) return <div style={{ padding:24 }}>Loading...</div>;
  if(error) return <div style={{ padding:24 }}>{error}</div>;
  if(!collection) return <div style={{ padding:24 }}>Not found.</div>;

  return (
    <div style={{ padding:24, maxWidth:960, margin:'0 auto' }}>
      {!editing ? (
        <div>
          <h1 style={{ marginTop:0 }}>{collection.name}</h1>
          {collection.description && <p style={{ color:'#555' }}>{collection.description}</p>}
          <p style={{ fontSize:12, color:'#666' }}>{collection.visibility === 'private' ? 'Private' : 'Public'} • {collection.promptIds?.length||0} prompts</p>
          {isOwner && <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button onClick={()=>setEditing(true)} style={btn}>Edit</button>
            <button onClick={handleDelete} style={btnDanger}>Delete</button>
          </div>}
        </div>
      ) : (
        <div style={{ border:'1px solid #eee', padding:16, borderRadius:8 }}>
          <CollectionForm existing={collection} onSaved={(c)=>{ setCollection(c); setEditing(false); }} onCancel={()=>setEditing(false)} />
        </div>
      )}
      {isOwner && !editing && (
        <div style={{ marginTop:24, border:'1px solid #eee', padding:16, borderRadius:8 }}>
          <h3 style={{ marginTop:0 }}>Add Prompts</h3>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            <input
              placeholder={searchScope==='mine' ? 'Search your prompts...' : 'Search public prompts...'}
              value={search}
              onChange={e=>{ setSearch(e.target.value); setSearchResults([]); setSearchError(null); }}
              style={input}
            />
            <div style={{ display:'flex', gap:4 }}>
              <button type="button" onClick={()=>{ setSearchScope('all'); }} style={searchScope==='all'?scopeBtnActive:scopeBtn}>All Public</button>
              <button type="button" onClick={()=>{ setSearchScope('mine'); }} style={searchScope==='mine'?scopeBtnActive:scopeBtn}>My</button>
            </div>
          </div>
          <p style={{ marginTop:6, fontSize:12, color:'#666' }}>Search and add {searchScope==='mine' ? 'your own (public or private)' : 'public'} prompts. Already-added prompts are hidden.</p>
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
          <div style={{ marginTop:28 }}>
            <h4 style={{ margin:'0 0 8px' }}>Browse {browseScope==='mine' ? 'My Prompts' : 'Public Prompts'}</h4>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:8 }}>
              <input
                placeholder={browseScope==='mine' ? 'Filter my prompts...' : 'Filter public prompts...'}
                value={browseQuery}
                onChange={e=>{ setBrowseQuery(e.target.value); setBrowsePage(1);} }
                style={input}
              />
              <div style={{ display:'flex', gap:4 }}>
                <button type="button" onClick={()=>{ setBrowseScope('all'); setBrowsePage(1); }} style={browseScope==='all'?scopeBtnActive:scopeBtn}>All Public</button>
                <button type="button" onClick={()=>{ setBrowseScope('mine'); setBrowsePage(1); }} style={browseScope==='mine'?scopeBtnActive:scopeBtn}>My</button>
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
      <section style={{ marginTop:32 }}>
        <h3>Prompts</h3>
        <div style={grid}>
          {collection.promptIds?.map(p => (
            <div key={p._id || p.id || p} style={{ position:'relative' }}>
              {/* If populated prompt object present use PromptCard else basic */}
              {typeof p === 'object' && p.title ? (
                <PromptCard prompt={p} />
              ) : (
                <div style={promptShell}>{p.toString()}</div>
              )}
              {isOwner && !editing && <button onClick={()=>removePrompt(p._id || p.id || p)} style={removeBtn} title="Remove">×</button>}
            </div>
          ))}
          {(!collection.promptIds || collection.promptIds.length===0) && <p style={{ color:'#666' }}>No prompts yet.</p>}
        </div>
      </section>
    </div>
  );
};

const input = { flex:1, padding:'8px 10px', border:'1px solid #ccc', borderRadius:6 };
const btn = { padding:'6px 12px', background:'#222', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontSize:14 };
const btnDanger = { ...btn, background:'#b00020' };
const grid = { display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', marginTop:12 };
const promptShell = { padding:16, border:'1px solid #eee', borderRadius:8, background:'#fafafa', fontSize:12, wordBreak:'break-all' };
const removeBtn = { position:'absolute', top:6, right:6, background:'#b00020', color:'#fff', border:'none', width:24, height:24, borderRadius:'50%', cursor:'pointer', lineHeight:'24px', textAlign:'center', fontWeight:600 };
const scopeBtn = { padding:'6px 10px', background:'#f5f5f5', color:'#222', border:'1px solid #ccc', borderRadius:4, cursor:'pointer', fontSize:12 };
const scopeBtnActive = { ...scopeBtn, background:'#222', color:'#fff', borderColor:'#222' };

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
    <div style={{ marginTop:12 }}>
      {searchLoading && <div style={{ fontSize:13 }}>Searching...</div>}
      {searchError && <div style={errBox}>{searchError}</div>}
      {!searchLoading && !searchError && searchResults.length === 0 && <div style={{ fontSize:12, color:'#666' }}>No matches.</div>}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {searchResults.map(p=>{
          const id = p._id || p.id;
            return (
              <div key={id} style={resultRow}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{p.title}</div>
                  <div style={{ fontSize:11, color:'#666' }}>{(p.description || p.content || '').slice(0,100)}</div>
                </div>
                <button disabled={addingPromptId===id} onClick={()=>onAdd(id)} style={smallBtn}>{addingPromptId===id? 'Adding...':'Add'}</button>
              </div>
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

  if(loading) return <div style={{ fontSize:13 }}>Loading prompts...</div>;
  if(error) return <div style={errBox}>{error}</div>;
  return (
    <div>
      {items.length === 0 && <div style={{ fontSize:12, color:'#666' }}>No prompts.</div>}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {items.map(p=>{
          const id = p._id || p.id;
          return (
            <div key={id} style={resultRow}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500 }}>{p.title}</div>
                <div style={{ fontSize:11, color:'#666' }}>{(p.description || p.content || '').slice(0,100)}</div>
              </div>
              <button disabled={addingPromptId===id} onClick={()=>onAdd(id)} style={smallBtn}>{addingPromptId===id? 'Adding...':'Add'}</button>
            </div>
          );
        })}
      </div>
      <BrowsePagination page={page} total={total} limit={limit} onChange={setPage} />
    </div>
  );
};

const BrowsePagination = ({ page, total, limit, onChange }) => {
  const pages = Math.ceil(total/limit) || 1; if(pages<=1) return null;
  return <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:12 }}>{Array.from({ length: pages }).map((_,i)=>{ const n=i+1; return <button key={n} onClick={()=>onChange(n)} disabled={n===page} style={n===page?scopeBtnActive:scopeBtn}>{n}</button>; })}</div>;
};

export default CollectionDetail;
