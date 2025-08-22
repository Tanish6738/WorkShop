import React, { useState } from 'react';
import Login from '../../Components/Auth/Login.jsx';
import Register from '../../Components/Auth/Register.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
	const [mode, setMode] = useState('login');
	const { user } = useAuth();
	if (user) return <Navigate to="/profile" replace />;
	return (
		<motion.div
			className="max-w-sm w-full mx-auto mt-10 p-6 card hover-lift border border-[var(--pv-border)] rounded-xl backdrop-blur bg-[var(--pv-surface)]/90"
			initial={{ opacity: 0, y: 24, scale: .96 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.5, ease: [0.83, 0, 0.17, 1] }}
		>
			<h2 className="text-xl font-semibold mb-4 tracking-tight flex items-center justify-between">
				{mode === 'login' ? 'Login' : 'Create Account'}
				<button
					onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}
					className="text-[10px] uppercase tracking-wider text-[var(--pv-text-dim)] hover:text-[var(--pv-orange)] transition-colors"
				>
					{mode === 'login' ? 'Create account' : 'Have account?'}
				</button>
			</h2>
			<AnimatePresence mode="wait" initial={false}>
				{mode === 'login' ? (
					<motion.div
						key="login"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.35, ease: 'easeOut' }}
					>
						<Login switchMode={() => setMode('register')} />
					</motion.div>
				) : (
					<motion.div
						key="register"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.35, ease: 'easeOut' }}
					>
						<Register switchMode={() => setMode('login')} />
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default AuthPage;
