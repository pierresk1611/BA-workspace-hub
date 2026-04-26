import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Inbox, 
  Send, 
  History,
  MessageSquare,
  AlertCircle,
  Copy,
  User,
  ExternalLink, Info
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import type { ProjectHandover, HandoverStatus } from '../../types';

export function HandoverTabs() {
  const { handovers, acceptHandover, declineHandover, cancelHandover } = useProject();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'history'>('incoming');
  const [declineReason, setDeclineReason] = useState<Record<string, string>>({});

  if (!currentUser) return null;

  const incoming = handovers.filter(h => h.toUserId === currentUser.id && h.status === 'pending');
  const outgoing = handovers.filter(h => h.fromUserId === currentUser.id && h.status === 'pending');
  const history = handovers.filter(h => 
    (h.toUserId === currentUser.id || h.fromUserId === currentUser.id) && 
    h.status !== 'pending'
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusBadge = (status: HandoverStatus) => {
    switch (status) {
      case 'accepted': return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[8px] font-black uppercase tracking-widest">Prijaté</span>;
      case 'declined': return <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[8px] font-black uppercase tracking-widest">Odmietnuté</span>;
      case 'cancelled': return <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase tracking-widest">Zrušené</span>;
      case 'expired': return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[8px] font-black uppercase tracking-widest">Expirované</span>;
      default: return <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[8px] font-black uppercase tracking-widest">Čakajúce</span>;
    }
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  const renderHandoverCard = (h: ProjectHandover, type: 'incoming' | 'outgoing' | 'history') => {
    const expired = isExpired(h.expiresAt) && h.status === 'pending';
    const currentStatus = expired ? 'expired' : h.status;

    return (
      <div key={h.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-2xl flex items-center justify-center text-white shadow-lg",
              h.mode === 'transfer_ownership' ? "bg-indigo-600 shadow-indigo-100" : "bg-violet-600 shadow-violet-100"
            )}>
              {h.mode === 'transfer_ownership' ? <ArrowRightLeft className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                {h.projectName}
                {getStatusBadge(currentStatus as HandoverStatus)}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                   <User className="w-3 h-3" />
                   {type === 'incoming' ? `Odosielateľ: ${h.fromUsername}` : `Príjemca: ${h.toUsername}`}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                   <Clock className="w-3 h-3" />
                   {new Date(h.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
               {currentStatus === 'pending' ? 'Expiruje o' : 'Dokončené'}
             </p>
             <p className={cn(
               "text-xs font-bold",
               expired ? "text-rose-500" : "text-slate-900"
             )}>
               {currentStatus === 'pending' 
                 ? Math.ceil((new Date(h.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) + ' dní'
                 : new Date(h.completedAt || h.createdAt).toLocaleDateString()
               }
             </p>
          </div>
        </div>

        {h.message && (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Poznámka k handoveru
            </p>
            <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{h.message}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Režim</p>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">
                  {h.mode === 'transfer_ownership' ? 'Transfer Ownership' : 'Copy Snapshot'}
                </span>
                <Info className="w-3 h-3 text-slate-300" />
              </div>
           </div>
           <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checklist Status</p>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-600">Všetky body splnené odozsielateľom</span>
              </div>
           </div>
        </div>

        {/* Action Buttons */}
        {type === 'incoming' && currentStatus === 'pending' && (
          <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <input 
                type="text"
                placeholder="Dôvod odmietnutia (nepovinné)..."
                value={declineReason[h.id] || ''}
                onChange={(e) => setDeclineReason(prev => ({ ...prev, [h.id]: e.target.value }))}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
              />
              <button 
                onClick={() => declineHandover(h.id, declineReason[h.id])}
                className="px-6 py-2 bg-white border border-rose-200 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Odmietnuť
              </button>
              <button 
                onClick={() => acceptHandover(h.id)}
                className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Prijať projekt
              </button>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
               <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
               <p className="text-[9px] font-bold text-amber-800 leading-relaxed">
                 {h.mode === 'transfer_ownership' 
                   ? "Prijatím sa staneš výhradným vlastníkom projektu. Pôvodný vlastník k nemu stratí prístup." 
                   : "Prijatím vytvoríš vlastnú nezávislú kópiu tohto projektu."}
               </p>
            </div>
          </div>
        )}

        {type === 'outgoing' && currentStatus === 'pending' && (
          <div className="flex items-center justify-end pt-6 border-t border-slate-100">
            <button 
              onClick={() => cancelHandover(h.id)}
              className="px-6 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Zrušiť handover
            </button>
          </div>
        )}

        {type === 'history' && h.status === 'declined' && h.declineReason && (
          <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-3">
             <AlertCircle className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
             <p className="text-[10px] font-bold text-rose-800 leading-relaxed">
               Dôvod odmietnutia: "{h.declineReason}"
             </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Tab Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'incoming', label: 'Prijaté', icon: Inbox, count: incoming.length },
          { id: 'outgoing', label: 'Odoslané', icon: Send, count: outgoing.length },
          { id: 'history', label: 'História', icon: History, count: 0 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'incoming' && (
          incoming.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Inbox className="w-16 h-16 mx-auto mb-6 text-slate-200" />
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Žiadne nové handovery</h3>
            </div>
          ) : incoming.map(h => renderHandoverCard(h, 'incoming'))
        )}

        {activeTab === 'outgoing' && (
          outgoing.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Send className="w-16 h-16 mx-auto mb-6 text-slate-200" />
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Žiadne odoslané handovery</h3>
            </div>
          ) : outgoing.map(h => renderHandoverCard(h, 'outgoing'))
        )}

        {activeTab === 'history' && (
          history.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <History className="w-16 h-16 mx-auto mb-6 text-slate-200" />
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Žiadna história handoverov</h3>
            </div>
          ) : history.map(h => renderHandoverCard(h, 'history'))
        )}
      </div>

      {/* Info Section */}
      <div className="p-8 bg-indigo-50 rounded-[3rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white rounded-3xl text-indigo-600 shadow-xl shadow-indigo-100">
            <ArrowRightLeft className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">Project Handover Intelligence</h3>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Bezpečný prenos projektov a dát medzi analytikmi s auditom a kontrolou vlastníctva.
            </p>
          </div>
        </div>
        <button className="px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
           Prečítať dokumentáciu <ExternalLink className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
