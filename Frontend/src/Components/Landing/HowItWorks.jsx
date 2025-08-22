import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    step: '1',
    title: 'Sign Up',
    text: 'Create your account & personalize your profile in under a minute.'
  },
  {
    step: '2',
    title: 'Create & Organize',
    text: 'Author prompts, version them, and group them into tagged collections.'
  },
  {
    step: '3',
    title: 'Engage & Remix',
    text: 'Discover, fork, favorite & refine—build on community intelligence.'
  }
];

export default function HowItWorks() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.2 } }
  };
  const stepVar = {
    hidden: { opacity: 0, y: 40, rotateX: 8, scale: 0.95 },
    show: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.65, ease: 'easeOut' } }
  };

  return (
    <section id="how" className="relative py-20 px-5 md:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display">How It Works</h2>
          <p className="mt-3 text-sm md:text-base text-[var(--pv-text-dim)]">A straight path from idea to evolving prompt asset.</p>
        </motion.header>
        <motion.ol
          variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-8 md:grid-cols-3"
          >
          {STEPS.map(s => (
            <motion.li
              key={s.step}
              variants={stepVar}
              whileHover={{ y: -8, boxShadow: '0 12px 40px -10px rgba(255,170,0,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col items-start p-6 rounded-2xl bg-white/3 dark:bg-white/[0.04] border border-white/5 backdrop-blur-sm"
            >
              <motion.span
                layoutId={`step-badge-${s.step}`}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)] font-semibold text-sm text-black shadow-[0_4px_18px_-4px_rgba(255,170,0,0.6)] mb-4"
              >{s.step}</motion.span>
              <h3 className="font-semibold mb-2 text-[15px] md:text-base tracking-wide flex items-center gap-2">
                {s.title}
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="text-[10px] uppercase tracking-wider text-[var(--pv-saffron)]"
                >→</motion.span>
              </h3>
              <p className="text-xs md:text-sm text-[var(--pv-text-dim)] leading-relaxed">{s.text}</p>
              <motion.div
                aria-hidden
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="mt-4 h-px bg-gradient-to-r from-[var(--pv-orange)]/0 via-[var(--pv-orange)]/60 to-[var(--pv-saffron)]/0"
              />
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
