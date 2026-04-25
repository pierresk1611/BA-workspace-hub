import { useState } from 'react';
import { 
  Users, Search, Filter, Plus, 
  Mail, MessageSquare, Phone, 
  ChevronRight, Star, Shield, 
  AlertTriangle, Clock, Info,
  MoreVertical, Send, Calendar, Edit2
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';
import { EmptyState } from './Badge';
import { StakeholderFormModal } from './StakeholderFormModal';
import type { DecisionPower, Stakeholder } from '../types';

export function StakeholdersView() {
  const { activeProject } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPower, setFilterPower] = useState<DecisionPower | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | undefined>(undefined);

  if (!activeProject) return null;

  const stakeholders = activeProject.stakeholders || [];

  const filteredStakeholders = stakeholders.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPower = filterPower === 'All' || s.decisionPower === filterPower;
    return matchesSearch && matchesPower;
  });

  const handleEdit = (s: Stakeholder) => {
    setEditingStakeholder(s);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingStakeholder(undefined);
    setIsModalOpen(true);
  };

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
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-xl shadow-indigo-100">
               <Users className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            Stakeholder Mapa
          </h1>
          <p className="text-slate-500 font-medium text-[10px] md:text-sm mt-1 md:mt-2 max-w-2xl hidden sm:block">
            Správa kľúčových osôb pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleAdd}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            <Plus className="w-4 md:w-5 h-4 md:h-5" /> Pridať
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Filters & View Toggle */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 w-full">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Hľadať meno..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-hide pb-1 sm:pb-0">
               {(['All', 'Decision maker', 'Contributor', 'Consulted', 'Informed', 'Blocker risk'] as const).map(power => (
                 <button
                   key={power}
                   onClick={() => setFilterPower(power)}
                   className={cn(
                     "px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                     filterPower === power ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                   )}
                 >
                   {power}
                 </button>
               ))}
            </div>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl md:rounded-2xl border border-slate-200 self-end lg:self-auto">
             <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all", viewMode === 'grid' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}
             >
               <Users className="w-4 h-4 md:w-5 md:h-5" />
             </button>
             <button 
              onClick={() => setViewMode('table')}
              className={cn("p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all", viewMode === 'table' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}
             >
               <Filter className="w-4 h-4 md:w-5 md:h-5" />
             </button>
          </div>
        </div>

        {/* Main Content */}
        {filteredStakeholders.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {filteredStakeholders.map(s => (
                <div key={s.id} className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all flex flex-col overflow-hidden relative group">
                  <div className="p-6 md:p-8 pb-4 md:pb-6">
                    <div className="flex items-start justify-between mb-4 md:mb-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-lg shrink-0">
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2">
                        {s.followUpDeadline && (
                          <div className="p-2 md:p-2.5 bg-rose-50 text-rose-500 rounded-lg md:rounded-xl animate-pulse border border-rose-100">
                             <Clock className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                        )}
                        <button 
                          onClick={() => handleEdit(s)}
                          className="p-2 md:p-2.5 hover:bg-slate-50 rounded-lg md:rounded-xl text-slate-400 transition-colors"
                        >
                          <Edit2 className="w-4 md:w-5 h-4 md:h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight truncate">{s.name}</h3>
                    <p className="text-xs md:text-sm font-black text-indigo-600 mt-1 uppercase tracking-tight truncate">{s.role}</p>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 truncate">{s.team}</p>

                    <div className={cn(
                      "mt-4 md:mt-6 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border text-[8px] md:text-[10px] font-black uppercase flex items-center gap-2 w-fit",
                      getPowerColor(s.decisionPower)
                    )}>
                      {getPowerIcon(s.decisionPower)}
                      {s.decisionPower}
                    </div>
                  </div>

                  <div className="px-6 md:px-8 py-4 md:py-6 bg-slate-50/50 flex-1 border-t border-slate-50">
                     <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Responsibility</p>
                     <p className="text-[11px] md:text-sm font-bold text-slate-700 leading-relaxed italic line-clamp-2">"{s.responsibilityArea}"</p>
                     
                     {s.followUpDeadline && (
                       <div className="mt-4 md:mt-5 p-3 md:p-4 bg-white rounded-xl md:rounded-[1.5rem] border border-rose-100 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2 md:gap-3">
                             <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-500" />
                             <span className="text-[8px] md:text-[10px] font-black text-rose-600 uppercase tracking-widest">Follow-up: {s.followUpDeadline}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-300" />
                       </div>
                     )}
                  </div>

                  <div className="p-4 md:p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div className="flex items-center gap-1 md:gap-2">
                        {s.email && (
                          <a href={`mailto:${s.email}`} className="p-2 md:p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-xl transition-all border border-transparent hover:border-indigo-100">
                            <Mail className="w-4 md:w-5 h-4 md:h-5" />
                          </a>
                        )}
                        {s.phone && (
                          <a href={`tel:${s.phone}`} className="p-2 md:p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-xl transition-all border border-transparent hover:border-indigo-100">
                            <Phone className="w-4 md:w-5 h-4 md:h-5" />
                          </a>
                        )}
                        <button className="p-2 md:p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-xl transition-all border border-transparent hover:border-indigo-100">
                          <MessageSquare className="w-4 md:w-5 h-4 md:h-5" />
                        </button>
                     </div>
                     <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-slate-900 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl transition-all group-hover:bg-indigo-600">
                        <Send className="w-3.5 h-3.5 md:w-4 md:h-4" /> Reach Out
                     </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
               <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Stakeholder</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Role & Team</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Power</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Engagement</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStakeholders.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer" onClick={() => handleEdit(s)}>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex items-center gap-3 md:gap-4">
                             <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-700 font-black text-xs md:text-sm shadow-inner border border-indigo-200/50 shrink-0">
                               {s.name.substring(0, 2).toUpperCase()}
                             </div>
                             <div className="min-w-0">
                               <span className="text-sm md:text-base font-black text-slate-900 block truncate">{s.name}</span>
                               <span className="text-[9px] md:text-[10px] font-bold text-slate-400 italic leading-none truncate">{s.responsibilityArea}</span>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                           <div className="flex flex-col">
                             <span className="text-xs md:text-sm font-black text-slate-800 truncate">{s.role}</span>
                             <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{s.team}</span>
                           </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                           <div className={cn(
                             "px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border text-[8px] md:text-[9px] font-black uppercase flex items-center gap-2 w-fit shadow-sm",
                             getPowerColor(s.decisionPower)
                           )}>
                             {getPowerIcon(s.decisionPower)}
                             {s.decisionPower}
                           </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6 whitespace-nowrap">
                           {s.followUpDeadline ? (
                             <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-lg border border-rose-100 w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-[9px] md:text-[10px] font-black text-rose-600 uppercase">{s.followUpDeadline}</span>
                             </div>
                           ) : (
                             <span className="text-[9px] md:text-[10px] text-slate-300 font-black uppercase tracking-widest">In Loop</span>
                           )}
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleEdit(s); }}
                             className="p-2 md:p-3 text-slate-300 hover:text-indigo-600 transition-all"
                           >
                             <Edit2 className="w-4 md:w-5 h-4 md:h-5" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          )
        ) : (
          <EmptyState 
            icon={Users}
            title="Žiadni stakeholderi"
            description="Mapa stakeholderov je prázdna."
            actionLabel="Pridať Stakeholdera"
            onAction={handleAdd}
          />
        )}

        {/* RACI Strategy Card */}
        <div className="p-6 md:p-10 bg-indigo-900 rounded-3xl md:rounded-[3.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 overflow-hidden relative shadow-2xl border-4 border-white/10 shrink-0">
           <div className="absolute -top-24 -right-24 p-8 opacity-5 hidden md:block">
              <Users className="w-96 h-96" />
           </div>
           <div className="relative z-10 space-y-4 md:space-y-6 max-w-2xl text-center lg:text-left">
              <div className="flex items-center gap-3 md:gap-4 justify-center lg:justify-start">
                 <div className="p-2 md:p-3 bg-indigo-600 rounded-xl md:rounded-2xl shadow-xl border border-indigo-400/50">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-indigo-100 fill-indigo-200" />
                 </div>
                 <h2 className="text-xl md:text-3xl font-black tracking-tight leading-none">RACI & Influence Strategy</h2>
              </div>
              <p className="text-indigo-100 text-sm md:text-base font-medium leading-relaxed italic">
                "Stakeholder mapa vám pomáha riadiť očakávania a minimalizovať riziká zmeny."
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                 {[
                   { label: 'Decision Makers', val: stakeholders.filter(s => s.decisionPower === 'Decision maker').length },
                   { label: 'Risk Blockers', val: stakeholders.filter(s => s.decisionPower === 'Blocker risk').length },
                   { label: 'Contributors', val: stakeholders.filter(s => s.decisionPower === 'Contributor').length },
                   { label: 'Follow-ups', val: stakeholders.filter(s => s.followUpDeadline).length },
                 ].map(s => (
                   <div key={s.label} className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 text-center">
                      <p className="text-lg md:text-xl font-black text-white leading-none mb-1">{s.val}</p>
                      <p className="text-[7px] md:text-[8px] font-black text-indigo-300 uppercase tracking-widest">{s.label}</p>
                   </div>
                 ))}
              </div>
           </div>
           <div className="relative z-10 flex flex-col gap-3 w-full sm:w-auto min-w-[200px]">
              <button className="w-full py-3 md:py-4 bg-white text-indigo-900 rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl transition-all">RACI Matrix</button>
              <button className="w-full py-3 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] border border-indigo-500 transition-all">Report</button>
           </div>
        </div>
      </div>

      <StakeholderFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingStakeholder(undefined); }} 
        initialData={editingStakeholder}
      />
    </div>
  );
}
