import React from 'react';
import { Link } from 'react-router-dom';

const CollectionCard = ({ collection }) => {
  return (
    <Link to={`/collections/${collection._id || collection.id}`} style={card}>
      <h4 style={{ margin:'0 0 6px' }}>{collection.name}</h4>
      {collection.description && <p style={desc}>{collection.description}</p>}
      <div style={meta}>
        <span>{collection.visibility === 'private' ? '🔒 Private' : 'Public'}</span>
        <span>{collection.promptIds?.length || 0} prompts</span>
      </div>
    </Link>
  );
};

const card = { display:'block', padding:16, border:'1px solid #eee', borderRadius:8, background:'#fff', textDecoration:'none', color:'#222', boxShadow:'0 1px 2px rgba(0,0,0,0.04)' };
const desc = { margin:'0 0 8px', fontSize:13, color:'#555' };
const meta = { display:'flex', gap:12, fontSize:12, color:'#666' };

export default CollectionCard;
