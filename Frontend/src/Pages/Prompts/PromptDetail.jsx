import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPrompt, listVersions, likePrompt, unlikePrompt, incrementView, listRemixes, remixPrompt, deletePrompt } from '../../Services/prompt.service';
import { listCollections, addPromptToCollection } from '../../Services/collection.service';
import PromptForm from '../../Components/Prompt/PromptForm.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState(null);
  const [versions, setVersions] = useState([]);
  const [remixes, setRemixes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [liking, setLiking] = useState(false);
  const [likeState, setLikeState] = useState(false); // naive local like state
  const [remixLoading, setRemixLoading] = useState(false);
  // Collection add panel state
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [addingToCollection, setAddingToCollection] = useState(false);
  const [addError, setAddError] = useState(null);
  // Remix panel state
  const [showRemixPanel, setShowRemixPanel] = useState(false);
  const [remixTitle, setRemixTitle] = useState('');
  const [remixCollection, setRemixCollection] = useState('');
  const [remixError, setRemixError] = useState(null);

  const load = useCallback(()=>{
    setLoading(true); setError(null);
    Promise.all([
      getPrompt(id),
      listVersions(id),
      listRemixes(id),
      incrementView(id)
    ])
      .then(([p, v, r]) => { setPrompt(p.data); setVersions(v.data); setRemixes(r.data); })
      .catch(e => setError(e?.error?.message || 'Failed to load'))
      .finally(()=> setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const isOwner = user && prompt && (prompt.createdBy === user.id || prompt.createdBy === user._id);

  const toggleLike = async () => {
    if (!user || liking) return;
    setLiking(true);
    try {
      if (!likeState) {
        await likePrompt(id); setLikeState(true); if (prompt) prompt.stats.likes += 1;
      } else { await unlikePrompt(id); setLikeState(false); if (prompt) prompt.stats.likes -= 1; }
      setPrompt({ ...prompt });
    } catch (_) { /* ignore */ }
    finally { setLiking(false); }
  };

  const doRemix = async () => {
    if (!user || remixLoading) return;
    setRemixLoading(true); setRemixError(null);
    try {
      const payload = {};
      if (remixTitle.trim()) payload.title = remixTitle.trim();
      const res = await remixPrompt(id, payload);
      if (res?.data) {
        const newId = res.data._id;
        if (remixCollection) {
          try { await addPromptToCollection(remixCollection, newId); } catch (_) { /* ignore add failure */ }
        }
        navigate(`/prompts/${newId}`);
      }
    } catch (e) { setRemixError(e?.error?.message || 'Remix failed'); } finally { setRemixLoading(false); }
  };

  const doDelete = async () => {
    if (!isOwner) return;
    if (!window.confirm('Delete this prompt?')) return;
    try { await deletePrompt(id); navigate('/prompts'); } catch (_) {}
  };

  const openCollectionsIfNeeded = () => {
    if (!user || collections.length || collectionsLoading) return;
    setCollectionsLoading(true);
    listCollections({ mine: 'true', limit: 100 })
      .then(r => { setCollections(r.data.items || []); })
      .catch(()=>{})
      .finally(()=> setCollectionsLoading(false));
  };

  const toggleAddPanel = () => { setShowAddPanel(s=> !s); setAddError(null); if(!showAddPanel) openCollectionsIfNeeded(); };
  const toggleRemixPanel = () => { setShowRemixPanel(s=> !s); setRemixError(null); if(!showRemixPanel) { openCollectionsIfNeeded(); setRemixTitle(''); setRemixCollection(''); } };

  const addCurrentPromptToCollection = async () => {
    if(!selectedCollection || !prompt || addingToCollection) return;
    setAddingToCollection(true); setAddError(null);
    try { await addPromptToCollection(selectedCollection, prompt._id || prompt.id); setShowAddPanel(false); }
    catch(e){ setAddError(e?.error?.message || 'Failed to add'); }
    finally { setAddingToCollection(false); }
  };

  if (loading) return <div style={{ padding:24 }}>Loading...</div>;
  if (error) return <div style={{ padding:24 }}>{error}</div>;
  if (!prompt) return <div style={{ padding:24 }}>Not found.</div>;

  return (
    <div style={{ padding:24, maxWidth:960, margin:'0 auto' }}>
      {!editing ? (
        <div>
          <h1 style={{ marginTop:0 }}>{prompt.title}</h1>
          {prompt.description && <p style={{ color:'#555' }}>{prompt.description}</p>}
          <pre style={content}>{prompt.content}</pre>
          <div style={chips}>
            {prompt.tags?.map(t=> <span key={t} style={chip}>#{t}</span>)}
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:12 }}>
            <button onClick={toggleLike} disabled={!user || liking} style={btn}>{likeState ? 'Unlike' : 'Like'} ({prompt.stats?.likes ?? 0})</button>
            <button onClick={toggleRemixPanel} disabled={!user} style={btn}>{showRemixPanel ? 'Cancel Remix' : 'Remix'}</button>
            <button onClick={toggleAddPanel} disabled={!user} style={btn}>{showAddPanel ? 'Cancel Add' : 'Add to Collection'}</button>
            {isOwner && <button onClick={()=>setEditing(true)} style={btn}>Edit</button>}
            {isOwner && <button onClick={doDelete} style={btnDanger}>Delete</button>}
          </div>
          {showAddPanel && user && (
            <div style={panel}>
              <h4 style={panelTitle}>Add to Collection</h4>
              {collectionsLoading && <div style={panelInfo}>Loading collections...</div>}
              {!collectionsLoading && collections.length === 0 && <div style={panelInfo}>No collections yet. Create one first.</div>}
              {!collectionsLoading && collections.length > 0 && (
                <select value={selectedCollection} onChange={e=>setSelectedCollection(e.target.value)} style={select}>
                  <option value="">Select collection...</option>
                  {collections.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                </select>
              )}
              {addError && <div style={errorBox}>{addError}</div>}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={addCurrentPromptToCollection} disabled={!selectedCollection || addingToCollection} style={btnSmall}>{addingToCollection ? 'Adding...' : 'Add'}</button>
                <button onClick={()=> setShowAddPanel(false)} style={btnSecondarySmall}>Close</button>
              </div>
            </div>
          )}
          {showRemixPanel && user && (
            <div style={panel}>
              <h4 style={panelTitle}>Remix Prompt</h4>
              <input placeholder="Optional new title" value={remixTitle} onChange={e=>setRemixTitle(e.target.value)} style={inputFull} />
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <label style={{ fontSize:12, color:'#555' }}>Save remix to a collection (optional)</label>
                <select value={remixCollection} onChange={e=>setRemixCollection(e.target.value)} style={select} onFocus={openCollectionsIfNeeded}>
                  <option value="">-- None --</option>
                  {collections.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                </select>
              </div>
              {remixError && <div style={errorBox}>{remixError}</div>}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={doRemix} disabled={remixLoading} style={btnSmall}>{remixLoading ? 'Remixing...' : 'Create Remix'}</button>
                <button onClick={()=> setShowRemixPanel(false)} style={btnSecondarySmall}>Close</button>
              </div>
            </div>
          )}
          <section style={{ marginTop:32 }}>
            <h3>Versions</h3>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', gap:8, flexWrap:'wrap' }}>
              {versions.map(v => <li key={v.versionNumber} style={versionTag}>v{v.versionNumber}</li>)}
            </ul>
          </section>
          <section style={{ marginTop:32 }}>
            <h3>Remixes</h3>
            {remixes.length === 0 && <p style={{ color:'#666' }}>No remixes yet.</p>}
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:12 }}>
              {remixes.map(r => <li key={r._id}><a href={`/prompts/${r._id}`}>{r.title}</a></li>)}
            </ul>
          </section>
        </div>
      ) : (
        <div style={{ border:'1px solid #eee', padding:16, borderRadius:8 }}>
          <PromptForm existing={prompt} onSaved={(p)=>{ setPrompt(p); setEditing(false); }} onCancel={()=>setEditing(false)} />
        </div>
      )}
    </div>
  );
};

const content = { background:'#111', color:'#f5f5f5', padding:16, borderRadius:8, whiteSpace:'pre-wrap', lineHeight:1.4, fontSize:14 };
const chips = { display:'flex', flexWrap:'wrap', gap:8, marginTop:8 };
const chip = { background:'#eee', padding:'4px 8px', borderRadius:20, fontSize:12 };
const btn = { padding:'6px 12px', background:'#222', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontSize:14 };
const btnDanger = { ...btn, background:'#b00020' };
const versionTag = { padding:'4px 8px', background:'#f0f0f0', borderRadius:4, fontSize:12 };
const panel = { marginTop:16, border:'1px solid #ddd', padding:16, borderRadius:8, background:'#fafafa', display:'flex', flexDirection:'column', gap:12 };
const panelTitle = { margin:0, fontSize:15 };
const panelInfo = { fontSize:12, color:'#666' };
const select = { padding:'8px 10px', border:'1px solid #ccc', borderRadius:6, background:'#fff' };
const inputFull = { ...select, width:'100%' };
const btnSmall = { padding:'6px 12px', background:'#222', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontSize:13 };
const btnSecondarySmall = { ...btnSmall, background:'#777' };
const errorBox = { background:'#ffe6e6', color:'#a40000', fontSize:12, padding:'6px 8px', borderRadius:4 };

export default PromptDetail;
