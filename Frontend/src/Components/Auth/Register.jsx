import React, { useState } from 'react';
import { register, login } from '../../Services/Auth.service';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

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
		<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
			<label>Name
				<input value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
			</label>
			<label>Email
				<input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
			</label>
			<label>Password
				<input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
			</label>
			{error && <div style={errorStyle}>{error}</div>}
			<button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Creating...' : 'Create Account'}</button>
			<p style={{ fontSize: 14 }}>Have an account? <button type="button" onClick={switchMode} style={linkButton}>Login</button></p>
		</form>
	);
};

const inputStyle = { width: '100%', padding: '8px 10px', marginTop: 4, border: '1px solid #ccc', borderRadius: 4 };
const buttonStyle = { padding: '10px 14px', background: '#222', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' };
const linkButton = { background: 'none', border: 'none', padding: 0, margin: 0, color: '#0055cc', cursor: 'pointer' };
const errorStyle = { background: '#ffe6e6', color: '#a40000', padding: '6px 8px', borderRadius: 4 };

export default Register;
