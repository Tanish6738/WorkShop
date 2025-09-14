import React, { useMemo } from 'react';
import PromptList from '../../Components/Prompt/PromptList.jsx';
import { motion } from 'framer-motion';

const layout = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: .65, ease: [0.4, 0, 0.2, 1] } }
};

const PromptBrowse = () => {
  const meta = useMemo(() => ({
    heading: 'Explore Prompts',
    sub: 'Browse community prompts, discover iterations, and remix ideas to accelerate your own workflows.'
  }), []);

  return (
    <main aria-labelledby="browse-prompts-heading" className="relative px-5 sm:px-6 py-8 md:py-10 max-w-7xl mx-auto">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55rem] h-[55rem] bg-[radial-gradient(circle_at_center,var(--pv-saffron)_0%,transparent_70%)] opacity-[0.05]" />
      </div>
      <motion.div variants={layout} initial="initial" animate="animate" className="w-full">
        <header className="mb-8 flex flex-col gap-4 max-w-3xl">
          <h1 id="browse-prompts-heading" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] via-[var(--pv-saffron)] to-[var(--pv-orange)] bg-clip-text text-transparent">
            {meta.heading}
          </h1>
          <p className="text-sm md:text-base leading-relaxed text-[var(--pv-text-dim)]">
            {meta.sub}
          </p>
        </header>
        <section aria-label="Public prompts list">
          <PromptList />
        </section>
      </motion.div>
    </main>
  );
};

export default PromptBrowse;
