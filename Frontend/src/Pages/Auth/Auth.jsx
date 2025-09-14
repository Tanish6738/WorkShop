import React, { useState, useMemo, useCallback } from 'react';
import Login from '../../Components/Auth/Login.jsx';
import Register from '../../Components/Auth/Register.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, ArrowLeftRight } from 'lucide-react';

const AuthPage = () => {
	const [mode, setMode] = useState('login');
	const { user } = useAuth();
	const toggleMode = useCallback(() => setMode(m => m === 'login' ? 'register' : 'login'), []);

	const meta = useMemo(() => ({
		heading: mode === 'login' ? 'Welcome back' : 'Create your account',
		sub: mode === 'login' ? 'Access your saved prompts and collections.' : 'Join to curate, remix, and organize prompts.'
	}), [mode]);

	if (user) return <Navigate to="/profile" replace />;

	return (
		<main aria-labelledby="auth-heading" className="relative px-5 py-14 md:py-20 min-h-[calc(100vh-120px)] flex items-start">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-0 -translate-x-1/2 w-[70rem] h-[70rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.05]" />
			</div>
			<div className="max-w-sm w-full mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 28, scale:.95 }}
					animate={{ opacity: 1, y: 0, scale:1 }}
					transition={{ duration: .6, ease: [0.4,0,0.2,1] }}
					className="p-7 card border border-[var(--pv-border)] rounded-2xl bg-[var(--pv-surface)]/85 backdrop-blur shadow-lg shadow-black/20 relative overflow-hidden"
				>
					<div aria-hidden="true" className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--pv-orange)]/10 blur-2xl" />
					<header className="mb-6 space-y-2">
						<h1 id="auth-heading" className="text-2xl font-bold tracking-tight flex items-center gap-2 bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">
							{mode === 'login' ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
							{meta.heading}
						</h1>
						<p className="text-sm text-[var(--pv-text-dim)] leading-relaxed">{meta.sub}</p>
					</header>
					<div className="mb-5">
						<button
							onClick={toggleMode}
							aria-label={mode === 'login' ? 'Switch to registration form' : 'Switch to login form'}
							className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] text-[11px] font-medium hover:bg-[var(--pv-surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60 transition-colors"
						>
							<ArrowLeftRight className="h-3.5 w-3.5 group-hover:text-[var(--pv-orange)] transition-colors" />
							<span>{mode === 'login' ? 'Need an account?' : 'Have an account?'}</span>
						</button>
					</div>
					<AnimatePresence mode="wait" initial={false}>
						{mode === 'login' ? (
							<motion.div
								key="login"
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.4, ease: [0.4,0,0.2,1] }}
							>
								<Login switchMode={() => setMode('register')} />
							</motion.div>
						) : (
							<motion.div
								key="register"
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.4, ease: [0.4,0,0.2,1] }}
							>
								<Register switchMode={() => setMode('login')} />
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</main>
	);
};

export default AuthPage;
