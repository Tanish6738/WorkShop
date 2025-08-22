import React from 'react';
import { motion } from 'framer-motion';

const linkGroups = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how' },
      { label: 'Why', href: '#why' },
      { label: 'Vision', href: '#vision' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Explore Prompts', href: '#features' },
      { label: 'Remix Culture', href: '#why' },
      { label: 'Early Access', href: '#get-started' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Docs (soon)', href: '#' },
      { label: 'API (planned)', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[var(--pv-bg)]/70 backdrop-blur-md overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-[var(--pv-orange)]/15 via-[var(--pv-saffron)]/10 to-transparent blur-3xl" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 relative z-10">
        <div className="grid gap-12 md:gap-16 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="col-span-2"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] via-[var(--pv-saffron)] to-[var(--pv-orange)] bg-clip-text text-transparent">WorkShop</span>
              <span className="w-2 h-2 rounded-full bg-[var(--pv-saffron)] animate-pulse" />
            </div>
            <p className="text-sm text-[var(--pv-text-dim)] max-w-sm leading-relaxed">
              Open prompt evolution: curate, fork and refine with lineage, structure & signal. Built for makers who treat prompts as craft.
            </p>
            <div className="flex gap-4 mt-6">
              {['tw','gh','dc'].map(s => (
                <motion.a
                  key={s}
                  href="#"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full grid place-items-center bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-[var(--pv-text-dim)] hover:text-[var(--pv-saffron)] hover:border-[var(--pv-saffron)]/40 transition"
                  aria-label={s === 'tw' ? 'Twitter' : s === 'gh' ? 'GitHub' : 'Discord'}
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link groups */}
          {linkGroups.map((group, gi) => (
            <motion.div
              key={group.heading}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 * gi }}
            >
              <h4 className="text-[13px] font-semibold tracking-wide text-[var(--pv-saffron)] mb-4 relative">
                {group.heading}
                <span className="absolute -bottom-2 left-0 h-px w-8 bg-gradient-to-r from-[var(--pv-saffron)]/60 to-transparent" />
              </h4>
              <ul className="space-y-2.5">
                {group.links.map(l => (
                  <li key={l.label}>
                    <motion.a
                      href={l.href}
                      className="group inline-flex items-center gap-1 text-[12px] md:text-[13px] text-[var(--pv-text-dim)] hover:text-[var(--pv-saffron)] transition relative"
                      whileHover="hover"
                    >
                      <span className="relative">
                        {l.label}
                        <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-gradient-to-r from-[var(--pv-saffron)] to-transparent group-hover:w-full transition-all duration-300" />
                      </span>
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        variants={{ hover: { opacity: 1, x: 0 } }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="text-[10px] opacity-0"
                      >→</motion.span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        {/* Divider micro animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="origin-left h-px w-full bg-gradient-to-r from-transparent via-[var(--pv-saffron)]/40 to-transparent mt-16"
        />
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between text-[10px] md:text-[11px] text-[var(--pv-text-dim)]">
          <p>© {new Date().getFullYear()} WorkShop. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy','Terms','Status'].map(item => (
              <a key={item} href="#" className="relative hover:text-[var(--pv-saffron)] transition">
                {item}
                <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[var(--pv-saffron)] group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* Scroll to top button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        className="group fixed bottom-5 right-5 w-11 h-11 rounded-full bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)] shadow-[0_4px_18px_-4px_rgba(255,170,0,0.55)] flex items-center justify-center text-black text-sm font-semibold backdrop-blur-md border border-white/10"
      >
        <span className="transition group-hover:-translate-y-0.5">↑</span>
      </motion.button>
    </footer>
  );
}
