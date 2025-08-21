import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import AuthPage from './Pages/Auth/Auth.jsx';
import Profile from './Pages/Users/Profile.jsx';
import { Protected, useAuth } from './context/AuthContext.jsx';

const Nav = () => {
  const { user, logout } = useAuth();
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link>
      {!user && <Link to="/auth">Login / Register</Link>}
      {user && <Link to="/profile">Profile</Link>}
      {user && <button onClick={logout} style={{ marginLeft: 'auto' }}>Logout</button>}
    </nav>
  );
};

const App = () => {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<Protected fallback={<Navigate to="/auth" replace />}> <Profile /> </Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;