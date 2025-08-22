import React from 'react';
import CollectionList from '../../Components/Collection/CollectionList.jsx';
import { motion } from 'framer-motion';

const CollectionBrowse = () => (
  <motion.div
    initial={{ opacity:0, y:24 }}
    animate={{ opacity:1, y:0 }}
    transition={{ duration:.55, ease:[0.4,0,0.2,1] }}
    className="px-6 py-8 max-w-7xl mx-auto w-full"
  >
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">Collections</h1>
    </div>
    <CollectionList />
  </motion.div>
);

export default CollectionBrowse;
