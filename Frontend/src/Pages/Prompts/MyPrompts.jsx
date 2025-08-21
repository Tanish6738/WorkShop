import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PromptList from '../../Components/Prompt/PromptList.jsx';
import PromptForm from '../../Components/Prompt/PromptForm.jsx';

const MyPrompts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [nonce, setNonce] = useState(0); // quick refetch trigger by changing key
  // Auto-open create form if navigation state requests it
  useEffect(() => {
    if (location.state?.openForm) {
      setShowForm(true);
      // Replace history entry to avoid reopening on back/forward
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  return (
    <div style={{ padding:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ margin:0 }}>My Prompts</h1>
        <button onClick={()=>setShowForm(s=>!s)} style={btnPrimary}>{showForm ? 'Close' : 'New Prompt'}</button>
      </div>
      {showForm && <div style={{ margin:'16px 0', padding:16, border:'1px solid #eee', borderRadius:8 }}>
        <PromptForm onSaved={()=>{ setShowForm(false); setNonce(n=>n+1); }} />
      </div>}
      <PromptList key={nonce} mine />
    </div>
  );
};

const btnPrimary = { padding:'8px 14px', background:'#222', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' };

export default MyPrompts;
