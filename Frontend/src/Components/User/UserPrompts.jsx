import React from 'react';

const UserPrompts = ({ loading, error, prompts }) => {
  return (
    <div>
      <h3 style={{ margin:'24px 0 8px' }}>Public Prompts</h3>
      {loading && <div>Loading prompts...</div>}
      {error && <div style={err}>{error}</div>}
      {!loading && !error && (!prompts || prompts.length === 0) && <div>No public prompts yet.</div>}
      <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:12 }}>
        {prompts?.map(p => (
          <li key={p._id || p.id} style={item}>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <strong>{p.title || 'Untitled Prompt'}</strong>
              {p.description && <span style={{ fontSize:13, color:'#555' }}>{p.description}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const item = { padding:12, border:'1px solid #eee', borderRadius:6, background:'#fff' };
const err = { background:'#ffe6e6', color:'#a40000', padding:'6px 8px', borderRadius:4 };

export default UserPrompts;
