import type { Invite, InviteStatus } from '../types';
import { hashString, generateRandomToken } from '../utils/crypto';
import { userService } from './userService';

const INVITES_KEY = "baWorkspace.invites";
const INVITE_EXPIRY_HOURS = 72;

export const inviteService = {
  getInvites(): Invite[] {
    const stored = localStorage.getItem(INVITES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async createInvite(username: string, email?: string, createdBy = 'peter'): Promise<{ invite: Invite; token: string }> {
    const token = generateRandomToken();
    const tokenHash = await hashString(token);
    
    const invite: Invite = {
      id: `invite_${Date.now()}`,
      userId: username, // Link by username in prototype
      username,
      email,
      tokenHash,
      status: "active",
      createdAt: new Date().toISOString(),
      createdBy,
      expiresAt: new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()
    };

    const invites = this.getInvites();
    invites.push(invite);
    localStorage.setItem(INVITES_KEY, JSON.stringify(invites));

    return { invite, token };
  },

  async verifyToken(token: string): Promise<Invite | null> {
    const tokenHash = await hashString(token);
    const invites = this.getInvites();
    const invite = invites.find(i => i.tokenHash === tokenHash);

    if (!invite) return null;
    if (invite.status !== 'active') return null;
    if (new Date(invite.expiresAt) < new Date()) {
      this.updateStatus(invite.id, 'expired');
      return null;
    }

    return invite;
  },

  updateStatus(id: string, status: InviteStatus): void {
    const invites = this.getInvites();
    const index = invites.findIndex(i => i.id === id);
    if (index !== -1) {
      invites[index] = { ...invites[index], status };
      if (status === 'used') {
        invites[index].usedAt = new Date().toISOString();
      } else if (status === 'revoked') {
        invites[index].revokedAt = new Date().toISOString();
      }
      localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
    }
  },

  getInviteForUser(username: string): Invite | undefined {
    return this.getInvites().find(i => i.username === username && i.status === 'active');
  }
};
