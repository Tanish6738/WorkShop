import React from 'react';

const ProfileHeader = ({ loading, error, profile }) => {
  if (loading) return <div style={box}>Loading profile...</div>;
  if (error) return <div style={{ ...box, background:'#ffe6e6', color:'#a40000' }}>{error}</div>;
  if (!profile) return <div style={box}>No profile found.</div>;
  return (
    <div style={box}>
      <div style={{ display:'flex', gap:16, alignItems:'center' }}>
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.name} style={{ width:72,height:72,borderRadius:'50%',objectFit:'cover' }} />
        ) : (
          <div style={avatarFallback}>{(profile.name||'?').slice(0,1).toUpperCase()}</div>
        )}
        <div>
          <h2 style={{ margin:'0 0 4px' }}>{profile.name}</h2>
          {profile.bio && <p style={{ margin:0, color:'#555' }}>{profile.bio}</p>}
          <p style={{ margin:'8px 0 0', fontSize:14, color:'#666' }}>
            Prompts: {profile.promptCount ?? 0} | Collections: {profile.collectionCount ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

const box = { padding:16, border:'1px solid #e3e3e3', borderRadius:8, background:'#fafafa' };
const avatarFallback = { width:72,height:72,borderRadius:'50%',background:'#222',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:600 };

export default ProfileHeader;
