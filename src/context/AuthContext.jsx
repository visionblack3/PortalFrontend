import { createContext, useContext, useState, useCallback, useMemo } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

function loadStoredUser() {
  try {
    const raw = localStorage.getItem("cp_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("cp_token"));

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    const nextUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
    };
    localStorage.setItem("cp_token", data.token);
    localStorage.setItem("cp_user", JSON.stringify(nextUser));
    setToken(data.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cp_token");
    localStorage.removeItem("cp_user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
