import { useState } from 'react';
import { 
  CheckSquare, Search, Plus, Edit, Trash2, 
  Bot, Link2, ExternalLink, MoreVertical,
  CheckCircle2, Clock, AlertTriangle, FileText, 
  BarChart2, TrendingUp, Info, ChevronRight, ArrowRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { RequirementFormModal } from './RequirementFormModal';
import type { Requirement, RequirementStatus } from '../types';
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart as RePieChart, Pie
} from 'recharts';
import { cn } from '../lib/utils';

export function RequirementsView() {
  const { activeProject, deleteRequirement } = useProject();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequirementStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState('');
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  const [editingReq, setEditingReq] = useState<Requirement | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!activeProject) return null;

  const requirements = activeProject.requirements || [];

  const filteredReqs = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(search.toLowerCase()) || 
                          req.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesType = !typeFilter || req.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeReq = requirements.find(r => r.id === activeReqId);


  // Stats for charts
  const statusData = [
    { name: 'Done', value: requirements.filter(r => r.status === 'Done').length, color: '#22c55e' },
    { name: 'In Dev/Test', value: requirements.filter(r => r.status === 'In development' || r.status === 'In testing').length, color: '#3b82f6' },
    { name: 'Potvrdené', value: requirements.filter(r => r.status === 'Potvrdené' || r.status === 'Ready for refinement').length, color: '#6366f1' },
    { name: 'Draft', value: requirements.filter(r => r.status === 'Draft' || r.status === 'Na potvrdenie').length, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  const typeData = [
    { name: 'Business', value: requirements.filter(r => r.type === 'Business').length },
    { name: 'Functional', value: requirements.filter(r => r.type === 'Functional').length },
    { name: 'Technical', value: requirements.filter(r => r.type === 'Security' || r.type === 'Data' || r.type === 'Non-functional').length },
    { name: 'UX/UI', value: requirements.filter(r => r.type === 'UX').length },
  ].filter(d => d.value > 0);

  const progress = requirements.length > 0 
    ? Math.round((requirements.filter(r => r.status === 'Done').length / requirements.length) * 100) 
    : 0;

  const getStatusColor = (status: RequirementStatus) => {
    switch (status) {
      case 'Done': return 'bg-emerald-100 text-emerald-700';
      case 'In development':
      case 'In testing': return 'bg-blue-100 text-blue-700';
      case 'Potvrdené':
      case 'Ready for refinement': return 'bg-indigo-100 text-indigo-700';
      case 'Draft':
      case 'Na potvrdenie': return 'bg-slate-100 text-slate-500';
      case 'Obsolete': return 'bg-rose-100 text-rose-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
              <CheckSquare className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            Požiadavky
          </h1>
          <p className="text-[10px] md:text-sm text-slate-500 mt-1 font-medium hidden sm:block">Špecifikácie a register projektu.</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <div className="hidden sm:flex bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 items-center gap-4">
             <span className="text-[10px] font-black text-blue-700">{progress}%</span>
             <div className="w-16 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
             </div>
          </div>
          <button 
            onClick={() => { setEditingReq(undefined); setIsFormOpen(true); }}
            className="flex-1 md:flex-none px-4 md:px-6 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> <span>Pridať</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Left: Table & Filters */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8">
          
          {/* Charts Row - Stacked/Hidden on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-8">
              <div className="h-20 w-20 md:h-32 md:w-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={statusData} innerRadius={20} outerRadius={35} paddingAngle={5} dataKey="value">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1">
                <h3 className="text-[9px] md:text-sm font-black text-slate-800 uppercase tracking-widest">Status Hub</h3>
                <div className="grid grid-cols-1 gap-1">
                  {statusData.slice(0, 3).map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[9px] md:text-xs text-slate-500 font-bold">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <BarChart2 className="w-4 h-4 text-blue-500" /> Rozloženie
              </h3>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData}>
                    <XAxis dataKey="name" hide />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Filters & Table */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-3 md:p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 md:gap-4 items-center bg-slate-50/50">
              <div className="flex-1 relative w-full">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Hľadať..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] md:text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="flex-1 md:flex-none bg-white border border-slate-200 rounded-xl px-3 py-2 text-[9px] md:text-[10px] font-black text-slate-600 outline-none uppercase tracking-tight whitespace-nowrap">
                  <option value="">Všetky Typy</option>
                  <option value="Business">Business</option>
                  <option value="Functional">Functional</option>
                  <option value="Security">Security</option>
                  <option value="UX">UX</option>
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="flex-1 md:flex-none bg-white border border-slate-200 rounded-xl px-3 py-2 text-[9px] md:text-[10px] font-black text-slate-600 outline-none uppercase tracking-tight whitespace-nowrap">
                  <option value="">Statusy</option>
                  <option value="Potvrdené">Potvrdené</option>
                  <option value="In development">Vo vývoji</option>
                  <option value="Done">Hotové</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">ID</th>
                    <th className="px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Názov</th>
                    <th className="px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Typ</th>
                    <th className="px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-5 py-3 md:py-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredReqs.map(r => (
                    <tr 
                      key={r.id} 
                      onClick={() => setActiveReqId(r.id)}
                      className={`hover:bg-blue-50/30 transition-all cursor-pointer group ${activeReqId === r.id ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <span className="text-[9px] md:text-[10px] font-black text-slate-400">{r.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="min-w-0 max-w-[180px] md:max-w-xs">
                          <p className="text-[11px] md:text-sm font-black text-slate-900 truncate">{r.title}</p>
                          <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-tight truncate">{r.owner}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{r.type}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-tight ${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                         <ChevronRight className="w-4 h-4 text-slate-300" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Detail Sidebar - Mobile Drawer Overlay */}
        <div className={cn(
          "fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto bg-white lg:w-[450px] border-l border-slate-200 flex flex-col shadow-2xl transition-transform duration-500 lg:translate-x-0 overflow-hidden",
          activeReqId ? "translate-x-0" : "translate-x-full"
        )}>
          {activeReq ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
              <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 relative">
                <button 
                  onClick={() => setActiveReqId(null)}
                  className="lg:hidden absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="flex items-center justify-between mb-4 mt-6 lg:mt-0">
                  <span className="text-[9px] md:text-xs font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase border border-blue-200 tracking-widest">{activeReq.id}</span>
                  <button 
                    onClick={() => { setEditingReq(activeReq); setIsFormOpen(true); }}
                    className="p-2 bg-white hover:bg-blue-50 rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 transition-all shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-4">{activeReq.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-tight ${getStatusColor(activeReq.status)}`}>{activeReq.status}</span>
                  <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-tight">{activeReq.type}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-6 md:space-y-8 pb-32">
                <div>
                  <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Popis
                  </h4>
                  <div className="p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] md:text-sm text-slate-600 leading-relaxed font-medium italic">
                    "{activeReq.description}"
                  </div>
                </div>

                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                  <h4 className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest">Akceptačné kritériá</h4>
                  <div className="text-[10px] md:text-xs text-blue-800 font-bold whitespace-pre-wrap leading-relaxed">
                    {activeReq.acceptanceCriteria}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Owner</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">{activeReq.owner.charAt(0)}</div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-700 truncate">{activeReq.owner}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Deadline</h4>
                    <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] md:text-xs">
                      <Clock className="w-3.5 h-3.5" /> {activeReq.deadline || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prepojenia</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-700 uppercase">Jira Ticket</span>
                      <span className="text-[9px] font-black text-blue-600">{activeReq.relatedJiraKey || 'N/A'}</span>
                    </div>
                    {activeReq.sourceUrl && (
                      <a href={activeReq.sourceUrl} target="_blank" className="flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-100 text-indigo-600 transition-all">
                        <span className="text-[9px] font-black uppercase">Dokumentácia</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 flex gap-3">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Bot className="w-4 h-4" /> Analyzovať AI
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden lg:flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-100">
                <CheckSquare className="w-10 h-10 text-slate-100" />
              </div>
              <p className="text-xs text-slate-400 font-medium max-w-[200px] leading-relaxed">
                Vyberte požiadavku pre zobrazenie detailov a akceptačných kritérií.
              </p>
            </div>
          )}
        </div>
      </div>

      <RequirementFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingReq} 
      />
    </div>
  );
}
