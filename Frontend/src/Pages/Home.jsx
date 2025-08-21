import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
	const { user } = useAuth();
	return (
		<div style={{ padding: 24 }}>
			<h1>PromptVault</h1>
			<p>A lightweight hub for creating and sharing AI prompts.</p>
			{!user && <p><Link to="/auth">Get started by creating an account or logging in.</Link></p>}
			{user && <p>Welcome back, <strong>{user.name || user.email}</strong>. Visit your <Link to="/profile">profile</Link>.</p>}
		</div>
	);
};

export default Home;
