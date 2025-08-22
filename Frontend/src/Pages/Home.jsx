import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
	const { user } = useAuth();
	return (
		<div className="px-5 py-10 md:py-14 max-w-5xl mx-auto anim-fade-in">
			<div className="space-y-6">
				<div className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-[var(--pv-surface)] border border-[var(--pv-border)] text-[var(--pv-text-dim)] tracking-wide">ALPHA</div>
				<h1 className="text-3xl md:text-5xl font-bold leading-tight anim-slide-up bg-gradient-to-r from-[var(--pv-orange)] via-[var(--pv-saffron)] to-[var(--pv-orange)] bg-clip-text text-transparent">
					PromptVault
				</h1>
				<p className="max-w-prose text-[var(--pv-text-dim)] text-base md:text-lg">A lightweight hub for creating, organizing, and sharing AI prompts. Craft reusable prompt assets, group them into themed collections, and explore what others publish.</p>
				{!user && (
					<div className="flex flex-col sm:flex-row gap-3 pt-2">
						<Link to="/auth" className="btn btn-primary text-sm md:text-base">Get Started</Link>
						<Link to="/prompts" className="btn btn-secondary text-sm md:text-base">Browse Prompts</Link>
					</div>
				)}
				{user && (
					<p className="text-sm md:text-base">Welcome back, <span className="font-semibold text-[var(--pv-orange)]">{user.name || user.email}</span>. Visit your{' '}<Link to="/profile" className="font-medium text-[var(--pv-saffron)] hover:underline">profile</Link>.</p>
				)}
			</div>
		</div>
	);
};

export default Home;
