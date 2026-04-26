import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Users, BadgeCheck, Save, AlertCircle } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useSettings } from '../../context/SettingsContext';

export function ProfileTab() {
  const { currentUser } = useAuth();
  const { updateUser } = useSettings();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    role: '',
    team: '',
    functionTitle: '',
    avatarInitials: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        team: currentUser.team || '',
        functionTitle: currentUser.functionTitle || '',
        avatarInitials: currentUser.avatarInitials || ''
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: any = { ...formData };
    
    // If pending, mark as active when basic info is filled
    if (currentUser.status === 'pending_profile' && formData.displayName && formData.role) {
      updates.status = 'active';
      updates.profileCompletedAt = new Date().toISOString();
    }
    
    updateUser(currentUser.id, updates);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {currentUser.status === 'pending_profile' && (
        <div className="p-6 bg-indigo-600 rounded-3xl text-white flex items-center gap-6 shadow-xl shadow-indigo-100">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Dokončite si profil</h3>
            <p className="text-indigo-100 text-sm font-medium mt-1">
              Vyplňte svoje meno a rolu, aby ste mohli plnohodnotne pracovať vo workspace.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-sm space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center text-3xl md:text-5xl font-black border-4 border-white shadow-2xl relative group">
             {formData.avatarInitials || currentUser.username.slice(0, 2).toUpperCase()}
             <div className="absolute inset-0 bg-indigo-600/10 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{currentUser.displayName || currentUser.username}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded tracking-widest">@{currentUser.username}</span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase rounded tracking-widest">{currentUser.isAdmin ? 'Admin' : 'Member'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Display Name
            </label>
            <input 
              type="text" 
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              placeholder="Peter Analyst"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              placeholder="peter@company.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Funkcia / Titul
            </label>
            <input 
              type="text" 
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              placeholder="Lead Business Analyst"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Tím
            </label>
            <input 
              type="text" 
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              placeholder="Product Team A"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <BadgeCheck className="w-3.5 h-3.5" /> Iniciály (Avatar)
            </label>
            <input 
              type="text" 
              maxLength={2}
              value={formData.avatarInitials}
              onChange={(e) => setFormData({ ...formData, avatarInitials: e.target.value.toUpperCase() })}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              placeholder="PE"
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button 
              type="submit"
              className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Save className="w-5 h-5" /> Uložiť Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
