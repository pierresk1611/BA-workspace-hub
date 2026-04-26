import React, { useState } from 'react';
import { X, Send, ShieldAlert, CheckCircle2, Copy, ArrowRightLeft, Info, Calendar } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { cn } from '../lib/utils';
import type { Project, HandoverMode } from '../types';

interface HandoverModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function HandoverModal({ project, isOpen, onClose }: HandoverModalProps) {
  const { sendHandover } = useProject();
  const { currentUser } = useAuth();
  const [toUserId, setToUserId] = useState('');
  const [mode, setMode] = useState<HandoverMode>('transfer_ownership');
  const [message, setMessage] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [checklist, setChecklist] = useState({
    documentationReady: false,
    openQuestionsReviewed: false,
    risksReviewed: false,
    deadlinesReviewed: false,
    accessNotesAdded: false
  });

  if (!isOpen || !currentUser) return null;

  // Get all active users except current
  const availableUsers = userService.getUsers().filter(u => u.id !== currentUser.id && u.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toUserId || !isConfirmed) return;

    const toUser = availableUsers.find(u => u.id === toUserId);
    if (!toUser) return;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    sendHandover({
      projectId: project.id,
      projectName: project.name,
      fromUserId: currentUser.id,
      fromUsername: currentUser.displayName || currentUser.username,
      toUserId: toUser.id,
      toUsername: toUser.displayName || toUser.username,
      mode,
      message,
      checklist,
      expiresAt: expiresAt.toISOString()
    });

    onClose();
  };

  const isChecklistComplete = Object.values(checklist).every(v => v === true);
  const isValid = toUserId && isChecklistComplete && isConfirmed;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Odovzdať projekt</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{project.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Recipient Selection */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Info className="w-3 h-3" /> Príjemca projektu
            </h3>
            <select 
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none"
              required
            >
              <option value="">Vybrať analytika / používateľa...</option>
              {availableUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.displayName || u.username} ({u.role || 'BA'})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selection */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Režim odovzdania</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('transfer_ownership')}
                className={cn(
                  "p-6 rounded-3xl border-2 text-left transition-all relative group",
                  mode === 'transfer_ownership' 
                    ? "border-indigo-600 bg-indigo-50/50" 
                    : "border-slate-100 hover:border-slate-200 bg-white"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                  mode === 'transfer_ownership' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                )}>
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 mb-2">Transfer Ownership</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Projekt prejde na nového vlastníka. Po prijatí ho už nebudeš vidieť vo svojom bežnom dashboarde.
                </p>
                {mode === 'transfer_ownership' && <CheckCircle2 className="absolute top-6 right-6 w-5 h-5 text-indigo-600" />}
              </button>

              <button
                type="button"
                onClick={() => setMode('copy_snapshot')}
                className={cn(
                  "p-6 rounded-3xl border-2 text-left transition-all relative group",
                  mode === 'copy_snapshot' 
                    ? "border-indigo-600 bg-indigo-50/50" 
                    : "border-slate-100 hover:border-slate-200 bg-white"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                  mode === 'copy_snapshot' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                )}>
                  <Copy className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 mb-2">Copy Snapshot</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Príjemca dostane samostatnú kópiu projektu k aktuálnemu dátumu. Tvoj pôvodný projekt ti zostane.
                </p>
                {mode === 'copy_snapshot' && <CheckCircle2 className="absolute top-6 right-6 w-5 h-5 text-indigo-600" />}
              </button>
            </div>
          </div>

          {/* Message & Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Správa pre príjemcu</h3>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Doplň dôležitý kontext k odovzdaniu..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platnosť (dni)</h3>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="number"
                  min="1"
                  max="30"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold italic">Automaticky expiruje po uplynutí času.</p>
            </div>
          </div>

          {/* Checklist */}
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Handover Checklist</h3>
            <div className="space-y-3">
              {[
                { key: 'documentationReady', label: 'Dokumentácia a Confluence zdroje sú aktuálne' },
                { key: 'openQuestionsReviewed', label: 'Otvorené otázky boli skontrolované' },
                { key: 'risksReviewed', label: 'Riziká a deadliny sú v aktuálnom stave' },
                { key: 'deadlinesReviewed', label: 'Míľniky projektu sú overené' },
                { key: 'accessNotesAdded', label: 'Prístupové a kontextové poznámky boli doplnené' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={(checklist as any)[item.key]}
                    onChange={(e) => setChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Confirmation */}
          <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-3">
              <p className="text-xs font-bold text-amber-900 leading-relaxed">
                Projekt nie je viditeľný pre iných používateľov, kým handover nie je prijatý.
                {mode === 'transfer_ownership' && " Po prijatí stratíš právo na editáciu a projekt prejde pod správu nového vlastníka."}
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-tight">Rozumiem a potvrdzujem handover</span>
              </label>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-sm font-black text-slate-500 uppercase tracking-widest hover:text-slate-700"
          >
            Zrušiť
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
          >
            <Send className="w-4 h-4" /> Odoslať handover
          </button>
        </div>
      </div>
    </div>
  );
}
