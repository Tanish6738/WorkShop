import React from 'react';
import { motion } from 'framer-motion';

const POINTS = [
  {
    title: 'Organized Workflow',
    text: 'Centralize prompt evolution with structure, lineage & audit trail.'
  },
  {
    title: 'Discoverability',
    text: 'Metadata + engagement signals surface the most effective prompts.'
  },
  {
    title: 'Remix Culture',
    text: 'Forking & attribution encourage collaborative refinement over reinvention.'
  },
  {
    title: 'Collaboration Ready',
    text: 'Built as a shared layer your team can grow into.'
  }
];

export default function WhyPromptVault() {
  const listVar = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } }
  };
  const pointVar = {
    hidden: { opacity: 0, x: -24 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } }
  };

  return (
    <section id="why" className="relative py-24 px-5 md:px-10 lg:px-16 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight font-display mb-6 bg-gradient-to-r from-[var(--pv-orange)] via-[var(--pv-saffron)] to-[var(--pv-orange)] bg-clip-text text-transparent"
          >
            Why PromptVault?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
            className="text-sm md:text-base text-[var(--pv-text-dim)] max-w-prose leading-relaxed mb-8"
          >
            Existing tools either bury prompts in docs or fragment them across chats & repos. PromptVault gives them a first-class, evolution-focused home.
          </motion.p>
          <motion.ul
            variants={listVar}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            className="space-y-5"
          >
            {POINTS.map(p => (
              <motion.li
                key={p.title}
                variants={pointVar}
                whileHover={{ x: 6 }}
                className="flex gap-4"
              >
                <motion.span
                  layoutId={`dot-${p.title}`}
                  className="mt-1 inline-block w-3 h-3 rounded-full bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)] shadow-[0_0_0_3px_rgba(255,170,0,0.15)]"
                />
                <div>
                  <h3 className="font-semibold text-[15px] md:text-base mb-1 flex items-center gap-2">
                    {p.title}
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="text-[10px] uppercase tracking-wider text-[var(--pv-saffron)]"
                    >→</motion.span>
                  </h3>
                  <p className="text-xs md:text-sm text-[var(--pv-text-dim)] leading-relaxed">{p.text}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div className="relative flex flex-col gap-6">
          {[0,1].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-white/3 border border-white/5 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--pv-orange)]/0 via-[var(--pv-orange)]/5 to-[var(--pv-saffron)]/10 opacity-0 hover:opacity-100 transition" />
              <p className="text-xs md:text-sm text-[var(--pv-text-dim)] leading-relaxed relative z-10">
                {i === 0 ? 'Prompts are turning into reusable system assets. A dedicated layer prevents duplication, drift & accidental regression while unlocking iteration velocity.' : 'Designed to stay lightweight now while allowing future upgrades—collaborative editing, fine-tuned performance stats, and team-level governance.'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
