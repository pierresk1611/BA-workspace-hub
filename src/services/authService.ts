import { userService } from './userService';
import { hashString } from '../utils/crypto';
import type { User } from '../types';

const SESSION_KEY = 'ba_workspace_auth';

export const authService = {
  async login(username: string, password: string): Promise<{ ok: boolean; user?: User; error?: string }> {
    const user = userService.getUserByUsername(username);
    
    if (!user) {
      return { ok: false, error: 'Používateľ neexistuje.' };
    }

    if (user.status === 'disabled') {
      return { ok: false, error: 'Tento účet je deaktivovaný.' };
    }

    if (user.status === 'pending_invite') {
      return { ok: false, error: 'Účet ešte nie je aktivovaný. Použite pozývací link.' };
    }

    // Special case for Peter admin if no password hash yet (bootstrap)
    if (username === 'peter' && !user.passwordHash) {
       // In a real app, this would be an env var check or a bootstrap script
       // For this prototype, we allow a bypass for the first setup or use a default
       if (password === 'admin123') { // Temporary bootstrap password
          this.setSession(user);
          return { ok: true, user };
       }
    }

    if (user.passwordHash) {
      const passwordHash = await hashString(password);
      if (passwordHash === user.passwordHash) {
        this.setSession(user);
        userService.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
        return { ok: true, user };
      }
    }

    return { ok: false, error: 'Nesprávne heslo.' };
  },

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
  },

  setSession(user: User): void {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username }));
  },

  getSession(): { username: string } | null {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  getCurrentUser(): User | null {
    const session = this.getSession();
    if (!session) return null;
    return userService.getUserByUsername(session.username) || null;
  }
};
