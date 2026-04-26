import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

import type { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

import { authService } from '../services/authService';

function getInitialAuth(): { isAuthenticated: boolean; username: string | null; currentUser: User | null } {
  const user = authService.getCurrentUser();
  return { 
    isAuthenticated: !!user, 
    username: user?.username || null,
    currentUser: user || null
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = getInitialAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initial.isAuthenticated);
  const [username, setUsername] = useState<string | null>(initial.username);
  const [currentUser, setCurrentUser] = useState<User | null>(initial.currentUser);

  const login = useCallback(async (user: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const result = await authService.login(user, password);
    if (result.ok && result.user) {
      setIsAuthenticated(true);
      setUsername(result.user.username);
      setCurrentUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername(null);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
