import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate('/');
	};

		const location = useLocation();

		const navLinkStyle = ({ isActive }) => ({
			...link,
			fontWeight: isActive ? 600 : 400,
			color: isActive ? '#111' : link.color,
			position: 'relative'
		});

		return (
			<header style={bar}>
				<div style={left}>
					<Link to="/" style={brand}>PromptVault</Link>
					<NavLink to="/" style={navLinkStyle} end>Home</NavLink>
					<NavLink to="/prompts" style={navLinkStyle}>Browse</NavLink>
					{user && <NavLink to="/prompts/mine" style={navLinkStyle}>My Prompts</NavLink>}
					<NavLink to="/collections" style={navLinkStyle}>Collections</NavLink>
					{user && <NavLink to="/collections/mine" style={navLinkStyle}>My Collections</NavLink>}
					{user && <NavLink to="/profile" style={navLinkStyle}>My Profile</NavLink>}
				</div>
				<div style={right}>
					{user && location.pathname.startsWith('/prompts/mine') && (
						<Link to="/prompts/mine" state={{ openForm:true }} style={buttonGhost}>+ New Prompt</Link>
					)}
					{user && location.pathname.startsWith('/collections/mine') && (
						<Link to="/collections/mine" state={{ openForm:true }} style={buttonGhost}>+ New Collection</Link>
					)}
					{!user && <Link to="/auth" style={buttonPrimary}>Login / Register</Link>}
					{user && (
						<div style={{ display:'flex', alignItems:'center', gap:12 }}>
							<Link to={`/users/${user.id || user._id}`} style={userLink} title="Public profile">
								<span style={avatar}>{(user.name || user.email || '?').slice(0,1).toUpperCase()}</span>
								<span>{user.name || user.email}</span>
							</Link>
							<button onClick={handleLogout} style={buttonSecondary}>Logout</button>
						</div>
					)}
				</div>
			</header>
		);
};

const bar = { display:'flex', justifyContent:'space-between', padding:'10px 20px', borderBottom:'1px solid #e4e4e4', background:'#fff', position:'sticky', top:0, zIndex:10 };
const left = { display:'flex', alignItems:'center', gap:16 };
const right = { display:'flex', alignItems:'center', gap:16 };
const brand = { fontWeight:600, fontSize:18, textDecoration:'none', color:'#222' };
const link = { textDecoration:'none', color:'#444', fontSize:14, padding:'4px 6px', borderRadius:4, transition:'background .15s' };
const buttonPrimary = { background:'#222', color:'#fff', padding:'8px 14px', borderRadius:6, textDecoration:'none', fontSize:14 };
const buttonSecondary = { background:'#eee', color:'#222', padding:'6px 12px', border:'1px solid #ccc', borderRadius:6, cursor:'pointer' };
const buttonGhost = { background:'transparent', color:'#222', padding:'6px 12px', border:'1px dashed #999', borderRadius:6, textDecoration:'none', fontSize:14 };
const userLink = { display:'flex', alignItems:'center', gap:8, textDecoration:'none', color:'#222', fontSize:14 };
const avatar = { width:32, height:32, borderRadius:'50%', background:'#222', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:600 };

export default Navbar;
