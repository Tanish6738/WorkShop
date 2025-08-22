import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import AuthPage from './Pages/Auth/Auth.jsx';
import Profile from './Pages/Users/Profile.jsx';
import PublicProfile from './Pages/Users/PublicProfile.jsx';
import PromptBrowse from './Pages/Prompts/PromptBrowse.jsx';
import MyPrompts from './Pages/Prompts/MyPrompts.jsx';
import PromptDetail from './Pages/Prompts/PromptDetail.jsx';
import CollectionBrowse from './Pages/Collections/CollectionBrowse.jsx';
import MyCollections from './Pages/Collections/MyCollections.jsx';
import CollectionDetail from './Pages/Collections/CollectionDetail.jsx';
import { Protected } from './context/AuthContext.jsx';
import AdminRoute from './Pages/Admin/AdminRoute.jsx';
import AdminLayout from './Pages/Admin/AdminLayout.jsx';
import Dashboard from './Pages/Admin/Dashboard.jsx';
import Users from './Pages/Admin/Users.jsx';
import AdminPrompts from './Pages/Admin/Prompts.jsx';
import AdminCollections from './Pages/Admin/Collections.jsx';
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
  <Route path="/collections" element={<CollectionBrowse />} />
  <Route path="/collections/mine" element={<Protected fallback={<Navigate to="/auth" replace />}> <MyCollections /> </Protected>} />
  <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/users/:id" element={<PublicProfile />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="prompts" element={<AdminPrompts />} />
          <Route path="collections" element={<AdminCollections />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;