import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CollectionList from '../../Components/Collection/CollectionList.jsx';
import CollectionForm from '../../Components/Collection/CollectionForm.jsx';
import { AnimatePresence, motion } from 'framer-motion';

const MyCollections = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [nonce, setNonce] = useState(0);
  useEffect(()=>{ if(location.state?.openForm){ setShowForm(true); navigate(location.pathname, { replace:true }); } },[location, navigate]);

  return (
    <motion.div
      initial={{ opacity:0, y:24 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:.55, ease:[0.4,0,0.2,1] }}
      className="px-6 py-8 max-w-7xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">My Collections</h1>
        <motion.button
          whileHover={{ y:-2 }}
          whileTap={{ scale:.95 }}
          onClick={()=>setShowForm(s=>!s)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] active:bg-[var(--pv-surface)] transition-colors"
        >
          {showForm ? 'Close' : 'New Collection'}
        </motion.button>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            transition={{ duration:.4, ease:'easeOut' }}
            className="mb-6 overflow-hidden"
          >
            <div className="card border border-[var(--pv-border)] rounded-xl p-5">
              <CollectionForm onSaved={()=>{ setShowForm(false); setNonce(n=>n+1); }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CollectionList key={nonce} mine />
    </motion.div>
  );
};

export default MyCollections;
