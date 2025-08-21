import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPrompt, listVersions, likePrompt, unlikePrompt, incrementView, listRemixes, remixPrompt, deletePrompt } from '../../Services/prompt.service';
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
    setRemixLoading(true);
    try {
      const res = await remixPrompt(id, {});
      if (res?.data) navigate(`/prompts/${res.data._id}`);
    } catch (_) {} finally { setRemixLoading(false); }
  };

  const doDelete = async () => {
    if (!isOwner) return;
    if (!window.confirm('Delete this prompt?')) return;
    try { await deletePrompt(id); navigate('/prompts'); } catch (_) {}
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
            <button onClick={doRemix} disabled={!user || remixLoading} style={btn}>Remix</button>
            {isOwner && <button onClick={()=>setEditing(true)} style={btn}>Edit</button>}
            {isOwner && <button onClick={doDelete} style={btnDanger}>Delete</button>}
          </div>
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

export default PromptDetail;
