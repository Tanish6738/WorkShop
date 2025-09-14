import React from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Layers3, FileText } from 'lucide-react';

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
    <motion.section
      initial={initial}
      animate={animate}
      transition={{ duration:.55, ease:[0.4,0,0.2,1] }}
      className="card border border-[var(--pv-border)] rounded-xl p-5 relative overflow-hidden"
      aria-label="User profile header"
    >
      <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,160,0,.28),transparent_72%)] pointer-events-none" />
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
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)] text-[var(--pv-black)] flex items-center justify-center text-3xl font-bold relative"
            aria-label={`Avatar placeholder for ${profile.name}`}
          >
            <UserIcon className="absolute inset-0 m-auto h-10 w-10 opacity-20" aria-hidden="true" />
            <span className="relative">{(profile.name||'?').slice(0,1).toUpperCase()}</span>
          </motion.div>
        )}
        <div className="flex-1">
          <h2 className="m-0 text-2xl font-semibold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">
            {profile.name}
          </h2>
          {profile.bio && <p className="mt-1 mb-0 text-sm text-[var(--pv-text-dim)] max-w-prose line-clamp-3" aria-label="User bio">{profile.bio}</p>}
          <dl className="mt-4 grid grid-cols-2 sm:inline-flex sm:flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[var(--pv-text-dim)]" aria-label="User statistics">
            <div className="flex items-center gap-1.5">
              <dt className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-[var(--pv-orange)]" /><span>Prompts</span></dt>
              <dd className="text-[var(--pv-white)] font-semibold">{profile.promptCount ?? 0}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="inline-flex items-center gap-1"><Layers3 className="h-3.5 w-3.5 text-[var(--pv-saffron)]" /><span>Collections</span></dt>
              <dd className="text-[var(--pv-white)] font-semibold">{profile.collectionCount ?? 0}</dd>
            </div>
          </dl>
        </div>
      </div>
    </motion.section>
  );
};

export default ProfileHeader;
