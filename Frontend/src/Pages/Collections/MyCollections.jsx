import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CollectionList from '../../Components/Collection/CollectionList.jsx';
import CollectionForm from '../../Components/Collection/CollectionForm.jsx';

const MyCollections = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [nonce, setNonce] = useState(0);
  useEffect(()=>{ if(location.state?.openForm){ setShowForm(true); navigate(location.pathname, { replace:true }); } },[location, navigate]);

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ margin:0 }}>My Collections</h1>
        <button onClick={()=>setShowForm(s=>!s)} style={btnPrimary}>{showForm? 'Close':'New Collection'}</button>
      </div>
      {showForm && <div style={{ margin:'16px 0', padding:16, border:'1px solid #eee', borderRadius:8 }}>
        <CollectionForm onSaved={()=>{ setShowForm(false); setNonce(n=>n+1); }} />
      </div>}
      <CollectionList key={nonce} mine />
    </div>
  );
};

const btnPrimary = { padding:'8px 14px', background:'#222', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' };

export default MyCollections;
