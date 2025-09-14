import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Small reusable feature card component
const FeatureCard = ({ icon, title, children, index }) => (
	<motion.li
		initial={{ opacity: 0, y: 24, scale: .98 }}
		whileInView={{ opacity: 1, y: 0, scale: 1 }}
		viewport={{ once: true, amount: 0.4 }}
		transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.08 * index }}
		className="group relative flex flex-col gap-3 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[var(--pv-orange)]"
	>
		<div className="flex items-center gap-3">
			<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--pv-orange)]/15 via-[var(--pv-saffron)]/10 to-transparent border border-[var(--pv-border)] text-[var(--pv-orange)]">
				<span aria-hidden="true" className="text-lg">{icon}</span>
			</div>
			<h3 className="text-sm font-semibold tracking-wide text-[var(--pv-text)]">{title}</h3>
		</div>
		<p className="text-xs sm:text-sm leading-relaxed text-[var(--pv-text-dim)]">{children}</p>
		<motion.div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--pv-orange)]/0 via-[var(--pv-orange)]/0 to-[var(--pv-saffron)]/0 group-hover:from-[var(--pv-orange)]/5 group-hover:via-[var(--pv-orange)]/0 group-hover:to-[var(--pv-saffron)]/10 transition-colors"
			initial={false}
			whileHover={{ opacity: 1 }}
		/>
	</motion.li>
);

const Home = () => {
	const { user } = useAuth();

	const features = useMemo(() => ([
		{ icon: '🗂️', title: 'Organize', body: 'Group prompts into themed collections so your workflow stays tidy and collaborative.' },
		{ icon: '🧪', title: 'Iterate', body: 'Version your prompts, compare improvements, and refine them over time.' },
		{ icon: '✨', title: 'Remix', body: 'Fork any public prompt, tailor it to your needs, and share your variation.' },
		{ icon: '📊', title: 'Engage', body: 'Track likes and interaction to surface what resonates with the community.' },
		{ icon: '🔗', title: 'Share', body: 'Publish collections publicly or keep them private until they are ready.' },
		{ icon: '⚡', title: 'Reusable Assets', body: 'Treat prompts as reusable building blocks across tools and use‑cases.' }
	]), []);

	return (
		<main
			id="main-content"
			className="relative overflow-hidden"
			aria-labelledby="hero-heading"
		>
			{/* Decorative gradient background */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[70rem] h-[70rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.07]" />
			</div>

			{/* Hero Section */}
			<section className="px-5 pt-16 pb-14 md:pt-24 md:pb-20 max-w-6xl mx-auto w-full">
				<div className="flex flex-col gap-10 md:gap-14 lg:flex-row lg:items-center">
					<motion.div
						className="flex-1 space-y-7"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
					>
						<motion.span
							initial={{ scale: 0.85, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
							className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] bg-[var(--pv-surface)]/80 border border-[var(--pv-border)] text-[var(--pv-text-dim)] backdrop-blur-sm"
						>
							<span className="h-2 w-2 rounded-full bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] animate-pulse" />
							Alpha Preview
						</motion.span>

						<h1
							id="hero-heading"
							className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight bg-gradient-to-r from-[var(--pv-orange)] via-[var(--pv-saffron)] to-[var(--pv-orange)] bg-clip-text text-transparent"
						>
							Build, refine & share
							<br className="hidden sm:block" />
							intelligent prompt systems
						</h1>

						<p className="max-w-xl text-base md:text-lg leading-relaxed text-[var(--pv-text-dim)]">
							PromptVault is a focused hub for crafting reusable AI prompt assets. Version your ideas, remix public prompts, and curate structured collections that evolve with your workflow.
						</p>

						<div className="flex flex-col sm:flex-row gap-3 pt-2" aria-label="Primary actions">
							<AnimatePresence initial={false} mode="wait">
								{!user && (
									<motion.div
										key="cta-guest"
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -8 }}
										transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
										className="flex flex-col sm:flex-row gap-3 w-full"
									>
										<motion.div whileHover={{ y: -3 }} whileTap={{ scale: .95 }} className="w-full sm:w-auto">
											<Link
												to="/auth"
												className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-md px-5 py-3 text-sm md:text-base font-medium bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] text-black shadow-[0_4px_18px_-4px_rgb(0_0_0/0.35)] hover:shadow-[0_6px_24px_-6px_rgb(0_0_0/0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)] transition-all"
											>
												Get Started
												<span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
											</Link>
										</motion.div>
										<motion.div whileHover={{ y: -3 }} whileTap={{ scale: .95 }} className="w-full sm:w-auto">
											<Link
												to="/prompts"
												className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-md px-5 py-3 text-sm md:text-base font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] text-[var(--pv-text)] hover:bg-[var(--pv-surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)] transition"
											>
												Browse Prompts
											</Link>
										</motion.div>
									</motion.div>
								)}
								{user && (
									<motion.div
										key="cta-user"
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -8 }}
										transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
										className="flex flex-col sm:flex-row gap-3 w-full"
									>
										<motion.div whileHover={{ y: -3 }} whileTap={{ scale: .95 }}>
											<Link
												to="/profile"
												className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] text-[var(--pv-text)] hover:bg-[var(--pv-surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)] transition"
											>
												My Dashboard
											</Link>
										</motion.div>
										<motion.div whileHover={{ y: -3 }} whileTap={{ scale: .95 }}>
											<Link
												to="/prompts"
												className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] text-black shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)] transition"
											>
												Explore Prompts
											</Link>
										</motion.div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{user && (
							<motion.p
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.25, duration: 0.5 }}
								className="text-xs md:text-sm text-[var(--pv-text-dim)]"
							>
								Welcome back, <span className="font-semibold text-[var(--pv-orange)]">{user.name || user.email}</span>. Ready to iterate on your prompt systems?
							</motion.p>
						)}
					</motion.div>

					{/* Right side visual / placeholder illustration */}
					<motion.div
						className="flex-1 relative max-w-xl mx-auto lg:mx-0"
						initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
						animate={{ opacity: 1, scale: 1, rotate: 0 }}
						transition={{ duration: 0.9, ease: [0.45, 0, 0.2, 1] }}
					>
						<div className="aspect-[5/4] rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/60 backdrop-blur-sm p-4 sm:p-6 relative overflow-hidden shadow-inner">
							<div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(120deg,var(--pv-surface-alt)_0%,transparent_70%)]" />
							<div className="grid grid-cols-4 gap-2 sm:gap-3 h-full">
								{[...Array(12)].map((_, i) => (
									<motion.div
										key={i}
										className="rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]/70 h-full flex items-center justify-center text-[10px] font-medium text-[var(--pv-text-dim)]"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.05 * i + 0.4, duration: 0.4, ease: 'easeOut' }}
									>
										PV{i + 1}
									</motion.div>
								))}
							</div>
							<motion.div
								aria-hidden="true"
								className="absolute -bottom-14 -right-14 w-56 h-56 rounded-full bg-gradient-to-tr from-[var(--pv-orange)]/25 to-[var(--pv-saffron)]/20 blur-3xl opacity-60" />
						</div>
					</motion.div>
				</div>
			</section>

			{/* Feature Highlights */}
			<section className="px-5 pb-20 md:pb-28 max-w-6xl mx-auto" aria-labelledby="features-heading">
				<div className="mb-10 md:mb-14 flex flex-col gap-4 max-w-3xl">
					<motion.h2
						id="features-heading"
						className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--pv-text)]"
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: .6, ease: [0.4,0,0.2,1] }}
					>
						Everything you need to evolve prompts
					</motion.h2>
					<motion.p
						className="text-sm md:text-base leading-relaxed text-[var(--pv-text-dim)]"
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: .08, duration: .6, ease: [0.4,0,0.2,1] }}
					>
						Keep experimentation structured. PromptVault helps you capture iterations, track what performs, and collaborate without losing context or clarity.
					</motion.p>
				</div>
				<ul className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((f, i) => (
						<FeatureCard key={f.title} icon={f.icon} title={f.title} index={i}>{f.body}</FeatureCard>
					))}
				</ul>
			</section>

			{/* Call To Action Footer */}
			<section className="px-5 pb-24 max-w-5xl mx-auto" aria-labelledby="cta-heading">
				<motion.div
					className="relative overflow-hidden rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/60 backdrop-blur-sm p-8 md:p-12 flex flex-col md:flex-row gap-8 md:items-center"
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
				>
					<div className="flex-1 space-y-4 relative z-10">
						<h2 id="cta-heading" className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--pv-text)]">Start shaping better AI interactions</h2>
						<p className="text-sm md:text-base text-[var(--pv-text-dim)] max-w-prose">Whether you are refining a product workflow or experimenting with agent behaviors, keeping prompt knowledge organized accelerates iteration.</p>
						<div className="flex flex-col sm:flex-row gap-3 pt-2">
							<motion.div whileHover={{ y: -3 }} whileTap={{ scale: .95 }}>
								<Link
									to={user ? '/prompts' : '/auth'}
									className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] text-black shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)] transition"
								>
									{user ? 'View Your Prompts' : 'Create Your First Prompt'}
								</Link>
							</motion.div>
							{!user && (
								<motion.div whileHover={{ y: -3 }} whileTap={{ scale: .95 }}>
									<Link
										to="/prompts"
										className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] text-[var(--pv-text)] hover:bg-[var(--pv-surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)] transition"
									>
										Browse Library
									</Link>
								</motion.div>
							)}
						</div>
					</div>
					<div aria-hidden="true" className="absolute inset-0">
						<div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-gradient-to-br from-[var(--pv-orange)]/25 to-transparent blur-2xl opacity-60" />
						<div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-br from-[var(--pv-saffron)]/20 to-transparent blur-2xl opacity-60" />
					</div>
					<motion.div
						className="w-full md:w-72 lg:w-80 aspect-square relative z-10 hidden md:block"
						initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
						whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.45, 0, 0.2, 1] }}
					>
						<div className="absolute inset-0 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]/70 p-4 grid grid-cols-3 gap-2">
							{[...Array(9)].map((_, i) => (
								<motion.div
									key={i}
									className="rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface)]/70 flex items-center justify-center text-[10px] text-[var(--pv-text-dim)]"
									initial={{ opacity: 0, scale: .9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.05 * i + 0.3, duration: 0.4 }}
								>
									▶
								</motion.div>
							))}
						</div>
					</motion.div>
				</motion.div>
			</section>
		</main>
	);
};

export default Home;
