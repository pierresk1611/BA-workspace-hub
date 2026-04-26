import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, WorkspaceSettings, Invite } from '../types';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';
import { inviteService } from '../services/inviteService';

interface SettingsContextType {
  workspaceSettings: WorkspaceSettings;
  updateWorkspaceSettings: (settings: Partial<WorkspaceSettings>) => void;
  users: User[];
  invites: Invite[];
  addUser: (userData: Partial<User>) => Promise<{ user: User; inviteToken?: string }>;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  isAdmin: boolean;
  createInvite: (username: string, email?: string) => Promise<{ invite: Invite; token: string }>;
  revokeInvite: (inviteId: string) => void;
  exportData: () => void;
  importData: (jsonData: string) => Promise<{ ok: boolean; error?: string }>;
}

const SETTINGS_KEY = "baWorkspace.workspaceSettings";

const defaultSettings: WorkspaceSettings = {
  workspaceName: "BA Intelligence Hub",
  workspaceDescription: "Centrálny dashboard pre správu projektov, analýzu a dokumentáciu.",
  dataMode: "Local Prototype",
  demoDataEnabled: false,
  version: "2.1.2"
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  const [users, setUsers] = useState<User[]>(() => userService.getUsers());
  const [invites, setInvites] = useState<Invite[]>(() => inviteService.getInvites());

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(workspaceSettings));
  }, [workspaceSettings]);

  const updateWorkspaceSettings = (settings: Partial<WorkspaceSettings>) => {
    setWorkspaceSettings(prev => ({ ...prev, ...settings }));
  };

  const addUser = async (userData: Partial<User>) => {
    const newUser: User = {
      id: userData.username || `user_${Date.now()}`,
      username: userData.username || '',
      displayName: userData.displayName || '',
      email: userData.email || '',
      isAdmin: userData.isAdmin || false,
      status: "pending_invite",
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.username || 'system'
    };

    userService.saveUser(newUser);
    const { invite, token } = await inviteService.createInvite(newUser.username, newUser.email, currentUser?.username);
    
    setUsers(userService.getUsers());
    setInvites(inviteService.getInvites());
    
    return { user: newUser, inviteToken: token };
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    userService.updateUser(id, updates);
    setUsers(userService.getUsers());
  };

  const deleteUser = (id: string) => {
    userService.deleteUser(id);
    setUsers(userService.getUsers());
  };

  const createInvite = async (username: string, email?: string) => {
    const result = await inviteService.createInvite(username, email, currentUser?.username);
    setInvites(inviteService.getInvites());
    return result;
  };

  const revokeInvite = (inviteId: string) => {
    inviteService.updateStatus(inviteId, 'revoked');
    setInvites(inviteService.getInvites());
  };

  const exportData = () => {
    const data = {
      projects: localStorage.getItem("baWorkspace.projects"),
      users: localStorage.getItem("baWorkspace.users"),
      invites: localStorage.getItem("baWorkspace.invites"),
      settings: localStorage.getItem("baWorkspace.workspaceSettings"),
      notifications: localStorage.getItem("baWorkspace.notifications")
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ba-workspace-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = async (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.projects) localStorage.setItem("baWorkspace.projects", data.projects);
      if (data.users) localStorage.setItem("baWorkspace.users", data.users);
      if (data.invites) localStorage.setItem("baWorkspace.invites", data.invites);
      if (data.settings) localStorage.setItem("baWorkspace.workspaceSettings", data.settings);
      if (data.notifications) localStorage.setItem("baWorkspace.notifications", data.notifications);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Neplatný formát exportu." };
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      workspaceSettings, updateWorkspaceSettings, 
      users, invites, addUser, updateUser, deleteUser,
      isAdmin: currentUser?.isAdmin || false,
      createInvite, revokeInvite,
      exportData, importData 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
