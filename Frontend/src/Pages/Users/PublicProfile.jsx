import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, getUserPrompts, getUserCollections } from "../../Services/User.service.js"; // case-insensitive on win
import ProfileHeader from "../../Components/User/ProfileHeader.jsx";
import UserPrompts from "../../Components/User/UserPrompts.jsx";
import UserCollections from "../../Components/User/UserCollections.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpDown, ArrowDownAZ, ArrowUpAZ, Link2, Share2, ChevronRight, ChevronLeft } from "lucide-react";

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
  // Mobile tab selection (prompts | collections)
  const [activeTab, setActiveTab] = useState("prompts");
  // Enhancements
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [visiblePrompts, setVisiblePrompts] = useState(6);
  const [visibleCollections, setVisibleCollections] = useState(6);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoadingProfile(true);
    setErrorProfile(null);
    getUserProfile(id)
      .then((r) => setProfile(r.data))
      .catch((e) =>
        setErrorProfile(e?.error?.message || "Failed to load profile")
      )
      .finally(() => setLoadingProfile(false));

    setLoadingPrompts(true);
    setErrorPrompts(null);
    getUserPrompts(id)
      .then((r) => setPrompts(r.data))
      .catch((e) =>
        setErrorPrompts(e?.error?.message || "Failed to load prompts")
      )
      .finally(() => setLoadingPrompts(false));

    setLoadingCollections(true);
    setErrorCollections(null);
    getUserCollections(id)
      .then((r) => setCollections(r.data))
      .catch((e) =>
        setErrorCollections(e?.error?.message || "Failed to load collections")
      )
      .finally(() => setLoadingCollections(false));
  }, [id]);

  const tabButtonBase = "relative flex-1 px-4 py-2 text-sm font-medium focus:outline-none transition-colors";
  const underline = (is) => (is ? "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:w-8 after:rounded-full after:bg-[var(--pv-orange)]" : "");

  // Derived lists (filter + sort)
  const promptList = useMemo(() => {
    let list = Array.isArray(prompts) ? [...prompts] : [];
    if (filter) {
      const q = filter.toLowerCase();
      list = list.filter(
        (p) => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "title") return (a.title || "").localeCompare(b.title || "") * dir;
      if (sortField === "likes") return ((a.likes || 0) - (b.likes || 0)) * dir;
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return (da - db) * dir;
    });
    return list;
  }, [prompts, filter, sortField, sortDir]);

  const collectionList = useMemo(() => {
    let list = Array.isArray(collections) ? [...collections] : [];
    if (filter) {
      const q = filter.toLowerCase();
      list = list.filter(
        (c) => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "title") return (a.name || "").localeCompare(b.name || "") * dir;
      if (sortField === "likes") return ((a.likes || 0) - (b.likes || 0)) * dir;
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return (da - db) * dir;
    });
    return list;
  }, [collections, filter, sortField, sortDir]);

  const visiblePromptSlice = promptList.slice(0, visiblePrompts);
  const visibleCollectionSlice = collectionList.slice(0, visibleCollections);

  const showActionMsg = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 3000);
  };

  const copyProfileLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      showActionMsg("Profile link copied");
    } catch (_) {
      showActionMsg("Copy failed");
    }
  };
  const shareProfile = async () => {
    const url = window.location.href;
    const text = profile?.name ? `${profile.name}'s profile` : "Check this profile";
    if (navigator.share) {
      try { await navigator.share({ title: profile?.name || "Profile", text, url }); } catch (_) {}
    } else copyProfileLink();
  };

  const Controls = ({ context }) => (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
      <div className="flex gap-2 flex-1 items-stretch">
        <div className="flex flex-1 items-center gap-2 px-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] focus-within:ring-2 focus-within:ring-[var(--pv-orange)]/40 transition">
          <Search className="h-3.5 w-3.5 text-[var(--pv-text-dim)]" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={`Search ${context}`}
            className="flex-1 py-2 bg-transparent text-xs focus:outline-none"
          />
        </div>
        <select
          value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/40"
          >
          <option value="createdAt">Newest</option>
          <option value="title">Title</option>
          <option value="likes">Likes</option>
        </select>
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-xs hover:bg-[var(--pv-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/40"
          aria-label="Toggle sort direction"
        >
          {sortDir === "asc" ? <ArrowUpAZ className="h-3.5 w-3.5" /> : <ArrowDownAZ className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="flex gap-2 text-xs">
        <button onClick={copyProfileLink} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] hover:bg-[var(--pv-surface-hover)]"><Link2 className="h-3.5 w-3.5" /> Copy Link</button>
        <button onClick={shareProfile} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] hover:brightness-110"><Share2 className="h-3.5 w-3.5" /> Share</button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="pb-16"
    >
      {/* Hero / gradient backdrop */}
      <div className="relative bg-[radial-gradient(circle_at_30%_20%,rgba(255,153,0,.18),transparent_70%)] pt-6 pb-4 px-5 md:px-8 border-b border-[var(--pv-border)]">
        <div className="max-w-5xl mx-auto">
          <ProfileHeader
            loading={loadingProfile}
            error={errorProfile}
            profile={profile}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8">
        {/* Mobile Tabs */}
  <div className="md:hidden mt-8 bg-[var(--pv-surface-alt)]/60 border border-[var(--pv-border)] rounded-lg overflow-hidden backdrop-blur-sm relative">
          {actionMsg && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-[var(--pv-surface)] border border-[var(--pv-border)] text-[var(--pv-text-dim)]">{actionMsg}</motion.div>
          )}
          <div className="flex">
            <button
              onClick={() => setActiveTab("prompts")}
              className={`${tabButtonBase} ${
                activeTab === "prompts"
                  ? "text-[var(--pv-white)] bg-[var(--pv-surface)]" +
                    " shadow-inner" +
                    " " + underline(true)
                  : "text-[var(--pv-text-dim)] hover:text-[var(--pv-white)]"
              }`}
            >
              Prompts
            </button>
            <button
              onClick={() => setActiveTab("collections")}
              className={`${tabButtonBase} ${
                activeTab === "collections"
                  ? "text-[var(--pv-white)] bg-[var(--pv-surface)] shadow-inner " +
                    underline(true)
                  : "text-[var(--pv-text-dim)] hover:text-[var(--pv-white)]"
              }`}
            >
              Collections
            </button>
          </div>
          {/* Animated underline could also be done with layoutId, kept simple */}
          <div className="relative">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "prompts" && (
                <motion.div key="tab-prompts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className="p-5">
                  <Controls context="prompts" />
                  <UserPrompts loading={loadingPrompts} error={errorPrompts} prompts={visiblePromptSlice} />
                  {visiblePrompts < promptList.length && !loadingPrompts && (
                    <div className="mt-4 flex justify-center">
                      <button onClick={() => setVisiblePrompts((v) => v + 6)} className="px-4 py-2 text-xs rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Show More</button>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === "collections" && (
                <motion.div key="tab-collections" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className="p-5">
                  <Controls context="collections" />
                  <UserCollections loading={loadingCollections} error={errorCollections} collections={visibleCollectionSlice} />
                  {visibleCollections < collectionList.length && !loadingCollections && (
                    <div className="mt-4 flex justify-center">
                      <button onClick={() => setVisibleCollections((v) => v + 6)} className="px-4 py-2 text-xs rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Show More</button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop layout with controls + load more */}
        <div className="hidden md:block mt-12">
          {actionMsg && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mb-4 inline-block text-[11px] px-3 py-1 rounded-md bg-[var(--pv-surface-alt)] border border-[var(--pv-border)] text-[var(--pv-text-dim)]">{actionMsg}</motion.div>
          )}
          <Controls context="content" />
          <div className="grid gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <UserPrompts loading={loadingPrompts} error={errorPrompts} prompts={visiblePromptSlice} />
            {visiblePrompts < promptList.length && !loadingPrompts && (
              <div className="mt-4 flex justify-center">
                <button onClick={() => setVisiblePrompts((v) => v + 8)} className="px-4 py-2 text-xs rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Load More</button>
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
          >
            <UserCollections loading={loadingCollections} error={errorCollections} collections={visibleCollectionSlice} />
            {visibleCollections < collectionList.length && !loadingCollections && (
              <div className="mt-4 flex justify-center">
                <button onClick={() => setVisibleCollections((v) => v + 8)} className="px-4 py-2 text-xs rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)]">Load More</button>
              </div>
            )}
          </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicProfile;
