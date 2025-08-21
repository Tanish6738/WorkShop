import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, getUserPrompts, getUserCollections } from '../../Services/user.service';
import ProfileHeader from '../../Components/User/ProfileHeader.jsx';
import UserPrompts from '../../Components/User/UserPrompts.jsx';
import UserCollections from '../../Components/User/UserCollections.jsx';

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPrompts, setLoadingPrompts] = useState(true);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);
  const [errorPrompts, setErrorPrompts] = useState(null);
  const [errorCollections, setErrorCollections] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoadingProfile(true); setErrorProfile(null);
    getUserProfile(id)
      .then(r => setProfile(r.data))
      .catch(e => setErrorProfile(e?.error?.message || 'Failed to load profile'))
      .finally(() => setLoadingProfile(false));

    setLoadingPrompts(true); setErrorPrompts(null);
    getUserPrompts(id)
      .then(r => setPrompts(r.data))
      .catch(e => setErrorPrompts(e?.error?.message || 'Failed to load prompts'))
      .finally(() => setLoadingPrompts(false));

    setLoadingCollections(true); setErrorCollections(null);
    getUserCollections(id)
      .then(r => setCollections(r.data))
      .catch(e => setErrorCollections(e?.error?.message || 'Failed to load collections'))
      .finally(() => setLoadingCollections(false));
  }, [id]);

  return (
    <div style={{ padding:24, maxWidth:960, margin:'0 auto' }}>
      <ProfileHeader loading={loadingProfile} error={errorProfile} profile={profile} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32 }}>
        <UserPrompts loading={loadingPrompts} error={errorPrompts} prompts={prompts} />
        <UserCollections loading={loadingCollections} error={errorCollections} collections={collections} />
      </div>
    </div>
  );
};

export default PublicProfile;
