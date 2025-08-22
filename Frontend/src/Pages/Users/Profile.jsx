import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getMe, updateMe } from '../../Services/Auth.service';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
	const { user, setUser } = useAuth();
	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatarUrl: user?.avatarUrl || '' });
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!user) {
			(async () => {
				try { const res = await getMe(); if (res?.data) setUser(res.data); } catch (_) {}
			})();
		}
	}, [user, setUser]);

	const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
	const onSave = async () => {
		setSaving(true); setError(null);
		try {
			const res = await updateMe(form);
			if (res?.data) { setUser(res.data); setEditing(false); }
		} catch (e) { setError(e?.error?.message || 'Update failed'); }
		finally { setSaving(false); }
	};

	if (!user) return <div className="px-6 py-10 text-sm text-[var(--pv-text-dim)]">Loading profile...</div>;

	return (
		<motion.div
			initial={{ opacity:0, y:24 }}
			animate={{ opacity:1, y:0 }}
			transition={{ duration:.55, ease:[0.4,0,0.2,1] }}
			className="px-6 py-8 max-w-2xl"
		>
			<h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">Profile</h1>
			<AnimatePresence mode="wait" initial={false}>
				{!editing ? (
					<motion.div key="view" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} className="mt-6 space-y-4">
						{user.avatarUrl && (
							<motion.img
								src={user.avatarUrl}
								alt="avatar"
								className="w-32 h-32 rounded-full object-cover ring-2 ring-[var(--pv-border)]"
								initial={{ scale:.9, opacity:0 }}
								animate={{ scale:1, opacity:1 }}
								transition={{ type:'spring', stiffness:140, damping:18 }}
							/>
						)}
						<div className="text-sm leading-relaxed space-y-1">
							<p><strong className="text-[var(--pv-white)]">Name:</strong> {user.name}</p>
							<p><strong className="text-[var(--pv-white)]">Email:</strong> {user.email}</p>
							{user.bio && <p><strong className="text-[var(--pv-white)]">Bio:</strong> {user.bio}</p>}
						</div>
						<motion.button
							whileHover={{ y:-2 }}
							whileTap={{ scale:.95 }}
							onClick={() => { setForm({ name: user.name || '', bio: user.bio || '', avatarUrl: user.avatarUrl || '' }); setEditing(true); }}
							className="px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]"
						>
							Edit Profile
						</motion.button>
					</motion.div>
				) : (
					<motion.div key="edit" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} className="mt-6 space-y-5">
						<div className="flex flex-col gap-4 text-sm">
							<label className="font-medium">Name
								<input name="name" value={form.name} onChange={onChange} className="mt-1 px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60" />
							</label>
							<label className="font-medium">Avatar URL
								<input name="avatarUrl" value={form.avatarUrl} onChange={onChange} className="mt-1 px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60" />
							</label>
							<label className="font-medium">Bio
								<textarea name="bio" value={form.bio} onChange={onChange} rows={5} className="mt-1 px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 resize-y" />
							</label>
						</div>
						{error && <div className="form-error text-xs">{error}</div>}
						<div className="flex gap-3 pt-1">
							<motion.button whileHover={{ y:-2 }} whileTap={{ scale:.95 }} onClick={onSave} disabled={saving} className="px-4 py-2 rounded-md text-sm font-medium bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">{saving ? 'Saving...' : 'Save'}</motion.button>
							<motion.button whileHover={{ y:-2 }} whileTap={{ scale:.95 }} onClick={() => setEditing(false)} className="px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Cancel</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default Profile;
