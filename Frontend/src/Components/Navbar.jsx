import React, { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/"); };

  const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
  // Close on route change
  useEffect(()=>{ setMobileOpen(false); }, [location.pathname]);
  // Escape key
  useEffect(()=>{ const onKey = e=>{ if(e.key==='Escape') setMobileOpen(false); }; if(mobileOpen) window.addEventListener('keydown', onKey); return ()=>window.removeEventListener('keydown', onKey); }, [mobileOpen]);

  return (
  <header className="sticky top-0 z-30 w-full border-b border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur anim-fade-in">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
      <div className="flex items-center gap-3 md:gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <Link
                to="/"
                className="text-lg font-semibold brand-glow bg-gradient-to-r from-[var(--pv-orange)] to-[var(--pv-saffron)] bg-clip-text text-transparent"
              >
                PromptVault
              </Link>
            </motion.div>
            {/* Hamburger for mobile */}
            <motion.button
              whileTap={{ scale:0.9 }}
              onClick={toggleMobile}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              className="inline-flex sm:hidden relative w-10 h-10 items-center justify-center rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] hover:bg-[var(--pv-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-orange)]/60"
            >
              <span className="sr-only">Menu</span>
              <span className="block absolute h-[2px] w-5 bg-[var(--pv-white)] transition-all" style={{ transform: mobileOpen ? 'translateY(0) rotate(45deg)' : 'translateY(-6px)' }} />
              <span className="block absolute h-[2px] w-5 bg-[var(--pv-white)] transition-opacity" style={{ opacity: mobileOpen ? 0 : 1 }} />
              <span className="block absolute h-[2px] w-5 bg-[var(--pv-white)] transition-all" style={{ transform: mobileOpen ? 'translateY(0) rotate(-45deg)' : 'translateY(6px)' }} />
            </motion.button>
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-2 py-1 rounded-md hover:text-[var(--pv-orange)] transition-colors ${
                    isActive
                      ? "text-[var(--pv-orange)] font-semibold"
                      : "text-[var(--pv-text-dim)]"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/prompts"
                end
                className={({ isActive }) =>
                  `px-2 py-1 rounded-md hover:text-[var(--pv-orange)] transition-colors ${
                    isActive
                      ? "text-[var(--pv-orange)] font-semibold"
                      : "text-[var(--pv-text-dim)]"
                  }`
                }
              >
                Browse
              </NavLink>
              {user && (
                <NavLink
                  to="/prompts/mine"
                  className={({ isActive }) =>
                    `px-2 py-1 rounded-md hover:text-[var(--pv-orange)] transition-colors ${
                      isActive
                        ? "text-[var(--pv-orange)] font-semibold"
                        : "text-[var(--pv-text-dim)]"
                    }`
                  }
                >
                  My Prompts
                </NavLink>
              )}
              <NavLink
                to="/collections"
                end
                className={({ isActive }) =>
                  `px-2 py-1 rounded-md hover:text-[var(--pv-orange)] transition-colors ${
                    isActive
                      ? "text-[var(--pv-orange)] font-semibold"
                      : "text-[var(--pv-text-dim)]"
                  }`
                }
              >
                Collections
              </NavLink>
              {user && (
                <NavLink
                  to="/collections/mine"
                  className={({ isActive }) =>
                    `px-2 py-1 rounded-md hover:text-[var(--pv-orange)] transition-colors ${
                      isActive
                        ? "text-[var(--pv-orange)] font-semibold"
                        : "text-[var(--pv-text-dim)]"
                    }`
                  }
                >
                  My Collections
                </NavLink>
              )}
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    `px-2 py-1 rounded-md hover:text-[var(--pv-orange)] transition-colors ${
                      isActive
                        ? "text-[var(--pv-orange)] font-semibold"
                        : "text-[var(--pv-text-dim)]"
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
              {user && (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `px-2 py-1 rounded-md hover:text-[var(--pv-orange)] transition-colors ${
                      isActive
                        ? "text-[var(--pv-orange)] font-semibold"
                        : "text-[var(--pv-text-dim)]"
                    }`
                  }
                >
                  My Profile
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user && location.pathname.startsWith("/prompts/mine") && (
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/prompts/mine"
                  state={{ openForm: true }}
                  className="btn btn-ghost hidden sm:inline-flex"
                >
                  + New Prompt
                </Link>
              </motion.div>
            )}
            {user && location.pathname.startsWith("/collections/mine") && (
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/collections/mine"
                  state={{ openForm: true }}
                  className="btn btn-ghost hidden sm:inline-flex"
                >
                  + New Collection
                </Link>
              </motion.div>
            )}
            {!user && (
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link to="/auth" className="btn btn-primary text-sm">
                  Login / Register
                </Link>
              </motion.div>
            )}
            {user && (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex"
                >
                  <Link
                    to={`/users/${user.id || user._id}`}
                    className="flex items-center gap-2 text-sm text-[var(--pv-text-dim)] hover:text-[var(--pv-white)]"
                    title="Public profile"
                  >
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--pv-orange)] to-[var(--pv-saffron)] text-[var(--pv-black)] flex items-center justify-center font-semibold">
                      {(user.name || user.email || "?")
                        .slice(0, 1)
                        .toUpperCase()}
                    </span>
                    <span className="hidden sm:inline-block max-w-[140px] truncate">
                      {user.name || user.email}
                    </span>
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm px-3 py-1.5"
                >
                  Logout
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="nav-overlay"
              initial={{ opacity:0 }}
              animate={{ opacity:.5 }}
              exit={{ opacity:0 }}
              transition={{ duration:.25 }}
              onClick={()=>setMobileOpen(false)}
              className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm" />
            <motion.nav
              key="nav-panel"
              initial={{ opacity:0, y:-16 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-12 }}
              transition={{ duration:.35, ease:[0.4,0,0.2,1] }}
              className="absolute left-0 right-0 top-14 z-30 mx-auto w-full max-w-7xl px-4 md:px-6"
            >
              <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/95 backdrop-blur-sm shadow-lg overflow-hidden">
                <div className="grid gap-1 py-3 text-sm">
                  <MobileNavLink to="/" label="Home" />
                  <MobileNavLink to="/prompts" label="Browse" />
                  {user && <MobileNavLink to="/prompts/mine" label="My Prompts" />}
                  <MobileNavLink to="/collections" label="Collections" />
                  {user && <MobileNavLink to="/collections/mine" label="My Collections" />}
                  {user?.role === 'admin' && <MobileNavLink to="/admin" label="Admin" />}
                  {user && <MobileNavLink to="/profile" label="My Profile" />}
                  {!user && (
                    <div className="px-3 pt-2">
                      <Link to="/auth" className="w-full inline-flex justify-center rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] px-4 py-2 font-medium text-sm hover:brightness-110">Login / Register</Link>
                    </div>
                  )}
                  {user && (
                    <div className="flex gap-2 px-3 pt-2">
                      <Link to={`/users/${user.id || user._id}`} className="flex-1 inline-flex justify-center rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface-alt)] px-4 py-2 text-xs font-medium hover:bg-[var(--pv-surface-hover)]">Public Profile</Link>
                      <button onClick={handleLogout} className="flex-1 inline-flex justify-center rounded-md bg-[var(--pv-orange)] text-[var(--pv-black)] px-4 py-2 text-xs font-medium hover:brightness-110">Logout</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

const MobileNavLink = ({ to, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `mx-2 rounded-md px-3 py-2 flex items-center justify-between gap-2 transition-colors ${
        isActive
          ? 'bg-[var(--pv-surface-alt)] text-[var(--pv-orange)] font-semibold'
          : 'text-[var(--pv-text-dim)] hover:text-[var(--pv-white)] hover:bg-[var(--pv-surface-alt)]'
      }`
    }
  >
    <span>{label}</span>
  </NavLink>
);

export default Navbar;
