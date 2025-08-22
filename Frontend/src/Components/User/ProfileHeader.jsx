import React from 'react';
import { motion } from 'framer-motion';

const ProfileHeader = ({ loading, error, profile }) => {
  if (loading) {
    return (
      <div className="card border border-[var(--pv-border)] rounded-xl p-5 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full shimmer" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-40 shimmer rounded" />
          <div className="h-3 w-72 shimmer rounded" />
          <div className="h-3 w-52 shimmer rounded" />
        </div>
      </div>
    );
  }
  if (error) return <div className="card border border-[var(--pv-border)] rounded-xl p-5 form-error">{error}</div>;
  if (!profile) return <div className="card border border-[var(--pv-border)] rounded-xl p-5 text-sm text-[var(--pv-text-dim)]">No profile found.</div>;

  const initial = { opacity:0, y:20 };
  const animate = { opacity:1, y:0 };
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ duration:.5, ease:[0.4,0,0.2,1] }}
      className="card border border-[var(--pv-border)] rounded-xl p-5 relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,102,255,.25),transparent_70%)] pointer-events-none" />
      <div className="relative flex gap-5 items-center">
        {profile.avatarUrl ? (
          <motion.img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-[var(--pv-border)]"
            initial={{ scale:.9, opacity:0 }}
            animate={{ scale:1, opacity:1 }}
            transition={{ type:'spring', stiffness:140, damping:18, delay:.15 }}
          />
        ) : (
          <motion.div
            initial={{ scale:.8, opacity:0 }}
            animate={{ scale:1, opacity:1 }}
            transition={{ type:'spring', stiffness:140, damping:16, delay:.1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)] text-[var(--pv-black)] flex items-center justify-center text-3xl font-bold"
          >
            {(profile.name||'?').slice(0,1).toUpperCase()}
          </motion.div>
        )}
        <div className="flex-1">
          <h2 className="m-0 text-2xl font-semibold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">
            {profile.name}
          </h2>
          {profile.bio && <p className="mt-1 mb-0 text-sm text-[var(--pv-text-dim)] max-w-prose line-clamp-3">{profile.bio}</p>}
          <p className="mt-3 text-xs font-medium text-[var(--pv-text-dim)] flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--pv-orange)]"/>Prompts: <strong className="text-[var(--pv-white)] font-semibold">{profile.promptCount ?? 0}</strong></span>
            <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--pv-saffron)]"/>Collections: <strong className="text-[var(--pv-white)] font-semibold">{profile.collectionCount ?? 0}</strong></span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
