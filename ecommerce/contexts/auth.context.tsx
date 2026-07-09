"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { User } from "@/models/user.model";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean; // ← nouveau
  signIn: (user: User, token: string) => void;
  signOut: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  // Rehydrate depuis localStorage au montage
  useEffect(() => {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  const storedUser = localStorage.getItem(USER_KEY);
  if (storedToken && storedUser) {
    if (isTokenExpired(storedToken)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } else {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }
  setHydrated(true); // ← après la lecture, quoi qu'il arrive
}, []);

  const signIn = useCallback((user: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
    setToken(token);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  }, []);

  // Retourne les headers Authorization à passer à chaque requête
  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!token) return {};
    if (isTokenExpired(token)) {
      signOut();
      return {};
    }
    return { Authorization: `Bearer ${token}` };
  }, [token, signOut]);

  return (
    <AuthContext.Provider value={{
    user, token, isAuthenticated: !!token && !isTokenExpired(token),
    hydrated, // ← exposé
    signIn, signOut, getAuthHeaders,
    }}> 
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}