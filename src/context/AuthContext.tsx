import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const SESSION_KEY = 'ba_workspace_auth';

function getInitialAuth(): { isAuthenticated: boolean; username: string | null } {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { isAuthenticated: true, username: parsed.username || null };
    }
  } catch {
    // ignore
  }
  return { isAuthenticated: false, username: null };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = getInitialAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initial.isAuthenticated);
  const [username, setUsername] = useState<string | null>(initial.username);

  const login = useCallback(async (user: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: data.token, username: data.username }));
        setIsAuthenticated(true);
        setUsername(data.username);
        return { ok: true };
      } else {
        return { ok: false, error: data.error || 'Invalid credentials' };
      }
    } catch {
      // Network error or serverless not available locally — dev fallback handled in LoginPage
      return { ok: false, error: 'Network error. Check server connection.' };
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
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
