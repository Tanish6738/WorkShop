import React, { useState } from 'react';
import { login } from '../../Services/Auth.service';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const Login = ({ switchMode }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true); setError(null);
		try {
			const res = await login({ email, password });
			if (res?.data?.user) setUser(res.data.user);
			navigate('/profile');
		} catch (err) {
			setError(err?.error?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
			<div className="flex flex-col gap-1">
				<label htmlFor="login-email" className="text-[11px] uppercase tracking-wide text-[var(--pv-text-dim)] font-medium">Email</label>
				<div className="relative">
					<Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)] pointer-events-none" />
					<motion.input
						id="login-email"
						type="email"
						inputMode="email"
						autoComplete="email"
						whileFocus={{ scale: 1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }}
						transition={{ type: 'spring', stiffness: 260, damping: 20 }}
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none"
						aria-invalid={!!error && !email ? 'true':'false'}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<label htmlFor="login-password" className="text-[11px] uppercase tracking-wide text-[var(--pv-text-dim)] font-medium">Password</label>
				<div className="relative">
					<Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)] pointer-events-none" />
					<motion.input
						id="login-password"
						type={showPassword? 'text':'password'}
						autoComplete="current-password"
						whileFocus={{ scale: 1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }}
						transition={{ type: 'spring', stiffness: 260, damping: 20 }}
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						className="w-full pl-10 pr-10 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none"
						aria-invalid={!!error && !password ? 'true':'false'}
					/>
					<button type="button" onClick={()=> setShowPassword(p=> !p)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-[var(--pv-surface-hover)] text-[var(--pv-text-dim)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60" aria-label={showPassword? 'Hide password':'Show password'}>
						{showPassword? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
			</div>
			<AnimatePresence>{error && (
				<motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} className="form-error text-xs flex items-center gap-2" role="alert">
					<span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
					{error}
				</motion.div>
			)}</AnimatePresence>
			<motion.button
				type="submit"
				disabled={loading}
				className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] font-medium text-sm tracking-wide hover:brightness-110 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60"
				whileHover={{ y: -2 }}
				whileTap={{ scale: 0.97 }}
				transition={{ duration: 0.18, ease: 'easeOut' }}
				aria-busy={loading}
			>
				<LogIn className="h-4 w-4" />
				<span>{loading ? 'Logging in…' : 'Login'}</span>
			</motion.button>
			<p className="text-xs text-center text-[var(--pv-text-dim)]">No account?{' '}
				<button type="button" onClick={switchMode} className="text-[var(--pv-orange)] hover:underline font-medium">Register</button>
			</p>
		</form>
	);
};

export default Login;
