import React from 'react';
import { motion } from 'framer-motion';

export default function SocialProofVision() {
  return (
    <section id="vision" className="relative py-24 px-5 md:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight font-display mb-6"
          >
            Community & Future Vision
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="text-sm md:text-base text-[var(--pv-text-dim)] leading-relaxed mb-6"
          >
            We believe prompts thrive in the open. A shared space accelerates collective intelligence—what works, evolves. What fails, improves.
          </motion.p>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.15 } }
            }}
            className="space-y-4 text-xs md:text-sm text-[var(--pv-text-dim)] leading-relaxed"
          >
            {[
              ['Open Remixing:', 'Attribution-first culture that encourages iteration.'],
              ['Extensibility:', 'Architecture anticipating plugins, adapters & export formats.'],
              ['Upcoming:', 'Team workspaces, inline commenting, collab editing, monetization options.']
            ].map(([k, v]) => (
              <motion.li
                key={k}
                variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } } }}
                whileHover={{ x: 6 }}
                className="flex"
              >
                <strong className="text-[var(--pv-saffron)] mr-2">{k}</strong> {v}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          whileHover={{ y: -8 }}
          className="relative p-8 rounded-3xl bg-gradient-to-br from-[var(--pv-orange)]/10 via-[var(--pv-saffron)]/5 to-transparent border border-white/5 backdrop-blur-sm"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs md:text-sm text-[var(--pv-text-dim)] leading-relaxed mb-4"
          >
            “PromptVault changed how we iterate. Version history + remix lineage let us experiment boldly without losing what worked.”
          </motion.p>
          <p className="text-[11px] md:text-xs uppercase tracking-wide text-[var(--pv-text-dim)]">Early Beta User</p>
          <motion.div
            className="mt-6 grid grid-cols-4 gap-3 opacity-70"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
          >
            {[...Array(8)].map((_,i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }}
                whileHover={{ scale: 1.08, rotate: 2 }}
                className="aspect-square rounded-xl bg-[var(--pv-bg)]/60 border border-white/5 flex items-center justify-center text-[10px] text-[var(--pv-text-dim)]"
              >{i+1}</motion.div>
            ))}
          </motion.div>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--pv-orange)]/40 to-[var(--pv-saffron)]/40 blur-3xl opacity-40 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
