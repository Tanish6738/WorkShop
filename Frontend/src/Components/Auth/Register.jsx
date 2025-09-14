import React, { useState } from 'react';
import { register, login } from '../../Services/Auth.service';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Register = ({ switchMode }) => {
	const [name, setName] = useState('');
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
			await register({ name, email, password });
			// Auto-login after register
			const res = await login({ email, password });
			if (res?.data?.user) setUser(res.data.user);
			navigate('/profile');
		} catch (err) {
			setError(err?.error?.message || 'Registration failed');
		} finally { setLoading(false); }
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
			<div className="flex flex-col gap-1">
				<label htmlFor="register-name" className="text-[11px] uppercase tracking-wide text-[var(--pv-text-dim)] font-medium">Name</label>
				<div className="relative">
					<UserPlus className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)]" />
					<motion.input id="register-name" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" whileFocus={{ scale:1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none" />
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<label htmlFor="register-email" className="text-[11px] uppercase tracking-wide text-[var(--pv-text-dim)] font-medium">Email</label>
				<div className="relative">
					<Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)]" />
					<motion.input id="register-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" inputMode="email" whileFocus={{ scale:1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none" />
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<label htmlFor="register-password" className="text-[11px] uppercase tracking-wide text-[var(--pv-text-dim)] font-medium">Password</label>
				<div className="relative">
					<Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-dim)]" />
					<motion.input id="register-password" type={showPassword? 'text':'password'} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" whileFocus={{ scale:1.01, boxShadow:'0 0 0 2px var(--pv-orange)' }} transition={{ type:'spring', stiffness:260, damping:20 }} className="w-full pl-10 pr-10 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-sm focus:outline-none" />
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
			<motion.button type="submit" disabled={loading} aria-busy={loading} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] font-medium text-sm tracking-wide hover:brightness-110 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60" whileHover={{ y:-2 }} whileTap={{ scale:.97 }} transition={{ duration:.18, ease:'easeOut' }}>
				<span>{loading? 'Creating…':'Create Account'}</span>
			</motion.button>
			<p className="text-xs text-center text-[var(--pv-text-dim)]">Have an account?{' '}<button type="button" onClick={switchMode} className="text-[var(--pv-orange)] hover:underline font-medium">Login</button></p>
		</form>
	);
};

export default Register;
