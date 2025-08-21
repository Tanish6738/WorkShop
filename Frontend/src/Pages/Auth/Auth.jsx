import React, { useState } from 'react';
import Login from '../../Components/Auth/Login.jsx';
import Register from '../../Components/Auth/Register.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const AuthPage = () => {
	const [mode, setMode] = useState('login');
	const { user } = useAuth();
	if (user) return <Navigate to="/profile" replace />;
	return (
		<div style={{ maxWidth: 420, margin: '32px auto', padding: 24, border: '1px solid #e2e2e2', borderRadius: 8 }}>
			<h2 style={{ marginBottom: 8 }}>{mode === 'login' ? 'Login' : 'Create Account'}</h2>
			{mode === 'login' ? (
				<Login switchMode={() => setMode('register')} />
			) : (
				<Register switchMode={() => setMode('login')} />
			)}
		</div>
	);
};

export default AuthPage;
