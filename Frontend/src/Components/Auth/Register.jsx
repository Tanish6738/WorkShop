import React, { useState } from 'react';
import { register, login } from '../../Services/Auth.service';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = ({ switchMode }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
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
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<label>
				<span className="text-xs uppercase tracking-wide text-[var(--pv-text-dim)]">Name</span>
				<motion.input whileFocus={{ scale: 1.015, borderColor: 'var(--pv-orange)' }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1" />
			</label>
			<label>
				<span className="text-xs uppercase tracking-wide text-[var(--pv-text-dim)]">Email</span>
				<motion.input whileFocus={{ scale: 1.015, borderColor: 'var(--pv-orange)' }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1" />
			</label>
			<label>
				<span className="text-xs uppercase tracking-wide text-[var(--pv-text-dim)]">Password</span>
				<motion.input whileFocus={{ scale: 1.015, borderColor: 'var(--pv-orange)' }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1" />
			</label>
			{error && <div className="form-error text-sm">{error}</div>}
			<motion.button
				type="submit"
				disabled={loading}
				className="btn btn-primary w-full mt-2 disabled:opacity-60"
				whileHover={{ y: -2 }}
				whileTap={{ scale: 0.97 }}
				transition={{ duration: 0.18, ease: 'easeOut' }}
				aria-busy={loading}
			>
				{loading ? 'Creating…' : 'Create Account'}
			</motion.button>
			<p className="text-xs text-center text-[var(--pv-text-dim)]">Have an account?{' '}
				<button type="button" onClick={switchMode} className="text-[var(--pv-orange)] hover:underline font-medium">Login</button>
			</p>
		</form>
	);
};

export default Register;
