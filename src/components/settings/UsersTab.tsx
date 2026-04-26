import React, { useState } from 'react';
import { 
  UserPlus, Search, Edit, Trash2, 
  UserCheck, UserX, Shield, Clock,
  MoreVertical, ChevronRight, X, AlertCircle,
  Copy, Check, Link as LinkIcon, RefreshCw, XCircle
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { cn } from '../../lib/utils';
import type { User, Invite } from '../../types';

export function UsersTab() {
  const { 
    users, invites, isAdmin, addUser, updateUser, 
    deleteUser, createInvite, revokeInvite 
  } = useSettings();
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ invite: Invite; token: string } | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    isAdmin: false
  });

  const [copied, setCopied] = useState(false);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-full">
          <UserX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900">Prístup zamietnutý</h3>
        <p className="text-slate-500 max-w-xs mx-auto">Iba Peter (Workspace Admin) môže spravovať používateľov.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addUser(formData);
    if (result.inviteToken) {
      setInviteResult({ invite: result.user as any, token: result.inviteToken }); // result.user is simplified here
    }
    setIsModalOpen(false);
    setFormData({ username: '', displayName: '', email: '', isAdmin: false });
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/accept-invite?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded">Aktívny</span>;
      case 'pending_invite': return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase rounded">Čaká na pozvánku</span>;
      case 'disabled': return <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[8px] font-black uppercase rounded">Deaktivovaný</span>;
      default: return null;
    }
  };

  const getInviteStatus = (username: string) => {
    const invite = invites.find(i => i.username === username);
    if (!invite) return null;

    switch (invite.status) {
      case 'active': return <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><Clock className="w-3 h-3" /> Aktívna pozvánka</span>;
      case 'used': return <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Použitá</span>;
      case 'expired': return <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Expirovaná</span>;
      case 'revoked': return <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Zrušená</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať používateľa..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <button 
          onClick={() => { setInviteResult(null); setIsModalOpen(true); }}
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Vytvoriť používateľa
        </button>
      </div>

      {/* Security Warning */}
      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4">
        <Shield className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest">Multi-User Security Notice</p>
          <p className="text-[11px] text-rose-700/80 font-medium leading-relaxed">
            Toto je prototypová izolácia dát. Každý používateľ vidí iba svoje projekty. 
            Všimnite si, že <strong>localStorage</strong> režim nie je bezpečný pre reálnu multi-user izoláciu citlivých dát. 
            Pre produkciu je potrebný backend.
          </p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Používateľ</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Pozvánka</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rola</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Akcie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black">
                        {user.avatarInitials || user.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none">{user.displayName || user.username}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(user.status)}
                      {getInviteStatus(user.username)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.isAdmin && <Shield className="w-3 h-3 text-indigo-500" />}
                      <span className="text-xs font-bold text-slate-600">{user.role || 'Používateľ'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {user.id !== 'peter' && (
                        <>
                          <button 
                            onClick={() => {
                              const newStatus = user.status === 'disabled' ? 'active' : 'disabled';
                              updateUser(user.id, { status: newStatus });
                            }}
                            title={user.status === 'disabled' ? 'Aktivovať' : 'Deaktivovať'}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              user.status === 'disabled' ? "text-emerald-500 hover:bg-emerald-50" : "text-amber-500 hover:bg-amber-50"
                            )}
                          >
                            {user.status === 'disabled' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>
                          {user.status === 'pending_invite' && (
                            <button 
                              onClick={async () => {
                                const invite = invites.find(i => i.username === user.username && i.status === 'active');
                                if (invite) revokeInvite(invite.id);
                                const result = await createInvite(user.username, user.email);
                                setInviteResult(result);
                              }}
                              title="Regenerovať pozvánku"
                              className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                      <button 
                        onClick={() => {
                          if (confirm(`Naozaj chcete vymazať používateľa @${user.username}?`)) {
                            deleteUser(user.id);
                          }
                        }}
                        disabled={user.id === 'peter'}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Nový používateľ</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Invite-based Onboarding</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Username *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="napr. jana.analyst"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <input 
                    type="checkbox"
                    id="is-admin"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="is-admin" className="text-xs font-bold text-slate-700">Nastaviť ako Workspace Admin</label>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
                <p className="text-[10px] text-indigo-700 font-bold leading-tight">
                  Používateľovi bude vygenerovaný jednorazový pozývací link, cez ktorý si sám nastaví heslo.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  Zrušiť
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Vytvoriť a Pozvať
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Result Modal */}
      {inviteResult && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setInviteResult(null)} />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <LinkIcon className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Pozvánka vytvorená</h3>
                <p className="text-slate-500 text-sm font-medium">Skopírujte tento link a pošlite ho používateľovi <strong>@{inviteResult.invite.username}</strong> bezpečným kanálom.</p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl relative group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left mb-2">Pozývací Link</p>
                <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl">
                  <code className="text-xs font-bold text-indigo-600 truncate flex-1">
                    {`${window.location.origin}/accept-invite?token=${inviteResult.token}`}
                  </code>
                  <button 
                    onClick={() => copyInviteLink(inviteResult.token)}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      copied ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-left">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-[10px] text-amber-700 font-bold leading-tight">
                  Pozor: Link sa zobrazí iba teraz. Po zatvorení okna sa k nemu už nedostanete (iba regeneráciou). Platnosť je 72 hodín.
                </p>
              </div>

              <button 
                onClick={() => setInviteResult(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
              >
                Hotovo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
