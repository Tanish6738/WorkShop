import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  console.log(user);
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const location = useLocation();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur anim-fade-in">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6">
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
    </header>
  );
};

export default Navbar;
