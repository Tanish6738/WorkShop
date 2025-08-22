import React from 'react';
import PromptList from '../../Components/Prompt/PromptList.jsx';
import { motion } from 'framer-motion';

const PromptBrowse = () => (
  <motion.div
    initial={{ opacity:0, y:24 }}
    animate={{ opacity:1, y:0 }}
    transition={{ duration:.55, ease:[0.4,0,0.2,1] }}
    className="px-6 py-8 max-w-7xl mx-auto"
  >
    <h1 className="text-3xl font-semibold tracking-tight mb-6 bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">Prompts</h1>
    <PromptList />
  </motion.div>
);

export default PromptBrowse;
