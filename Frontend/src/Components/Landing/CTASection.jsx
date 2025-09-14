import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section id="get-started" className="relative py-24 px-5 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="max-w-5xl mx-auto text-center relative"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--pv-orange)]/15 via-[var(--pv-saffron)]/10 to-transparent rounded-[3rem] blur-2xl" />
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight font-display mb-6"
        >
          Start Your Vault Today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="text-sm md:text-base text-[var(--pv-text-dim)] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Own your prompt workflow—ship better AI interactions faster. It’s free to begin exploring public prompts.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.94 }}>
            <Link to="/register" className="group relative inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold text-white bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)] shadow-[0_8px_24px_-6px_rgba(255,170,0,0.45)] hover:shadow-[0_8px_28px_-4px_rgba(255,170,0,0.6)] transition">
              <span className="relative z-10">Sign Up Free</span>
              <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition" />
            </Link>
          </motion.div>
          <motion.a
            href="/prompts"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold text-[var(--pv-saffron)] bg-[var(--pv-saffron)]/10 hover:bg-[var(--pv-saffron)]/15 ring-1 ring-[var(--pv-saffron)]/40 backdrop-blur-sm transition"
          >
            Explore Public Prompts
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
