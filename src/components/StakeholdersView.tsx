import { useState } from 'react';
import { 
  Users, Search, Filter, Plus, 
  Mail, MessageSquare, Phone, 
  ChevronRight, Star, Shield, 
  AlertTriangle, Clock, Info,
  MoreVertical, Send, Calendar
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';
import { EmptyState } from './Badge';
import type { DecisionPower } from '../types';

export function StakeholdersView() {
  const { activeProject } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPower, setFilterPower] = useState<DecisionPower | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  if (!activeProject) return null;

  const stakeholders = activeProject.stakeholders || [];

  const filteredStakeholders = stakeholders.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPower = filterPower === 'All' || s.decisionPower === filterPower;
    return matchesSearch && matchesPower;
  });

  const getPowerColor = (power: DecisionPower) => {
    switch (power) {
      case 'Decision maker': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Contributor': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Consulted': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Informed': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Blocker risk': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPowerIcon = (power: DecisionPower) => {
    switch (power) {
      case 'Decision maker': return <Star className="w-3 h-3" />;
      case 'Contributor': return <Shield className="w-3 h-3" />;
      case 'Blocker risk': return <AlertTriangle className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Stakeholder Mapa</h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Správa kľúčových osôb, ich rolí a rozhodovacej právomoci v rámci projektu {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
            <Plus className="w-5 h-5" /> Pridať Stakeholdera
          </button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Hľadať podľa mena alebo roly..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[60%]">
             {(['All', 'Decision maker', 'Contributor', 'Consulted', 'Informed', 'Blocker risk'] as const).map(power => (
               <button
                 key={power}
                 onClick={() => setFilterPower(power)}
                 className={cn(
                   "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                   filterPower === power ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                 )}
               >
                 {power}
               </button>
             ))}
          </div>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
           <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}
           >
             <Users className="w-5 h-5" />
           </button>
           <button 
            onClick={() => setViewMode('table')}
            className={cn("p-2.5 rounded-xl transition-all", viewMode === 'table' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}
           >
             <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Main Content */}
      {filteredStakeholders.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredStakeholders.map(s => (
              <div key={s.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl card-hover flex flex-col overflow-hidden relative group">
                <div className="p-8 pb-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-lg">
                      {s.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      {s.followUpDeadline && (
                        <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl animate-pulse border border-rose-100">
                           <Clock className="w-5 h-5" />
                        </div>
                      )}
                      <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 leading-tight">{s.name}</h3>
                  <p className="text-sm font-black text-indigo-600 mt-1 uppercase tracking-tight">{s.role}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{s.team}</p>

                  <div className={cn(
                    "mt-6 px-4 py-2 rounded-xl border text-[10px] font-black uppercase flex items-center gap-2.5 w-fit",
                    getPowerColor(s.decisionPower)
                  )}>
                    {getPowerIcon(s.decisionPower)}
                    {s.decisionPower}
                  </div>
                </div>

                <div className="px-8 py-6 bg-slate-50/50 flex-1 border-t border-slate-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Area of Responsibility</p>
                   <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{s.responsibilityArea}</p>
                   
                   {s.followUpDeadline && (
                     <div className="mt-5 p-4 bg-white rounded-[1.5rem] border border-rose-100 flex items-center justify-between shadow-sm group-hover:border-rose-300 transition-all">
                        <div className="flex items-center gap-3">
                           <Calendar className="w-4 h-4 text-rose-500" />
                           <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Follow-up: {s.followUpDeadline}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-rose-300" />
                     </div>
                   )}
                </div>

                <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                        <Mail className="w-5 h-5" />
                      </button>
                      <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                        <Phone className="w-5 h-5" />
                      </button>
                   </div>
                   <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all group-hover:bg-indigo-600">
                      <Send className="w-4 h-4" /> Reach Out
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
             <table className="w-full border-collapse">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Stakeholder</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Role & Team</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Decision Power</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Engagement</th>
                   <th className="px-8 py-5 text-right"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {filteredStakeholders.map(s => (
                   <tr key={s.id} className="hover:bg-slate-50/50 transition-all group">
                     <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 font-black text-sm shadow-inner border border-indigo-200/50">
                            {s.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-base font-black text-slate-900 block">{s.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 italic leading-none">{s.responsibilityArea}</span>
                          </div>
                       </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">{s.role}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.team}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className={cn(
                          "px-4 py-2 rounded-xl border text-[9px] font-black uppercase flex items-center gap-2.5 w-fit shadow-sm",
                          getPowerColor(s.decisionPower)
                        )}>
                          {getPowerIcon(s.decisionPower)}
                          {s.decisionPower}
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        {s.followUpDeadline ? (
                          <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-lg border border-rose-100 w-fit">
                             <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                             <span className="text-[10px] font-black text-rose-600 uppercase">{s.followUpDeadline}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">In Loop</span>
                        )}
                     </td>
                     <td className="px-8 py-6 text-right">
                        <button className="p-3 text-slate-300 hover:text-indigo-600 transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )
      ) : (
        <EmptyState 
          icon={Users}
          title="Žiadni stakeholderi"
          description="Mapa stakeholderov je prázdna. Identifikujte kľúčových hráčov a definujte ich právomoci."
          actionLabel="Pridať Stakeholdera"
          onAction={() => {}}
        />
      )}

      {/* RACI Strategy Card */}
      <div className="p-10 bg-indigo-900 rounded-[3.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl border-4 border-white/10">
         <div className="absolute -top-24 -right-24 p-8 opacity-5">
            <Users className="w-96 h-96" />
         </div>
         <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl border border-indigo-400/50">
                  <Star className="w-6 h-6 text-indigo-100 fill-indigo-200" />
               </div>
               <h2 className="text-3xl font-black tracking-tight leading-none">RACI & Influence Strategy</h2>
            </div>
            <p className="text-indigo-100 text-base font-medium leading-relaxed italic">
              "Kvalitná analýza bez zapojenia správnych ľudí je len dokument. Stakeholder mapa vám pomáha riadiť očakávania a minimalizovať riziká zmeny."
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'Decision Makers', val: stakeholders.filter(s => s.decisionPower === 'Decision maker').length },
                 { label: 'Risk Blockers', val: stakeholders.filter(s => s.decisionPower === 'Blocker risk').length },
                 { label: 'Contributors', val: stakeholders.filter(s => s.decisionPower === 'Contributor').length },
                 { label: 'Follow-ups', val: stakeholders.filter(s => s.followUpDeadline).length },
               ].map(s => (
                 <div key={s.label} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <p className="text-xl font-black text-white leading-none mb-1">{s.val}</p>
                    <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">{s.label}</p>
                 </div>
               ))}
            </div>
         </div>
         <div className="relative z-10 flex flex-col gap-3 min-w-[250px]">
            <button className="w-full py-4 bg-white text-indigo-900 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-50 active:scale-95 transition-all">Generovať RACI Matrix</button>
            <button className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] border border-indigo-500 hover:bg-indigo-700 active:scale-95 transition-all">Engagement Report</button>
         </div>
      </div>

    </div>
  );
}
