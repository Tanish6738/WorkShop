import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getMe, logout as apiLogout } from "../Services/Auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Attempt to load current user if token present
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getMe();
        if (res?.data && mounted) setUser(res.data);
      } catch (e) {
        // fail silently; token may be absent/expired
      } finally {
        if (mounted) setInitializing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (_) {
      /* ignore */
    }
    setUser(null);
  }, []);

  const value = { user, setUser, initializing, error, setError, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const Protected = ({ children, fallback = null }) => {
  const { user, initializing } = useAuth();
  if (initializing)
    return fallback || <div style={{ padding: 24 }}>Loading...</div>;
  if (!user) return fallback || <div style={{ padding: 24 }}>Unauthorized</div>;
  return children;
};

export default AuthContext;
