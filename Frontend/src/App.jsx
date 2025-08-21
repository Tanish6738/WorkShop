import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import AuthPage from './Pages/Auth/Auth.jsx';
import Profile from './Pages/Users/Profile.jsx';
import PublicProfile from './Pages/Users/PublicProfile.jsx';
import PromptBrowse from './Pages/Prompts/PromptBrowse.jsx';
import MyPrompts from './Pages/Prompts/MyPrompts.jsx';
import PromptDetail from './Pages/Prompts/PromptDetail.jsx';
import { Protected } from './context/AuthContext.jsx';
import Navbar from './Components/Navbar.jsx';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
  <Route path="/profile" element={<Protected fallback={<Navigate to="/auth" replace />}> <Profile /> </Protected>} />
  <Route path="/prompts" element={<PromptBrowse />} />
  <Route path="/prompts/mine" element={<Protected fallback={<Navigate to="/auth" replace />}> <MyPrompts /> </Protected>} />
  <Route path="/prompts/:id" element={<PromptDetail />} />
        <Route path="/users/:id" element={<PublicProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;