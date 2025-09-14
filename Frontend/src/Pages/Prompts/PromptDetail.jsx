import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPrompt,
  listVersions,
  likePrompt,
  unlikePrompt,
  incrementView,
  listRemixes,
  remixPrompt,
  deletePrompt,
  createVersion,
  restoreVersion,
  deleteVersion,
} from "../../Services/prompt.service";
import {
  listCollections,
  addPromptToCollection,
} from "../../Services/collection.service";
import PromptForm from "../../Components/Prompt/PromptForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Heart,
  HeartOff,
  Repeat2,
  Layers2,
  PlusCircle,
  History,
  PenLine,
  Trash2,
  X,
  FolderPlus,
  Save,
} from "lucide-react";

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState(null);
  const [versions, setVersions] = useState([]);
  const [remixes, setRemixes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [liking, setLiking] = useState(false);
  const [likeState, setLikeState] = useState(false); // naive local like state
  const [remixLoading, setRemixLoading] = useState(false);
  // Collection add panel state
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [addingToCollection, setAddingToCollection] = useState(false);
  const [addError, setAddError] = useState(null);
  // Remix panel state
  const [showRemixPanel, setShowRemixPanel] = useState(false);
  const [remixTitle, setRemixTitle] = useState("");
  const [remixCollection, setRemixCollection] = useState("");
  const [remixError, setRemixError] = useState(null);
  // Version management state
  const [showVersionsPanel, setShowVersionsPanel] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null); // object
  const [versionContent, setVersionContent] = useState("");
  const [versionLoading, setVersionLoading] = useState(false);
  const [versionError, setVersionError] = useState(null);
  const [creatingVersion, setCreatingVersion] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState(false);
  const [deletingVersion, setDeletingVersion] = useState(false);
  // Copy to clipboard state
  const [copied, setCopied] = useState(false);
  // Active viewing version (for read-only switching at bottom list)
  const [activeVersion, setActiveVersion] = useState(null); // {versionNumber, content}

  // IMPORTANT: Keep hook order stable. This useMemo must appear before any conditional returns.
  // Previously it was placed after early returns (loading/error/not found) causing a hook order mismatch.
  const statItems = useMemo(() => ([
    { label: 'Likes', value: prompt?.stats?.likes ?? 0 },
    { label: 'Views', value: prompt?.stats?.views ?? 0 },
    { label: 'Remixes', value: remixes.length },
    { label: 'Versions', value: versions.length }
  ]), [prompt, remixes, versions]);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getPrompt(id),
      listVersions(id),
      listRemixes(id),
      incrementView(id),
    ])
      .then(([p, v, r]) => {
        setPrompt(p.data);
        setVersions(v.data);
        setRemixes(r.data);
      })
      .catch((e) => setError(e?.error?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);
  // Reset active viewed version whenever prompt id changes or reloaded
  useEffect(() => {
    setActiveVersion(null);
  }, [id]);

  const isOwner =
    user &&
    prompt &&
    (prompt.createdBy === user.id || prompt.createdBy === user._id);

  const reloadVersions = async (preserveSelection = false) => {
    try {
      const v = await listVersions(id);
      setVersions(v.data);
      if (preserveSelection && selectedVersion) {
        const match = v.data.find(
          (x) => x.versionNumber === selectedVersion.versionNumber
        );
        if (!match) setSelectedVersion(null);
      }
    } catch (_) {}
  };

  const toggleLike = async () => {
    if (!user || liking) return;
    setLiking(true);
    try {
      if (!likeState) {
        await likePrompt(id);
        setLikeState(true);
        if (prompt) prompt.stats.likes += 1;
      } else {
        await unlikePrompt(id);
        setLikeState(false);
        if (prompt) prompt.stats.likes -= 1;
      }
      setPrompt({ ...prompt });
    } catch (_) {
      /* ignore */
    } finally {
      setLiking(false);
    }
  };

  const copyContent = async () => {
    if (!prompt?.content || copied) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
    } catch (_) {
      try {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = prompt.content;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
      } catch (_) {
        /* ignore */
      }
    } finally {
      if (!copied) setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const doRemix = async () => {
    if (!user || remixLoading) return;
    setRemixLoading(true);
    setRemixError(null);
    try {
      const payload = {};
      if (remixTitle.trim()) payload.title = remixTitle.trim();
      const res = await remixPrompt(id, payload);
      if (res?.data) {
        const newId = res.data._id;
        if (remixCollection) {
          try {
            await addPromptToCollection(remixCollection, newId);
          } catch (_) {
            /* ignore add failure */
          }
        }
        navigate(`/prompts/${newId}`);
      }
    } catch (e) {
      setRemixError(e?.error?.message || "Remix failed");
    } finally {
      setRemixLoading(false);
    }
  };

  const doDelete = async () => {
    if (!isOwner) return;
    if (!window.confirm("Delete this prompt?")) return;
    try {
      await deletePrompt(id);
      navigate("/prompts");
    } catch (_) {}
  };

  const openCollectionsIfNeeded = () => {
    if (!user || collections.length || collectionsLoading) return;
    setCollectionsLoading(true);
    listCollections({ mine: "true", limit: 100 })
      .then((r) => {
        setCollections(r.data.items || []);
      })
      .catch(() => {})
      .finally(() => setCollectionsLoading(false));
  };

  const toggleAddPanel = () => {
    setShowAddPanel((s) => !s);
    setAddError(null);
    if (!showAddPanel) openCollectionsIfNeeded();
  };
  const toggleRemixPanel = () => {
    setShowRemixPanel((s) => !s);
    setRemixError(null);
    if (!showRemixPanel) {
      openCollectionsIfNeeded();
      setRemixTitle("");
      setRemixCollection("");
    }
  };

  const addCurrentPromptToCollection = async () => {
    if (!selectedCollection || !prompt || addingToCollection) return;
    setAddingToCollection(true);
    setAddError(null);
    try {
      await addPromptToCollection(selectedCollection, prompt._id || prompt.id);
      setShowAddPanel(false);
    } catch (e) {
      setAddError(e?.error?.message || "Failed to add");
    } finally {
      setAddingToCollection(false);
    }
  };

  if (loading)
    return (
      <div className="px-6 py-10 text-sm text-[var(--pv-text-dim)]">
        Loading...
      </div>
    );
  if (error) return <div className="px-6 py-10 form-error">{error}</div>;
  if (!prompt)
    return (
      <div className="px-6 py-10 text-sm text-[var(--pv-text-dim)]">
        Not found.
      </div>
    );

  return (
    <motion.main
      aria-labelledby="prompt-title"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative px-5 md:px-6 py-8 max-w-5xl mx-auto"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,var(--pv-orange)_0%,transparent_70%)] opacity-[0.05]" />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {!editing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
          >
            <header className="space-y-4">
              <h1 id="prompt-title" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent flex flex-wrap items-center gap-3">
              {prompt.title}
                {prompt.visibility === 'private' && (
                  <span className="px-2 py-1 rounded-md text-[10px] font-medium bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-[var(--pv-text-dim)] uppercase tracking-wide">Private</span>
                )}
              </h1>
              {prompt.description && (
                <p className="mt-1 text-sm md:text-base text-[var(--pv-text-dim)] leading-relaxed max-w-prose">
                  {prompt.description}
                </p>
              )}
              <ul className="flex flex-wrap gap-4 text-[11px] font-medium text-[var(--pv-text-dim)]">
                {statItems.map(s => (
                  <li key={s.label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]/60">
                    <span className="text-[var(--pv-text)]">{s.value}</span>{s.label}
                  </li>
                ))}
              </ul>
            </header>
            <div className="mt-6 relative group">
              <pre className="p-5 rounded-xl bg-[#0d0f12] border border-[var(--pv-border)] text-[13px] leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto shadow-inner pr-16">
                {activeVersion ? activeVersion.content : prompt.content}
              </pre>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.92 }}
                onClick={copyContent}
                disabled={!prompt?.content || copied}
                aria-label={copied ? "Copied" : "Copy prompt to clipboard"}
                className="absolute top-2 right-2 inline-flex items-center justify-center h-9 w-9 rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)]/70 backdrop-blur-sm text-[var(--pv-text-dim)] hover:text-[var(--pv-text)] hover:bg-[var(--pv-surface-hover)] transition-colors shadow-sm disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-orange)]/60"
              >
                {copied ? <Check className="h-4 w-4 text-[var(--pv-orange)]" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">{copied ? "Copied!" : "Copy"}</span>
              </motion.button>
            </div>
            {prompt.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {prompt.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-[11px] font-medium bg-[var(--pv-surface-alt)] border border-[var(--pv-border)]/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
            {activeVersion && (
              <div className="mt-3 flex items-center gap-3 text-[11px] text-[var(--pv-text-dim)]">
                <span>
                  Viewing version{" "}
                  <span className="text-[var(--pv-text)] font-medium">
                    v{activeVersion.versionNumber}
                  </span>
                </span>
                <button
                  onClick={() => setActiveVersion(null)}
                  className="px-2 py-1 rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] text-[11px] font-medium"
                >
                  Reset to Latest
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-7">
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={toggleLike} disabled={!user || liking} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] disabled:opacity-50">
                {likeState ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                <span>{likeState ? 'Unlike' : 'Like'} ({prompt.stats?.likes ?? 0})</span>
              </motion.button>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={toggleRemixPanel} disabled={!user} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] disabled:opacity-50">
                <Repeat2 className="h-4 w-4" />
                <span>{showRemixPanel ? 'Cancel Remix' : 'Remix'}</span>
              </motion.button>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={toggleAddPanel} disabled={!user} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] disabled:opacity-50">
                <FolderPlus className="h-4 w-4" />
                <span>{showAddPanel ? 'Cancel Add' : 'Add to Collection'}</span>
              </motion.button>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={() => setShowVersionsPanel(s => !s)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">
                <History className="h-4 w-4" />
                <span>{showVersionsPanel ? 'Close Versions' : 'Manage Versions'}</span>
              </motion.button>
              {isOwner && (
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={() => { if (!showVersionsPanel) setShowVersionsPanel(true); if (versions && versions.length) { const latest = versions[versions.length - 1]; setSelectedVersion(latest);} setVersionContent(prompt.content || ''); setVersionError(null); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Version</span>
                </motion.button>
              )}
              {isOwner && (
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={() => setEditing(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110">
                  <PenLine className="h-4 w-4" />
                  <span>Edit</span>
                </motion.button>
              )}
              {isOwner && (
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={doDelete} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-red-600/90 hover:bg-red-600 text-white">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </motion.button>
              )}
            </div>
            <AnimatePresence initial={false}>
              {showVersionsPanel && (
                <motion.div key="versions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="mt-8 card border border-[var(--pv-border)] rounded-xl p-5 space-y-4">
                  <h4 className="m-0 text-base font-semibold inline-flex items-center gap-2"><Layers2 className="h-4 w-4" /> Versions</h4>
                  <div className="flex flex-wrap gap-2">
                    {versions.map((v) => (
                      <button
                        key={v.versionNumber}
                        onClick={() => {
                          setSelectedVersion(v);
                          setVersionContent(v.content);
                          setVersionError(null);
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          selectedVersion?.versionNumber === v.versionNumber
                            ? "bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]"
                            : "bg-[var(--pv-surface-alt)] border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]"
                        }`}
                      >
                        v{v.versionNumber}
                      </button>
                    ))}
                  </div>
                  {selectedVersion ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs">
                          Version v{selectedVersion.versionNumber}
                        </strong>
                        <div className="flex gap-2">
                          {isOwner && (
                            <button
                              disabled={restoringVersion}
                              onClick={async () => {
                                setVersionError(null);
                                setRestoringVersion(true);
                                try {
                                  await restoreVersion(
                                    id,
                                    selectedVersion.versionNumber
                                  );
                                  await reloadVersions();
                                } catch (e) {
                                  setVersionError(
                                    e?.error?.message || "Restore failed"
                                  );
                                } finally {
                                  setRestoringVersion(false);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110 disabled:opacity-50"
                            >
                              <Save className="h-3.5 w-3.5" /> {restoringVersion ? "Restoring..." : "Restore as New"}
                            </button>
                          )}
                          {isOwner &&
                            versions.length > 1 &&
                            selectedVersion.versionNumber !==
                              versions[versions.length - 1].versionNumber && (
                              <button
                                disabled={deletingVersion}
                                onClick={async () => {
                                  if (!window.confirm("Delete version?"))
                                    return;
                                  setVersionError(null);
                                  setDeletingVersion(true);
                                  try {
                                    await deleteVersion(
                                      id,
                                      selectedVersion.versionNumber
                                    );
                                    await reloadVersions(true);
                                  } catch (e) {
                                    setVersionError(
                                      e?.error?.message || "Delete failed"
                                    );
                                  } finally {
                                    setDeletingVersion(false);
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-md bg-red-600/90 hover:bg-red-600 text-white disabled:opacity-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> {deletingVersion ? "Deleting..." : "Delete"}
                              </button>
                            )}
                        </div>
                      </div>
                      <textarea
                        value={versionContent}
                        onChange={(e) => setVersionContent(e.target.value)}
                        rows={8}
                        readOnly={!isOwner}
                        className="w-full min-h-[160px] px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 text-xs leading-relaxed"
                      />
                      {isOwner && (
                        <button
                          disabled={
                            creatingVersion || versionContent === prompt.content
                          }
                          onClick={async () => {
                            setVersionError(null);
                            if (
                              !versionContent.trim() ||
                              versionContent === prompt.content
                            ) {
                              setVersionError(
                                "Change content to create a new version"
                              );
                              return;
                            }
                            setCreatingVersion(true);
                            try {
                              await createVersion(id, versionContent);
                              await reloadVersions();
                            } catch (e) {
                              setVersionError(
                                e?.error?.message || "Create version failed"
                              );
                            } finally {
                              setCreatingVersion(false);
                            }
                          }}
                          className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110 disabled:opacity-50"
                        >
                          <PlusCircle className="h-3.5 w-3.5" /> {creatingVersion ? "Creating..." : "Create New Version"}
                        </button>
                      )}
                      {versionError && (
                        <div className="form-error text-xs">{versionError}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-[var(--pv-text-dim)]">
                      Select a version to inspect or restore.
                    </div>
                  )}
                </motion.div>
              )}
              {showAddPanel && user && (
                <motion.div key="add-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="mt-6 card border border-[var(--pv-border)] rounded-xl p-5 space-y-4">
                  <h4 className="m-0 text-base font-semibold inline-flex items-center gap-2"><FolderPlus className="h-4 w-4" /> Add to Collection</h4>
                  {collectionsLoading && (
                    <div className="text-[11px] text-[var(--pv-text-dim)]">
                      Loading collections...
                    </div>
                  )}
                  {!collectionsLoading && collections.length === 0 && (
                    <div className="text-[11px] text-[var(--pv-text-dim)]">
                      No collections yet. Create one first.
                    </div>
                  )}
                  {!collectionsLoading && collections.length > 0 && (
                    <select
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                      className="px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 text-sm"
                    >
                      <option value="">Select collection...</option>
                      {collections.map((c) => (
                        <option key={c._id || c.id} value={c._id || c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {addError && (
                    <div className="form-error text-xs">{addError}</div>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={addCurrentPromptToCollection}
                      disabled={!selectedCollection || addingToCollection}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110 disabled:opacity-50"
                    >
                      <PlusCircle className="h-3.5 w-3.5" /> {addingToCollection ? "Adding..." : "Add"}
                    </button>
                    <button
                      onClick={() => setShowAddPanel(false)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]"
                    >
                      <X className="h-3.5 w-3.5" /> Close
                    </button>
                  </div>
                </motion.div>
              )}
              {showRemixPanel && user && (
                <motion.div key="remix-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="mt-6 card border border-[var(--pv-border)] rounded-xl p-5 space-y-4">
                  <h4 className="m-0 text-base font-semibold inline-flex items-center gap-2"><Repeat2 className="h-4 w-4" /> Remix Prompt</h4>
                  <input
                    placeholder="Optional new title"
                    value={remixTitle}
                    onChange={(e) => setRemixTitle(e.target.value)}
                    className="px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 text-sm"
                  />
                  <div className="flex flex-col gap-2 text-[11px]">
                    <label className="text-[11px] text-[var(--pv-text-dim)]">
                      Save remix to a collection (optional)
                    </label>
                    <select
                      value={remixCollection}
                      onChange={(e) => setRemixCollection(e.target.value)}
                      onFocus={openCollectionsIfNeeded}
                      className="px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 text-sm"
                    >
                      <option value="">-- None --</option>
                      {collections.map((c) => (
                        <option key={c._id || c.id} value={c._id || c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {remixError && (
                    <div className="form-error text-xs">{remixError}</div>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={doRemix}
                      disabled={remixLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110 disabled:opacity-50"
                    >
                      <PlusCircle className="h-3.5 w-3.5" /> {remixLoading ? "Remixing..." : "Create Remix"}
                    </button>
                    <button
                      onClick={() => setShowRemixPanel(false)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]"
                    >
                      <X className="h-3.5 w-3.5" /> Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <section className="mt-12" aria-labelledby="versions-heading">
              <h3 id="versions-heading" className="text-lg font-semibold mb-3 inline-flex items-center gap-2"><History className="h-5 w-5" /> Versions</h3>
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {versions.map((v) => {
                  const isActive = activeVersion
                    ? activeVersion.versionNumber === v.versionNumber
                    : v.content === prompt.content && !activeVersion;
                  return (
                    <li key={v.versionNumber}>
                      <button
                        onClick={() => setActiveVersion(v)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveVersion(v);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60 ${
                          isActive
                            ? "bg-[var(--pv-orange)] text-[var(--pv-black)] border-[var(--pv-orange)]"
                            : "bg-[var(--pv-surface-alt)] border-[var(--pv-border)]/60 hover:bg-[var(--pv-surface-hover)] text-[var(--pv-text)]"
                        }`}
                        aria-pressed={isActive}
                        aria-label={`View version v${v.versionNumber}`}
                      >
                        v{v.versionNumber}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
            <section className="mt-12" aria-labelledby="remixes-heading">
              <h3 id="remixes-heading" className="text-lg font-semibold mb-3 inline-flex items-center gap-2"><Repeat2 className="h-5 w-5" /> Remixes</h3>
              {remixes.length === 0 && (
                <p className="text-sm text-[var(--pv-text-dim)]">
                  No remixes yet.
                </p>
              )}
              <ul className="grid gap-3 list-none p-0 m-0 sm:grid-cols-2 lg:grid-cols-3">
                {remixes.map((r) => (
                  <li key={r._id}>
                    <a
                      href={`/prompts/${r._id}`}
                      className="block px-4 py-3 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] text-sm font-medium truncate"
                    >
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
            className="card border border-[var(--pv-border)] rounded-xl p-6"
          >
            <PromptForm
              existing={prompt}
              onSaved={(p) => {
                setPrompt(p);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};
// Legacy inline style constants removed.

export default PromptDetail;
