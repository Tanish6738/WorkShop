import React from 'react';

const UserCollections = ({ loading, error, collections }) => {
  return (
    <div>
      <h3 style={{ margin:'24px 0 8px' }}>Public Collections</h3>
      {loading && <div>Loading collections...</div>}
      {error && <div style={err}>{error}</div>}
      {!loading && !error && (!collections || collections.length === 0) && <div>No public collections yet.</div>}
      <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:12 }}>
        {collections?.map(c => (
          <li key={c._id || c.id} style={item}>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <strong>{c.name || 'Untitled Collection'}</strong>
              {c.description && <span style={{ fontSize:13, color:'#555' }}>{c.description}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const item = { padding:12, border:'1px solid #eee', borderRadius:6, background:'#fff' };
const err = { background:'#ffe6e6', color:'#a40000', padding:'6px 8px', borderRadius:4 };

export default UserCollections;
