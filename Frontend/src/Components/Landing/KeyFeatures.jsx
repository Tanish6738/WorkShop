import React from 'react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    title: 'Authentication & Profiles',
    blurb: 'Secure sign-in with personalized profiles that showcase prompt craft and activity.'
  },
  {
    title: 'Prompt Authoring + Versions',
    blurb: 'Iterate safely—every prompt edit is versioned for auditability and rollback.'
  },
  {
    title: 'Tags, Categories & Metadata',
    blurb: 'Structure your library with rich tagging for instant thematic discovery.'
  },
  {
    title: 'Collections',
    blurb: 'Group related prompts into curated, shareable knowledge packs.'
  },
  {
    title: 'Remixing',
    blurb: 'Fork any prompt, evolve it, and credit the lineage automatically.'
  },
  {
    title: 'Likes & Favorites',
    blurb: 'Lightweight social signals surface what works—bookmark what inspires.'
  },
  {
    title: 'Powerful Search & Filters',
    blurb: 'Slice by tags, owners, recency or popularity to find the right prompt fast.'
  },
  {
    title: 'Basic Analytics',
    blurb: 'Track engagement to understand what resonates and prioritize improvements.'
  }
];

export default function KeyFeatures() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 26, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } }
  };

  return (
    <section id="features" className="relative py-20 px-5 md:px-10 lg:px-16 bg-[var(--pv-bg)]/60">
      <div className="max-w-7xl mx-auto">
        <motion.header
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display bg-gradient-to-r from-[var(--pv-orange)] via-[var(--pv-saffron)] to-[var(--pv-orange)] bg-clip-text text-transparent">Key Features</h2>
          <p className="mt-4 text-sm md:text-base text-[var(--pv-text-dim)] max-w-2xl mx-auto">Everything you need to evolve prompts collaboratively and keep creative momentum.</p>
        </motion.header>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -6, rotate: 0.4 }}
              whileTap={{ scale: 0.97 }}
              className="group p-5 rounded-2xl bg-white/2 dark:bg-white/[0.03] border border-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-sm hover:shadow-[0_8px_36px_-8px_rgba(255,170,0,0.35)] transition relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-[var(--pv-orange)]/6 via-transparent to-[var(--pv-saffron)]/10" />
              <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-gradient-to-br from-[var(--pv-orange)]/0 via-[var(--pv-orange)]/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition" />
              <h3 className="font-semibold text-[15px] md:text-base mb-2 tracking-wide text-[var(--pv-saffron)] flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--pv-saffron)] group-hover:scale-125 transition" />
                {f.title}
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-[var(--pv-text-dim)]">{f.blurb}</p>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="origin-left block mt-3 h-px w-full bg-gradient-to-r from-[var(--pv-orange)]/0 via-[var(--pv-orange)]/50 to-[var(--pv-saffron)]/0"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
