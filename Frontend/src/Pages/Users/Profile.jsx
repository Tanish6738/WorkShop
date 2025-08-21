import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getMe, updateMe } from '../../Services/Auth.service';

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

	if (!user) return <div style={{ padding: 24 }}>Loading profile...</div>;

	return (
		<div style={{ padding: 24, maxWidth: 640 }}>
			<h1>Profile</h1>
			{!editing ? (
				<div style={{ marginTop: 12 }}>
					{user.avatarUrl && <img src={user.avatarUrl} alt="avatar" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: '50%' }} />}
					<p><strong>Name:</strong> {user.name}</p>
						<p><strong>Email:</strong> {user.email}</p>
					{user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
					<button onClick={() => { setForm({ name: user.name || '', bio: user.bio || '', avatarUrl: user.avatarUrl || '' }); setEditing(true); }} style={btn}>Edit Profile</button>
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
					<label>Name
						<input name="name" value={form.name} onChange={onChange} style={input} />
					</label>
					<label>Avatar URL
						<input name="avatarUrl" value={form.avatarUrl} onChange={onChange} style={input} />
					</label>
					<label>Bio
						<textarea name="bio" value={form.bio} onChange={onChange} rows={4} style={textarea} />
					</label>
					{error && <div style={errBox}>{error}</div>}
					<div style={{ display: 'flex', gap: 8 }}>
						<button onClick={onSave} disabled={saving} style={btn}>{saving ? 'Saving...' : 'Save'}</button>
						<button onClick={() => setEditing(false)} style={btnSecondary}>Cancel</button>
					</div>
				</div>
			)}
		</div>
	);
};

const btn = { padding: '8px 14px', background: '#222', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' };
const btnSecondary = { ...btn, background: '#666' };
const input = { width: '100%', padding: '8px 10px', marginTop: 4, border: '1px solid #ccc', borderRadius: 4 };
const textarea = { ...input, resize: 'vertical' };
const errBox = { background: '#ffe6e6', color: '#a40000', padding: '6px 8px', borderRadius: 4 };

export default Profile;
