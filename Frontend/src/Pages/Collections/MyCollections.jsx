import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CollectionList from '../../Components/Collection/CollectionList.jsx';
import CollectionForm from '../../Components/Collection/CollectionForm.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusCircle, X, Layers3 } from 'lucide-react';

// Layout motion variants for consistent entrance
const layout = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: .6, ease: [0.4, 0, 0.2, 1] } }
};

const formPanelVariants = {
  initial: { opacity: 0, height: 0, scale: .97 },
  animate: { opacity: 1, height: 'auto', scale: 1, transition: { duration: .45, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, height: 0, scale: .98, transition: { duration: .35, ease: 'easeInOut' } }
};

const MyCollections = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [nonce, setNonce] = useState(0); // forces list refresh

  useEffect(() => {
    if (location.state?.openForm) {
      setShowForm(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const toggleForm = useCallback(() => setShowForm(s => !s), []);
  const onSaved = useCallback(() => { setShowForm(false); setNonce(n => n + 1); }, []);

  const meta = useMemo(() => ({
    heading: 'My Collections',
    sub: 'Create and manage your personal collections of prompts. Organize related ideas to reuse faster.'
  }), []);

  return (
    <main aria-labelledby="my-collections-heading" className="relative px-5 sm:px-6 py-8 md:py-10 max-w-7xl mx-auto w-full">
      {/* Decorative radial gradient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.05]" />
      </div>
      <motion.div variants={layout} initial="initial" animate="animate" className="w-full">
        {/* Header Section */}
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <h1 id="my-collections-heading" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]">
                <Layers3 className="h-6 w-6 text-[var(--pv-orange)]" />
              </span>
              {meta.heading}
            </h1>
            <p className="mt-2 text-sm md:text-base text-[var(--pv-text-dim)] leading-relaxed">{meta.sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleForm}
              aria-expanded={showForm}
              aria-controls="collection-form-panel"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60"
            >
              {showForm ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              <span>{showForm ? 'Close Form' : 'New Collection'}</span>
            </motion.button>
          </div>
        </header>

        {/* Creation Form Panel */}
        <AnimatePresence initial={false} mode="wait">
          {showForm && (
            <motion.div
              id="collection-form-panel"
              key="form"
              variants={formPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-8 overflow-hidden"
            >
              <div className="card border border-[var(--pv-border)] rounded-xl p-5 bg-[var(--pv-surface)]/60 backdrop-blur-sm">
                <CollectionForm onSaved={onSaved} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List Section */}
        <section className="mt-10" aria-label="User collections list">
          <CollectionList key={nonce} mine />
        </section>
      </motion.div>
    </main>
  );
};

export default MyCollections;
