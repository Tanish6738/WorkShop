import React, { useMemo } from 'react';
import CollectionList from '../../Components/Collection/CollectionList.jsx';
import { motion } from 'framer-motion';
import { Layers3 } from 'lucide-react';

const layout = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: .65, ease: [0.4, 0, 0.2, 1] } }
};

const CollectionBrowse = () => {
  const meta = useMemo(() => ({
    heading: 'Explore Collections',
    sub: 'Browse curated sets of prompts assembled by the community to accelerate your workflow discovery.'
  }), []);

  return (
    <main aria-labelledby="browse-collections-heading" className="relative px-5 sm:px-6 py-8 md:py-10 max-w-7xl mx-auto">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.05]" />
      </div>
      <motion.div variants={layout} initial="initial" animate="animate" className="w-full">
        <header className="max-w-3xl">
          <h1 id="browse-collections-heading" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]">
              <Layers3 className="h-6 w-6 text-[var(--pv-orange)]" />
            </span>
            {meta.heading}
          </h1>
          <p className="mt-3 text-sm md:text-base text-[var(--pv-text-dim)] leading-relaxed">
            {meta.sub}
          </p>
        </header>
        <section className="mt-10" aria-label="Collections list">
          <CollectionList />
        </section>
      </motion.div>
    </main>
  );
};

export default CollectionBrowse;
