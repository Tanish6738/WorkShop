import React from 'react';
import { Link } from 'react-router-dom';

const PromptCard = ({ prompt }) => {
  return (
    <Link to={`/prompts/${prompt._id || prompt.id}`} style={card}>
      <h4 style={{ margin:'0 0 4px' }}>{prompt.title}</h4>
      {prompt.description && <p style={desc}>{prompt.description}</p>}
      <div style={meta}>
        <span>{prompt.category || 'General'}</span>
        <span>👍 {prompt.stats?.likes ?? 0}</span>
        <span>👁️ {prompt.stats?.views ?? 0}</span>
      </div>
    </Link>
  );
};

const card = { display:'block', padding:16, border:'1px solid #eee', borderRadius:8, background:'#fff', textDecoration:'none', color:'#222', boxShadow:'0 1px 2px rgba(0,0,0,0.04)' };
const desc = { margin:'4px 0 8px', fontSize:13, color:'#555' };
const meta = { display:'flex', gap:12, fontSize:12, color:'#666' };

export default PromptCard;
