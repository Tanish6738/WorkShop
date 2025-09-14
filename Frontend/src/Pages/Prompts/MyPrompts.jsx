import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PromptList from '../../Components/Prompt/PromptList.jsx';
import PromptForm from '../../Components/Prompt/PromptForm.jsx';
import { AnimatePresence, motion } from 'framer-motion';

// Motion variants for consistency / reuse
const containerVariants = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: .65, ease: [0.4, 0, 0.2, 1] } }
};

const formPanelVariants = {
  initial: { opacity: 0, height: 0, scale: .97 },
  animate: { opacity: 1, height: 'auto', scale: 1, transition: { duration: .45, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, height: 0, scale: .98, transition: { duration: .35, ease: 'easeInOut' } }
};

const MyPrompts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [nonce, setNonce] = useState(0); // forces PromptList re-fetch when incremented

  // Handle deep-linking state that opens the form instantly
  useEffect(() => {
    if (location.state?.openForm) {
      setShowForm(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const toggleForm = useCallback(() => setShowForm(s => !s), []);
  const onSaved = useCallback(() => { setShowForm(false); setNonce(n => n + 1); }, []);

  // Potential future enhancements (filtering, statistics) placeholder
  const meta = useMemo(() => ({
    // These could be replaced by derived counts from context or API later
    actionsLabel: showForm ? 'Close creation form' : 'Open prompt creation form'
  }), [showForm]);

  return (
    <main
      className="relative px-5 sm:px-6 py-8 md:py-10 max-w-7xl mx-auto w-full"
      aria-labelledby="my-prompts-heading"
    >
      {/* Decorative radial gradient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.05]" />
      </div>

      <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full">
        {/* Header Section */}
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8">
          <div className="space-y-3 max-w-2xl">
            <h1 id="my-prompts-heading" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">
              My Prompts
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-[var(--pv-text-dim)]">
              Create, iterate and curate versions of your prompt patterns. Use collections to keep related work structured and remix ideas quickly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={toggleForm}
              aria-expanded={showForm}
              aria-controls="prompt-create-panel"
              aria-label={meta.actionsLabel}
              whileHover={{ y: -2 }}
              whileTap={{ scale: .95 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] active:bg-[var(--pv-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)] transition-colors"
            >
              {showForm ? (
                <>
                  <span className="text-[var(--pv-text-dim)]" aria-hidden="true">✕</span>
                  Close
                </>
              ) : (
                <>
                  <span className="text-[var(--pv-orange)]" aria-hidden="true">＋</span>
                  New Prompt
                </>
              )}
            </motion.button>
          </div>
        </header>

        {/* Animated creation panel */}
        <AnimatePresence initial={false} mode="wait">
          {showForm && (
            <motion.section
              id="prompt-create-panel"
              key="create-panel"
              variants={formPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mb-8 overflow-hidden"
              aria-label="Prompt creation form"
            >
              <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur-sm p-5 md:p-6 shadow-sm">
                <PromptForm allowCollectionSelect onSaved={onSaved} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* List Section */}
        <section aria-label="Your prompts list" className="relative">
          <PromptList key={nonce} mine />
        </section>
      </motion.div>
    </main>
  );
};

export default MyPrompts;
