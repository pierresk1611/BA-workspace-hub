import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, WorkspaceSettings } from "../types";
import { useAuth } from "./AuthContext";

interface SettingsContextType {
  users: User[];
  settings: WorkspaceSettings;
  currentUser: User | undefined;
  isAdmin: boolean;
  addUser: (user: Partial<User>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateSettings: (updates: Partial<WorkspaceSettings>) => void;
  exportData: () => void;
  importData: (jsonData: string) => Promise<{ ok: boolean; error?: string }>;
}

const USERS_KEY = "baWorkspace.users";
const SETTINGS_KEY = "baWorkspace.workspaceSettings";
const DEFAULT_VERSION = "2.1.2";

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { username } = useAuth();
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      if (stored) return JSON.parse(stored);
      
      // Initialize with Peter as default admin
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
      return [defaultAdmin];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<WorkspaceSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
      return {
        workspaceName: "BA Workspace",
        workspaceDescription: "Project Intelligence Hub",
        dataMode: "Lokálne dáta v browseri",
        demoDataEnabled: false,
        version: DEFAULT_VERSION
      };
    } catch {
      return {
        workspaceName: "BA Workspace",
        workspaceDescription: "Project Intelligence Hub",
        dataMode: "Lokálne dáta v browseri",
        demoDataEnabled: false,
        version: DEFAULT_VERSION
      };
    }
  });

  const currentUser = users.find(u => u.username === username);
  const isAdmin = currentUser?.isAdmin || false;

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: userData.username || "",
      displayName: userData.displayName || "",
      email: userData.email || "",
      status: "pending_profile",
      isAdmin: false,
      createdAt: new Date().toISOString(),
      createdBy: "peter", // Default to Peter for now
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u));
  };

  const deleteUser = (id: string) => {
    if (id === "peter") return; // Cannot delete main admin
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateSettings = (updates: Partial<WorkspaceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const exportData = () => {
    const data = {
      projects: JSON.parse(localStorage.getItem("baWorkspace.projects") || "[]"),
      users,
      settings,
      notifications: JSON.parse(localStorage.getItem("baWorkspace.notifications") || "[]"),
      exportDate: new Date().toISOString(),
      version: settings.version
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ba-workspace-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (jsonData: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.projects || !Array.isArray(data.projects)) {
        throw new Error("Neplatná štruktúra dát (chýbajú projekty).");
      }
      
      if (data.projects) localStorage.setItem("baWorkspace.projects", JSON.stringify(data.projects));
      if (data.users) setUsers(data.users);
      if (data.settings) setSettings(data.settings);
      if (data.notifications) localStorage.setItem("baWorkspace.notifications", JSON.stringify(data.notifications));
      
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  };

  return (
    <SettingsContext.Provider value={{
      users,
      settings,
      currentUser,
      isAdmin,
      addUser,
      updateUser,
      deleteUser,
      updateSettings,
      exportData,
      importData
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
