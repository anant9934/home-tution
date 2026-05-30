"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchApi } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
  studentProfile?: any;
  tutorProfile?: any;
  parentProfile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const token = document.cookie.match(/(^| )token=([^;]+)/)?.[2];
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await fetchApi("/users/me");
      setUser(data);
      setError(null);
    } catch (err: any) {
      setUser(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
