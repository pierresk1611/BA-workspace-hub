import type { User } from '../types';

const USERS_KEY = "baWorkspace.users";

export const userService = {
  getUsers(): User[] {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      // Default admin
      const defaultAdmin: User = {
        id: "peter",
        username: "peter",
        displayName: "Peter",
        isAdmin: true,
        status: "active",
        role: "Workspace Admin",
        functionTitle: "Lead Business Analyst",
        avatarInitials: "PE",
        createdAt: new Date().toISOString(),
        createdBy: "system"
      };
      const users = [defaultAdmin];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return users;
    }
    return JSON.parse(stored);
  },

  getUserByUsername(username: string): User | undefined {
    return this.getUsers().find(u => u.username === username);
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  updateUser(id: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  deleteUser(id: string): void {
    if (id === 'peter') return;
    const users = this.getUsers().filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};
