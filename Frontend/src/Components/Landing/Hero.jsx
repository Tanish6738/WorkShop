import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms (different intensities per layer)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Image meta (replace src with real assets when available)
  const heroImages = [
    {
      id: "img-a",
      src: "https://placehold.co/280x360/171717/FFD27D?text=Prompt+Editor",
      alt: "Prompt editor screenshot",
      className:
        "w-[160px] md:w-[200px] rounded-xl shadow-[0_8px_28px_-6px_rgba(0,0,0,0.5)] border border-white/5 backdrop-blur-sm",
      style: { top: "8%", left: "4%", rotate: "-6deg" },
      y: y1,
      delay: 0.1,
    },
    {
      id: "img-b",
      src: "https://placehold.co/320x200/1F1F1F/FFB347?text=Diff+History",
      alt: "Prompt diff history panel",
      className:
        "w-[180px] md:w-[230px] rounded-xl shadow-[0_8px_28px_-6px_rgba(0,0,0,0.55)] border border-white/5",
      style: { top: "16%", right: "6%", rotate: "5deg" },
      y: y2,
      delay: 0.18,
    },
    {
      id: "img-c",
      src: "https://placehold.co/360x220/222/FFA94D?text=Analytics",
      alt: "Prompt analytics chart",
      className:
        "w-[190px] md:w-[250px] rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.55)] border border-white/5",
      style: { bottom: "14%", left: "8%", rotate: "4deg" },
      y: y3,
      delay: 0.26,
    },
    {
      id: "img-d",
      src: "https://placehold.co/260x320/181818/FFC56D?text=Collection",
      alt: "Collections view",
      className:
        "w-[150px] md:w-[190px] rounded-xl shadow-[0_8px_26px_-4px_rgba(0,0,0,0.5)] border border-white/5",
      style: { bottom: "10%", right: "14%", rotate: "-4deg" },
      y: y4,
      delay: 0.34,
    },
    {
      id: "img-e",
      src: "https://placehold.co/300x180/242424/FFDCA8?text=Team+Thread",
      alt: "Team discussion thread",
      className:
        "w-[170px] md:w-[210px] rounded-xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.45)] border border-white/5 backdrop-blur-sm",
      style: { top: "50%", right: "-2%", translate: "0 -50%", rotate: "2deg" },
      y: y5,
      delay: 0.42,
    },
  ];
  // Pre-generate subtle floating accent dots to avoid re-renders changing layout
  const accents = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        size: Math.round(Math.random() * 6) + 4,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
      })),
    []
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center items-center text-center px-6 pt-24 md:pt-0 min-h-[calc(100vh-4rem)] overflow-hidden bg-[var(--pv-bg)]"
      aria-labelledby="hero-title"
    >
      {/* Layer: soft radial gradients */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div
          className="absolute inset-0 opacity-70 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, var(--pv-orange)20%, transparent 60%), radial-gradient(circle at 80% 70%, var(--pv-saffron)15%, transparent 55%)",
          }}
        />
      </div>

      {/* Layer: subtle animated grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] [mask-image:radial-gradient(circle_at_center,black,transparent)]">
        <div
          className="w-full h-full animate-[slowPan_40s_linear_infinite]"
          style={{
            backgroundSize: "60px 60px",
            backgroundImage:
              "linear-gradient(var(--pv-border) 1px,transparent 1px),linear-gradient(90deg,var(--pv-border) 1px,transparent 1px)",
          }}
        />
      </div>

      {/* Layer: soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.5))] -z-10" />

      {/* Subtle rotating halo */}
      <motion.div
        aria-hidden
        className="absolute w-[780px] h-[780px] rounded-full -z-10"
        style={{
          background:
            "conic-gradient(from 0deg,var(--pv-saffron),transparent 60%,var(--pv-orange))",
          filter: "blur(120px) saturate(140%)",
          top: "50%",
          left: "50%",
          translate: "-50% -50%",
          opacity: 0.25,
        }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
      />

  {/* Content wrapper for contained width */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] md:text-sm font-medium bg-[var(--pv-saffron)]/10 text-[var(--pv-saffron)] ring-1 ring-[var(--pv-saffron)]/30 backdrop-blur-md mb-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--pv-orange)] animate-pulse" />
          Open, Curate & Evolve Your AI Prompts
        </motion.span>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 relative leading-[1.05]"
        >
          <span className="bg-gradient-to-br from-[var(--pv-orange)] via-[var(--pv-saffron)] to-[var(--pv-orange)] bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(255,158,0,0.15)]">WorkShop</span>
          <span className="block text-[var(--pv-text-dim)] mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.5px]">
            Your collaborative workspace for prompt craftsmanship
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
          className="text-base md:text-xl text-[var(--pv-text-dim)]/90 max-w-2xl mb-10 leading-relaxed"
        >
          Create, version, audit, and remix prompts with provenance. A fluid developer UX blended with a sharing culture built for AI teams & creators.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="/auth"
            className="group relative inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold text-white bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)]  transition "
          >
            <span className="relative z-10">Get Started</span>
          </a>
          <a
            href="/prompts"
            className="inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold text-[var(--pv-saffron)] bg-[var(--pv-saffron)]/10 hover:bg-[var(--pv-saffron)]/15 ring-1 ring-[var(--pv-saffron)]/40 backdrop-blur-sm transition"
          >
            Explore Prompts
          </a>
        </motion.div>
      </div>

      {/* Collage Images */}
      <div aria-hidden className="pointer-events-none absolute inset-0 max-w-[1400px] mx-auto">
        {heroImages.map((img) => (
          <motion.img
            key={img.id}
            src={img.src}
            alt={img.alt}
            style={{ ...img.style, y: img.y }}
            loading="lazy"
            decoding="async"
            className={`absolute select-none object-cover ${img.className}`}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: img.delay }}
            draggable={false}
          />
        ))}
      </div>

      {/* Floating accent dots */}
      {accents.map((a) => (
        <motion.span
          key={a.id}
          aria-hidden
          className="absolute rounded-full bg-[var(--pv-saffron)]/40 shadow-[0_0_0_1px_rgba(255,255,255,0.15)]"
          style={{ width: a.size, height: a.size, left: a.x, top: a.y }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, -40, -60],
            scale: [0.4, 1, 0.8],
          }}
          transition={{
            duration: a.duration,
            repeat: Infinity,
            delay: a.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Accessibility: hidden descriptive label */}
      <span className="sr-only">
        PromptVault platform hero section, prompt collaboration and sharing
      </span>

      {/* Keyframe utility (Tailwind inline) */}
      <style>{`
        @keyframes slowPan { from { transform: translate3d(0,0,0);} to { transform: translate3d(60px,60px,0);} }
      `}</style>
    </section>
  );
}