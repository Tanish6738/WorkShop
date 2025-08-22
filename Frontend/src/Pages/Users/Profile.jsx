import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getMe, updateMe } from "../../Services/Auth.service";
import { motion, AnimatePresence } from "framer-motion";
import { getUserPrompts, getUserCollections } from "../../Services/User.service";
import UserPrompts from "../../Components/User/UserPrompts.jsx";
import UserCollections from "../../Components/User/UserCollections.jsx";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);
  const [bioLimit] = useState(280);
  const [avatarError, setAvatarError] = useState(false);
  const fileInputRef = useRef(null);
  const [actionMsg, setActionMsg] = useState("");
  // Own content
  const [myPrompts, setMyPrompts] = useState([]);
  const [myCollections, setMyCollections] = useState([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [errorPrompts, setErrorPrompts] = useState(null);
  const [errorCollections, setErrorCollections] = useState(null);
  const [contentTab, setContentTab] = useState("prompts");
  // filters for own content
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [visiblePrompts, setVisiblePrompts] = useState(6);
  const [visibleCollections, setVisibleCollections] = useState(6);

  useEffect(() => {
    if (!user) {
      (async () => {
        try {
          const res = await getMe();
          if (res?.data) setUser(res.data);
        } catch (_) {}
      })();
    }
  }, [user, setUser]);

  // Fetch own prompts & collections when user arrives
  useEffect(() => {
    if (!user) return;
    const uid = user.id || user._id;
    if (!uid) return;
    setLoadingPrompts(true); setErrorPrompts(null);
    getUserPrompts(uid)
      .then(r => setMyPrompts(r.data))
      .catch(e => setErrorPrompts(e?.error?.message || "Failed to load prompts"))
      .finally(()=> setLoadingPrompts(false));
    setLoadingCollections(true); setErrorCollections(null);
    getUserCollections(uid)
      .then(r => setMyCollections(r.data))
      .catch(e => setErrorCollections(e?.error?.message || "Failed to load collections"))
      .finally(()=> setLoadingCollections(false));
  }, [user]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const hasChanges = () => !!originalForm && (originalForm.name !== form.name || originalForm.bio !== form.bio || originalForm.avatarUrl !== form.avatarUrl);
  const startEditing = () => {
    setForm({ name: user.name || "", bio: user.bio || "", avatarUrl: user.avatarUrl || "" });
    setOriginalForm({ name: user.name || "", bio: user.bio || "", avatarUrl: user.avatarUrl || "" });
    setAvatarError(false);
    setEditing(true);
  };
  const showMsg = (m) => { setActionMsg(m); setTimeout(() => setActionMsg(""), 3000); };
  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await updateMe(form);
      if (res?.data) {
        setUser(res.data);
        setEditing(false);
        setOriginalForm(null);
        showMsg("Profile updated");
      }
    } catch (e) {
      setError(e?.error?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };
  const resetChanges = () => { if (originalForm) setForm(originalForm); };
  const clearAvatar = () => setForm((f) => ({ ...f, avatarUrl: "" }));
  const clearBio = () => setForm((f) => ({ ...f, bio: "" }));
  const triggerFile = () => fileInputRef.current?.click();
  const onFileChange = (e) => { const file = e.target.files?.[0]; if (!file) return; const url = URL.createObjectURL(file); setForm((f) => ({ ...f, avatarUrl: url })); setAvatarError(false); };
  useEffect(() => { const beforeUnload = (e) => { if (editing && hasChanges()) { e.preventDefault(); e.returnValue = ""; } }; window.addEventListener("beforeunload", beforeUnload); return () => window.removeEventListener("beforeunload", beforeUnload); }, [editing, form]);

  // Derived lists with filter + sort
  const filteredPrompts = useMemo(() => {
    let list = Array.isArray(myPrompts) ? [...myPrompts] : [];
    if (filter) { const q = filter.toLowerCase(); list = list.filter(p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)); }
    list.sort((a,b)=>{ const dir = sortDir === 'asc' ? 1 : -1; if (sortField === 'title') return (a.title||'').localeCompare(b.title||'')*dir; if (sortField === 'likes') return ((a.likes||0)-(b.likes||0))*dir; const da=new Date(a.createdAt||0).getTime(); const db=new Date(b.createdAt||0).getTime(); return (da-db)*dir; });
    return list;
  }, [myPrompts, filter, sortField, sortDir]);
  const filteredCollections = useMemo(() => {
    let list = Array.isArray(myCollections) ? [...myCollections] : [];
    if (filter) { const q = filter.toLowerCase(); list = list.filter(c => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)); }
    list.sort((a,b)=>{ const dir = sortDir === 'asc' ? 1 : -1; if (sortField === 'title') return (a.name||'').localeCompare(b.name||'')*dir; if (sortField === 'likes') return ((a.likes||0)-(b.likes||0))*dir; const da=new Date(a.createdAt||0).getTime(); const db=new Date(b.createdAt||0).getTime(); return (da-db)*dir; });
    return list;
  }, [myCollections, filter, sortField, sortDir]);
  const visiblePromptSlice = filteredPrompts.slice(0, visiblePrompts);
  const visibleCollectionSlice = filteredCollections.slice(0, visibleCollections);

  const ContentControls = () => (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-5">
      <div className="flex gap-2 flex-1">
        <input value={filter} onChange={e=>{setFilter(e.target.value); setVisiblePrompts(6); setVisibleCollections(6);}} placeholder="Search my content" className="flex-1 px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/50" />
        <select value={sortField} onChange={e=>setSortField(e.target.value)} className="px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs focus:outline-none">
          <option value="createdAt">Newest</option>
          <option value="title">Title</option>
          <option value="likes">Likes</option>
        </select>
        <button onClick={()=>setSortDir(d=> d==='asc'?'desc':'asc')} className="px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs hover:bg-[var(--pv-surface-hover)]">{sortDir==='asc'? '↑':'↓'}</button>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-[var(--pv-text-dim)]">
        <span>{filteredPrompts.length} prompts</span>
        <span>•</span>
        <span>{filteredCollections.length} collections</span>
      </div>
    </div>
  );

  if (!user)
    return (
      <div className="px-6 py-10 text-sm text-[var(--pv-text-dim)]">
        Loading profile...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      className="pb-20"
    >
      {/* Decorative hero */}
      <div className="relative overflow-hidden border-b border-[var(--pv-border)] bg-[radial-gradient(circle_at_25%_15%,rgba(255,153,0,.25),transparent_70%)]">
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-10 md:pt-14 md:pb-16">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {user.avatarUrl ? (
              <motion.img
                src={user.avatarUrl}
                alt="avatar"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-2 ring-[var(--pv-border)] shadow-[0_0_0_4px_rgba(255,153,0,0.08)]"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
              />
            ) : (
              <motion.div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)] flex items-center justify-center text-3xl font-bold text-[var(--pv-black)]"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 170, damping: 20 }}
              >
                {(user.name || "?").slice(0, 1).toUpperCase()}
              </motion.div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">
                Profile
              </h1>
              <p className="mt-2 text-xs uppercase tracking-wider text-[var(--pv-text-dim)]">Manage your personal information</p>
              <div className="mt-5 flex gap-3 flex-wrap text-[11px] font-medium">
                <span className="px-3 py-1 rounded-full bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]/60">Email: {user.email}</span>
                {user.bio && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="px-3 py-1 rounded-full bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]/60 line-clamp-1"
                    title={user.bio}
                  >
                    Bio: {user.bio}
                  </motion.span>
                )}
              </div>
            </div>
            {!editing && (
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={startEditing}
                className="self-start sm:self-auto px-4 py-2 rounded-md text-sm font-medium bg-[var(--pv-orange)] text-[var(--pv-black)] shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60"
              >
                Edit
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8 relative">
        {actionMsg && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute -top-4 right-4 text-[10px] px-2 py-1 rounded bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-[var(--pv-text-dim)]">{actionMsg}</motion.div>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {!editing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-4 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]/60 backdrop-blur-sm text-sm"
                >
                  <p className="text-[var(--pv-text-dim)] text-xs mb-1">Name</p>
                  <p className="font-medium text-[var(--pv-white)]">{user.name}</p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-4 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]/60 backdrop-blur-sm text-sm"
                >
                  <p className="text-[var(--pv-text-dim)] text-xs mb-1">Email</p>
                  <p className="font-medium text-[var(--pv-white)] break-all">{user.email}</p>
                </motion.div>
                {user.bio && (
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="p-4 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]/60 backdrop-blur-sm text-sm sm:col-span-2"
                  >
                    <p className="text-[var(--pv-text-dim)] text-xs mb-1">Bio</p>
                    <p className="font-medium leading-relaxed text-[var(--pv-white)] whitespace-pre-line">{user.bio}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-8"
            >
              <div className="grid gap-6">
                <FloatingField label="Name">
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your display name"
                    className="w-full px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 text-sm"
                  />
                </FloatingField>
                <FloatingField label="Avatar URL">
                  <input
                    name="avatarUrl"
                    value={form.avatarUrl}
                    onChange={onChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 text-sm"
                  />
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                    <button type="button" onClick={triggerFile} className="px-2 py-1 rounded bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]">Upload</button>
                    <button type="button" onClick={clearAvatar} className="px-2 py-1 rounded bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]">Clear</button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                  {form.avatarUrl && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 inline-block relative">
                      {!avatarError ? (
                        <img src={form.avatarUrl} alt="preview" onError={() => setAvatarError(true)} className="w-24 h-24 object-cover rounded-full border border-[var(--pv-border)] ring-1 ring-[var(--pv-border)]/40" />
                      ) : (
                        <div className="w-24 h-24 flex items-center justify-center text-[10px] bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] rounded-full text-[var(--pv-text-dim)]">Invalid image</div>
                      )}
                    </motion.div>
                  )}
                </FloatingField>
                <FloatingField label="Bio">
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={onChange}
                    rows={5}
                    placeholder="A short description about you..."
                    className="w-full px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 text-sm resize-y"
                  />
                  <div className="flex justify-between mt-1 text-[10px] text-[var(--pv-text-dim)]">
                    <span>{form.bio.length}/{bioLimit}</span>
                    <span className={form.bio.length > bioLimit ? "text-red-400" : form.bio.length > bioLimit * 0.85 ? "text-[var(--pv-orange)]" : ""}>
                      {form.bio.length > bioLimit ? "Too long" : form.bio.length > bioLimit * 0.85 ? "Approaching limit" : ""}
                    </span>
                  </div>
                </FloatingField>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="form-error text-xs"
                >
                  {error}
                </motion.div>
              )}
              <div className="flex flex-wrap gap-3 pt-1 items-center">
                <div className="flex gap-2 order-2 sm:order-1">
                  <button type="button" onClick={resetChanges} disabled={!hasChanges()} className="px-3 py-1 rounded-md text-[10px] font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] disabled:opacity-40">Reset</button>
                  <button type="button" onClick={clearBio} className="px-3 py-1 rounded-md text-[10px] font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Clear Bio</button>
                </div>
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={onSave}
                  disabled={saving}
                  className="px-5 py-2 rounded-md text-sm font-medium bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </motion.button>
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setEditing(false)}
                  className="px-5 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]"
                >
                  Cancel
                </motion.button>
                {hasChanges() && !saving && <span className="text-[10px] text-[var(--pv-text-dim)] ml-2">Unsaved changes</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* My Content Section */}
        <div className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight mb-4 bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent">My Content</h2>
          <div className="mb-4 inline-flex rounded-lg overflow-hidden border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]">
            {['prompts','collections'].map(tab => (
              <button key={tab} onClick={()=>setContentTab(tab)} className={`px-4 py-2 text-xs font-medium transition-colors ${contentTab===tab? 'bg-[var(--pv-surface)] text-[var(--pv-white)]':'text-[var(--pv-text-dim)] hover:text-[var(--pv-white)]'}`}>{tab.charAt(0).toUpperCase()+tab.slice(1)}</button>
            ))}
          </div>
          <ContentControls />
          <AnimatePresence mode="wait" initial={false}>
            {contentTab === 'prompts' && (
              <motion.div key="mine-prompts" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.4,ease:[0.4,0,0.2,1]}}>
                <UserPrompts loading={loadingPrompts} error={errorPrompts} prompts={visiblePromptSlice} />
                {visiblePrompts < filteredPrompts.length && !loadingPrompts && (
                  <div className="mt-4 flex justify-center">
                    <button onClick={()=>setVisiblePrompts(v=>v+6)} className="px-4 py-2 text-xs rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Load More</button>
                  </div>
                )}
              </motion.div>
            )}
            {contentTab === 'collections' && (
              <motion.div key="mine-collections" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.4,ease:[0.4,0,0.2,1]}}>
                <UserCollections loading={loadingCollections} error={errorCollections} collections={visibleCollectionSlice} />
                {visibleCollections < filteredCollections.length && !loadingCollections && (
                  <div className="mt-4 flex justify-center">
                    <button onClick={()=>setVisibleCollections(v=>v+6)} className="px-4 py-2 text-xs rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Load More</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Small helper component for label micro-interaction
const FloatingField = ({ label, children }) => {
  return (
    <motion.label
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-xs font-medium tracking-wide space-y-1 text-[var(--pv-text-dim)]"
    >
      <span className="inline-block px-2 py-1 rounded-md bg-[var(--pv-surface-alt)]/40 border border-[var(--pv-border)]/60 text-[10px] uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
    </motion.label>
  );
};

export default Profile;
